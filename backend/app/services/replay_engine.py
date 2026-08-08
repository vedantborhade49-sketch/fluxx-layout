"""
FLUXX Chronological Environmental Replay Engine
Maintains replay state, temporal delta scheduling, real-time IDW spatial updates, and live WebSocket broadcasts.
"""

import asyncio
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime

from app.services.csv_loader import load_kharghar_csv
from app.services.eri_engine import calculate_eri
from app.ai.anomaly_detector import anomaly_detector
from app.services.websocket_manager import ws_manager

logger = logging.getLogger("fluxx.replay")

class ReplayEngine:
    def __init__(self):
        self.samples: List[Dict[str, Any]] = []
        self.current_index: int = 0
        self.is_playing: bool = False
        self.playback_speed: float = 1.0
        self.task: Optional[asyncio.Task] = None
        self.alerts_history: List[Dict[str, Any]] = []
        self.load_dataset()

    def load_dataset(self):
        """Loads and sorts the Kharghar dataset."""
        self.samples = load_kharghar_csv()
        self.current_index = 0
        self.is_playing = False
        logger.info(f"Replay Engine initialized with {len(self.samples)} samples.")

    def get_status(self) -> Dict[str, Any]:
        """Returns comprehensive replay status."""
        total = len(self.samples)
        curr = self.samples[self.current_index] if total > 0 and self.current_index < total else None
        
        status_mode = "COMPLETED" if self.current_index >= total - 1 and not self.is_playing else ("PLAYING" if self.is_playing else "PAUSED")

        return {
            "playing": self.is_playing,
            "status": status_mode,
            "speed": self.playback_speed,
            "currentSample": self.current_index + 1 if total > 0 else 0,
            "totalSamples": total,
            "timestamp": curr.get("timestamp") if curr else datetime.utcnow().isoformat(),
            "source": "kharghar_csv",
            "mode": "replay"
        }

    def get_current_reading(self) -> Optional[Dict[str, Any]]:
        """Returns the current active sample reading."""
        if not self.samples:
            return None
        idx = min(self.current_index, len(self.samples) - 1)
        return self.samples[idx]

    def get_all_samples(self) -> List[Dict[str, Any]]:
        """Returns all loaded samples for map path and trajectory bounds."""
        return self.samples

    async def start(self):
        """Starts or resumes playback."""
        if self.is_playing:
            return
        self.is_playing = True
        
        # If at the end, restart from beginning
        if self.current_index >= len(self.samples) - 1:
            self.current_index = 0
            anomaly_detector.reset()

        if self.task is None or self.task.done():
            self.task = asyncio.create_task(self._playback_loop())

        await self._broadcast_status("replay_started")
        logger.info(f"Replay started at sample {self.current_index + 1}/{len(self.samples)} (speed: {self.playback_speed}x)")

    async def pause(self):
        """Pauses playback."""
        self.is_playing = False
        if self.task and not self.task.done():
            self.task.cancel()
            self.task = None

        await self._broadcast_status("replay_paused")
        logger.info(f"Replay paused at sample {self.current_index + 1}/{len(self.samples)}")

    async def reset(self):
        """Resets playback to the first sample."""
        await self.pause()
        self.current_index = 0
        anomaly_detector.reset()
        self.alerts_history.clear()
        
        # Broadcast initial sample & reset event
        await self._broadcast_current_sample()
        await self._broadcast_status("replay_reset")
        logger.info("Replay reset to sample 1")

    async def set_speed(self, speed: float):
        """Sets playback speed multiplier (0.5x, 1x, 2x, 4x)."""
        if speed > 0:
            self.playback_speed = float(speed)
            await self._broadcast_status("speed_changed")
            logger.info(f"Replay speed set to {self.playback_speed}x")

    async def seek(self, sample_number: int):
        """Seeks to a specific sample index (1-based)."""
        if not self.samples:
            return
        idx = max(0, min(sample_number - 1, len(self.samples) - 1))
        self.current_index = idx
        await self._broadcast_current_sample()
        await self._broadcast_status("seeked")
        logger.info(f"Replay seeked to sample {self.current_index + 1}")

    async def _broadcast_status(self, event_name: str = "replay_status"):
        """Broadcasts current replay status to all WebSocket subscribers."""
        status = self.get_status()
        await ws_manager.broadcast({
            "type": event_name,
            "event": event_name,
            "data": status
        })

    async def _broadcast_current_sample(self):
        """Computes ERI, runs Anomaly Detection, and dispatches standardized events."""
        if not self.samples:
            return

        sample = self.samples[self.current_index]
        sensors = sample.get("sensors", {})
        ts = sample.get("timestamp")

        # 1. Compute dynamic ERI
        eri = calculate_eri(sensors, ts)

        # 2. Run Anomaly Detection
        anomaly = anomaly_detector.evaluate_sample(sample)
        if anomaly:
            self.alerts_history.append(anomaly)
            await ws_manager.broadcast({
                "type": "alert",
                "event": "alert",
                "data": anomaly
            })

        # 3. Broadcast Standard Sensor Reading Event
        await ws_manager.broadcast({
            "type": "sensor_reading",
            "event": "sensor_reading",
            "data": {
                "sample": self.current_index + 1,
                "total_samples": len(self.samples),
                "timestamp": sample["timestamp"],
                "source": sample.get("source", "kharghar_csv"),
                "mode": sample.get("mode", "replay"),
                "location": sample["location"],
                "sensors": sample["sensors"],
                "eri": eri
            }
        })

        # 4. Broadcast ERI Update
        await ws_manager.broadcast({
            "type": "eri_update",
            "event": "eri_update",
            "data": eri
        })

    async def _playback_loop(self):
        """Asynchronous loop stepping through observations."""
        try:
            while self.is_playing and self.current_index < len(self.samples):
                await self._broadcast_current_sample()

                # Step forward
                if self.current_index < len(self.samples) - 1:
                    # Calculate delay: Base 1.5s per step scaled inversely by speed
                    base_delay = 1.5 / self.playback_speed
                    await asyncio.sleep(base_delay)
                    self.current_index += 1
                else:
                    # Reached the end
                    self.is_playing = False
                    await self._broadcast_status("replay_completed")
                    logger.info("Replay completed all 50 samples.")
                    break

        except asyncio.CancelledError:
            pass
        except Exception as e:
            logger.error(f"Error in replay loop: {e}")
            self.is_playing = False

# Singleton instance
replay_engine = ReplayEngine()
