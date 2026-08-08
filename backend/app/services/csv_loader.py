"""
FLUXX CSV Dataset Loader & Chronological Validator
Loads raw environmental survey CSVs without modification, validates columns, and returns normalized sample objects.
"""

import os
import csv
from datetime import datetime
from typing import List, Dict, Any
import logging
from app.services.data_normalizer import normalize_environmental_reading

logger = logging.getLogger("fluxx.csv_loader")

DEFAULT_CSV_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "kharghar_dataset.csv")

def load_kharghar_csv(file_path: str = DEFAULT_CSV_PATH) -> List[Dict[str, Any]]:
    """
    Loads, parses, validates, and sorts Kharghar environmental observations.
    Never modifies the original CSV file.
    """
    if not os.path.exists(file_path):
        # Fallback to Downloads if not in data dir
        alt_path = "/home/bhumit/Downloads/fluxx_kharghar_50_samples (1).csv"
        if os.path.exists(alt_path):
            file_path = alt_path
        else:
            logger.error(f"CSV file not found at {file_path}")
            return []

    samples: List[Dict[str, Any]] = []

    try:
        with open(file_path, mode="r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            sample_index = 1
            for row in reader:
                # Basic row validation
                if not row.get("latitude") or not row.get("longitude"):
                    continue

                normalized = normalize_environmental_reading(row, source="kharghar_csv", mode="replay")
                normalized["sample"] = sample_index
                samples.append(normalized)
                sample_index += 1

        # Sort chronologically by timestamp
        samples.sort(key=lambda s: s["timestamp"])

        # Re-index samples 1..N
        for idx, s in enumerate(samples):
            s["sample"] = idx + 1

        logger.info(f"Successfully loaded {len(samples)} valid environmental samples from {file_path}")
        return samples

    except Exception as e:
        logger.error(f"Error loading CSV file {file_path}: {e}")
        return []
