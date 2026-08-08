import asyncio
import math
import random
import logging
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from app.services.websocket_manager import ws_manager
from app.services.alert_engine import alert_engine
from app.ai.prediction_engine import prediction_engine
from app.ai.anomaly_detector import anomaly_detector
from app.ai.vision_detector import vision_detector
from app.database import SessionLocal
from app.models.drone import Drone
from app.models.sensor import SensorReading
from app.models.heatmap import HeatmapPoint
from app.models.weather import WeatherData

logger = logging.getLogger(__name__)

class DroneSimulationState:
    def __init__(
        self,
        drone_id: str,
        name: str,
        base_lat: float,
        base_lng: float,
        mission_id: str,
        zone_type: str, # "industrial", "urban", "forest"
        battery: float = 94.0
    ):
        self.drone_id = drone_id
        self.name = name
        self.base_lat = base_lat
        self.base_lng = base_lng
        self.lat = base_lat
        self.lng = base_lng
        self.altitude = 120.0
        self.speed = 12.5
        self.heading = 45.0
        self.battery = battery
        self.signal_strength = 98.0
        self.status = "ACTIVE" # ACTIVE, HOVER, RTH, EMERGENCY
        self.mission_id = mission_id
        self.zone_type = zone_type
        self.angle = random.uniform(0, math.pi * 2)
        self.orbit_radius = 0.006 # ~600m
        self.injected_spike = False
        self.spike_timer = 0

class PlatformSimulator:
    def __init__(self):
        self.running = False
        self.task: Optional[asyncio.Task] = None
        self.interval = 1.5 # seconds
        self.drones: Dict[str, DroneSimulationState] = {
            "VTOL-001": DroneSimulationState("VTOL-001", "SkyGuardian Pro", 37.7749, -122.4194, "MSN-2026-001", "industrial", 91.5),
            "VTOL-002": DroneSimulationState("VTOL-002", "AeroSentry X8", 37.7840, -122.4080, "MSN-2026-002", "urban", 87.0),
            "VTOL-003": DroneSimulationState("VTOL-003", "EcoHawk Ranger", 37.7650, -122.4350, "MSN-2026-003", "forest", 96.0)
        }
        self.global_wind_speed = 4.8
        self.global_wind_dir = 210.0
        self.global_temp = 22.4
        self.global_humidity = 58.0
        self.historical_heatmap_points: List[Dict[str, Any]] = []
        self.latest_readings: Dict[str, Any] = {}

    def get_latest_reading(self, drone_id: str = "VTOL-001") -> Dict[str, Any]:
        if drone_id in self.latest_readings:
            return self.latest_readings[drone_id]
        return {
            "aqi": 176.0,
            "pm25": 68.0,
            "pm10": 145.0,
            "co2": 620.0,
            "voc": 320.0,
            "ozone": 48.0,
            "methane": 3.2,
            "temperature": 31.2,
            "humidity": 68.0,
            "wind_speed": 5.2,
            "wind_direction": 210.0,
            "noise_level": 64.0
        }

    def start(self):
        if not self.running:
            self.running = True
            self.task = asyncio.create_task(self._simulation_loop())
            logger.info("FLUXX Drone & Sensor Platform Simulator started.")

    def stop(self):
        self.running = False
        if self.task:
            self.task.cancel()
            self.task = None
        logger.info("Simulator stopped.")

    def inject_pollution_spike(self, drone_id: str = "VTOL-001"):
        """Manually trigger an acute pollution/gas leak event for testing."""
        if drone_id in self.drones:
            self.drones[drone_id].injected_spike = True
            self.drones[drone_id].spike_timer = 15 # duration in simulation ticks
            logger.warning(f"Injected acute pollution spike on {drone_id}")

    def trigger_emergency_rth(self, drone_id: str = "VTOL-001"):
        """Trigger emergency Return-To-Home sequence."""
        if drone_id in self.drones:
            self.drones[drone_id].status = "RTH"
            self.drones[drone_id].battery = max(8.0, self.drones[drone_id].battery - 25.0)
            logger.warning(f"Triggered Emergency RTH on {drone_id}")

    async def _simulation_loop(self):
        tick = 0
        while self.running:
            try:
                tick += 1
                await self._step(tick)
                await asyncio.sleep(self.interval)
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in simulation loop: {e}", exc_info=True)
                await asyncio.sleep(self.interval)

    async def _step(self, tick: int):
        now = datetime.now(timezone.utc)
        
        # Micro fluctuations in atmospheric conditions
        self.global_wind_speed = max(1.0, min(18.0, self.global_wind_speed + random.uniform(-0.3, 0.3)))
        self.global_wind_dir = (self.global_wind_dir + random.uniform(-2.0, 2.0)) % 360.0
        
        for drone_id, state in self.drones.items():
            # 1. Update Flight Physics & GPS
            state.angle += 0.05 # orbital movement
            state.heading = math.degrees(state.angle + math.pi / 2.0) % 360.0
            
            # Trajectory with serpentine oscillation
            d_lat = math.sin(state.angle) * state.orbit_radius
            d_lng = math.cos(state.angle) * state.orbit_radius * 1.3
            state.lat = state.base_lat + d_lat
            state.lng = state.base_lng + d_lng
            
            # Altitude & Speed micro turbulence
            state.altitude = 120.0 + math.sin(state.angle * 2.0) * 8.0
            state.speed = 12.0 + math.cos(state.angle) * 1.5
            
            # Battery consumption (~0.03% per tick)
            if state.battery > 5.0:
                state.battery -= 0.03
            state.battery = round(state.battery, 2)
            
            # Signal RSSI
            state.signal_strength = round(max(75.0, 98.0 - (state.altitude / 100.0) * 2.0 + random.uniform(-1.0, 1.0)), 1)
            
            # 2. Compute Environmental & Multi-Gas Sensor Readings
            is_spike = False
            if state.injected_spike and state.spike_timer > 0:
                is_spike = True
                state.spike_timer -= 1
                if state.spike_timer <= 0:
                    state.injected_spike = False
            
            if state.zone_type == "industrial":
                # Industrial refinery baseline
                base_pm25 = 28.0 if not is_spike else 125.0
                base_pm10 = 55.0 if not is_spike else 185.0
                base_co2 = 520.0 if not is_spike else 980.0
                base_voc = 210.0 if not is_spike else 580.0
                base_methane = 2.4 if not is_spike else 22.0
                base_aqi = 68.0 if not is_spike else 165.0
                noise_base = 65.0
            elif state.zone_type == "urban":
                # Urban metro & transit
                base_pm25 = 18.0 if not is_spike else 95.0
                base_pm10 = 38.0 if not is_spike else 140.0
                base_co2 = 440.0 if not is_spike else 750.0
                base_voc = 130.0 if not is_spike else 380.0
                base_methane = 1.9
                base_aqi = 48.0 if not is_spike else 120.0
                noise_base = 72.0
            else: # forest
                # Forest & agricultural preserve
                base_pm25 = 8.0 if not is_spike else 85.0
                base_pm10 = 15.0 if not is_spike else 110.0
                base_co2 = 390.0 if not is_spike else 620.0
                base_voc = 65.0 if not is_spike else 240.0
                base_methane = 1.6
                base_aqi = 25.0 if not is_spike else 115.0
                noise_base = 42.0
                
            # Add stochastic sensor noise
            reading = {
                "latitude": round(state.lat, 6),
                "longitude": round(state.lng, 6),
                "altitude": round(state.altitude, 1),
                "battery": round(state.battery, 1),
                "aqi": round(max(10.0, base_aqi + random.uniform(-4.0, 4.0)), 1),
                "pm25": round(max(2.0, base_pm25 + random.uniform(-2.5, 2.5)), 1),
                "pm10": round(max(4.0, base_pm10 + random.uniform(-4.0, 4.0)), 1),
                "co2": round(max(350.0, base_co2 + random.uniform(-15.0, 15.0)), 1),
                "voc": round(max(20.0, base_voc + random.uniform(-12.0, 12.0)), 1),
                "ozone": round(max(10.0, 32.0 + random.uniform(-3.0, 3.0)), 1),
                "methane": round(max(1.2, base_methane + random.uniform(-0.2, 0.2)), 2),
                "temperature": round(self.global_temp + random.uniform(-0.5, 0.5), 1),
                "humidity": round(max(15.0, min(99.0, self.global_humidity + random.uniform(-1.0, 1.0))), 1),
                "pressure": round(1013.25 + random.uniform(-0.4, 0.4), 1),
                "wind_speed": round(self.global_wind_speed, 1),
                "wind_direction": round(self.global_wind_dir, 1),
                "uv_index": 4.8,
                "noise_level": round(noise_base + random.uniform(-3.0, 3.0), 1)
            }
            self.latest_readings[drone_id] = reading
            
            # 3. Evaluate Alerts
            triggered_alerts = alert_engine.evaluate_reading(reading, drone_id)
            
            # 4. Generate AI Predictions & YOLO Vision Bounding Boxes
            ai_forecast = prediction_engine.forecast_aqi(
                reading["aqi"], reading["wind_speed"], reading["temperature"], reading["humidity"]
            )
            ai_recommendations = prediction_engine.generate_recommendations(reading)
            vision_boxes = vision_detector.get_live_detections(drone_id, reading["aqi"])
            
            ai_payload = {
                **ai_forecast,
                **ai_recommendations,
                "detections": vision_boxes
            }
            
            # 5. Construct Telemetry Packet
            telemetry_payload = {
                "drone_id": drone_id,
                "name": state.name,
                "model": "Fluxx AeroVTOL X8",
                "firmware": "v4.2.1-PRO",
                "status": state.status,
                "battery": state.battery,
                "latitude": reading["latitude"],
                "longitude": reading["longitude"],
                "altitude": reading["altitude"],
                "speed": round(state.speed, 1),
                "heading": round(state.heading, 1),
                "signal_strength": state.signal_strength,
                "mission_id": state.mission_id,
                "last_seen": now.isoformat()
            }
            
            # 6. Broadcast via WebSocket
            packet = {
                "event": "newTelemetry",
                "drone_id": drone_id,
                "telemetry": telemetry_payload,
                "sensors": reading,
                "ai": ai_payload,
                "alerts": triggered_alerts,
                "timestamp": now.isoformat()
            }
            await ws_manager.broadcast(packet)
            
            # 7. Periodically save to Heatmap Points & DB (every 3 ticks)
            if tick % 3 == 0:
                hp = {
                    "lat": reading["latitude"],
                    "lng": reading["longitude"],
                    "val": reading["aqi"],
                    "pm25": reading["pm25"],
                    "pm10": reading["pm10"],
                    "co2": reading["co2"],
                    "voc": reading["voc"],
                    "temp": reading["temperature"],
                    "wind": reading["wind_speed"],
                    "ozone": reading["ozone"],
                    "methane": reading["methane"],
                    "noise": reading["noise_level"],
                    "weight": 1.0,
                    "layer": "aqi",
                    "timestamp": now.isoformat()
                }
                self.historical_heatmap_points.append(hp)
                if len(self.historical_heatmap_points) > 300:
                    self.historical_heatmap_points.pop(0)
                    
                await ws_manager.broadcast({
                    "event": "newHeatmapPoint",
                    "point": hp
                })

        # Broadcast regional weather update every 10 ticks
        if tick % 10 == 0:
            await ws_manager.broadcast({
                "event": "weatherUpdated",
                "weather": {
                    "temperature": round(self.global_temp, 1),
                    "humidity": round(self.global_humidity, 1),
                    "wind_speed": round(self.global_wind_speed, 1),
                    "wind_direction": round(self.global_wind_dir, 1),
                    "pressure": 1014.2,
                    "condition": "Partly Cloudy",
                    "rain_probability": 8.0,
                    "uv_index": 4.8
                }
            })

simulator = PlatformSimulator()
