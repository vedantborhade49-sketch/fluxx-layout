import math
from typing import Dict, List, Any
from datetime import datetime

class CityTwinService:
    def __init__(self):
        # City Topology Definition
        self.topology = {
            "city_name": "Metropolitan Smart Airshed (Mumbai Urban Region)",
            "center": {"lat": 19.0760, "lng": 72.8777},
            "bounds": {
                "north": 19.2800,
                "south": 18.8900,
                "east": 73.0500,
                "west": 72.7500
            },
            "wards": [
                {
                    "id": "WARD-ME-01",
                    "name": "Ward M/East (Chembur - Govandi)",
                    "type": "Mixed Industrial-Residential",
                    "population": 807500,
                    "vulnerable_population": 161500,
                    "baseline_aqi": 164,
                    "center": {"lat": 19.0522, "lng": 72.9005},
                    "area_sqkm": 32.5,
                    "sensitivity": "HIGH"
                },
                {
                    "id": "WARD-FN-02",
                    "name": "Ward F/North (Sion - Matunga)",
                    "type": "High-Density Residential",
                    "population": 529000,
                    "vulnerable_population": 95000,
                    "baseline_aqi": 132,
                    "center": {"lat": 19.0350, "lng": 72.8600},
                    "area_sqkm": 18.2,
                    "sensitivity": "VERY_HIGH"
                },
                {
                    "id": "WARD-KW-03",
                    "name": "Ward K/West (Andheri - Juhu)",
                    "type": "Commercial & Residential",
                    "population": 748000,
                    "vulnerable_population": 120000,
                    "baseline_aqi": 118,
                    "center": {"lat": 19.1136, "lng": 72.8465},
                    "area_sqkm": 24.8,
                    "sensitivity": "MODERATE"
                },
                {
                    "id": "WARD-SGNP-04",
                    "name": "Sanjay Gandhi National Park & Forest Buffer",
                    "type": "Forest & Biodiversity Ecological Reserve",
                    "population": 24000,
                    "vulnerable_population": 3000,
                    "baseline_aqi": 48,
                    "center": {"lat": 19.2215, "lng": 72.9124},
                    "area_sqkm": 103.8,
                    "sensitivity": "CRITICAL_ECOSYSTEM"
                },
                {
                    "id": "WARD-TTC-05",
                    "name": "Thane-Belapur Industrial Corridor (MIDC)",
                    "type": "Heavy Chemical & Manufacturing Hub",
                    "population": 312000,
                    "vulnerable_population": 42000,
                    "baseline_aqi": 188,
                    "center": {"lat": 19.1250, "lng": 73.0050},
                    "area_sqkm": 45.0,
                    "sensitivity": "EXTREME_SOURCE"
                }
            ],
            "emission_sources": [
                {
                    "id": "SRC-CHEMBUR-REFINERY",
                    "name": "Bharat Petrochem Alpha FCCU Stack #2",
                    "category": "Petrochemical Catalytic Cracking",
                    "lat": 19.0380,
                    "lng": 72.8950,
                    "stack_height_m": 85.0,
                    "stack_diameter_m": 4.2,
                    "gas_velocity_ms": 16.5,
                    "gas_temp_c": 140.0,
                    "baseline_emission_rate_gps": 240.0, # grams/sec of PM/VOC
                    "pollutants": ["VOC", "SO2", "PM2.5", "NOx"]
                },
                {
                    "id": "SRC-TROMBAY-THERMAL",
                    "name": "Trombay Thermal Power Generation Unit #5",
                    "category": "Power Generation",
                    "lat": 19.0020,
                    "lng": 72.9050,
                    "stack_height_m": 120.0,
                    "stack_diameter_m": 5.5,
                    "gas_velocity_ms": 18.0,
                    "gas_temp_c": 160.0,
                    "baseline_emission_rate_gps": 310.0,
                    "pollutants": ["CO2", "PM10", "SO2", "NOx"]
                },
                {
                    "id": "SRC-MIDC-CHEMICAL",
                    "name": "Thane Specialty Chemical Complex Unit #4",
                    "category": "Synthetic Organic Solvents",
                    "lat": 19.1450,
                    "lng": 73.0120,
                    "stack_height_m": 45.0,
                    "stack_diameter_m": 2.8,
                    "gas_velocity_ms": 12.0,
                    "gas_temp_c": 95.0,
                    "baseline_emission_rate_gps": 185.0,
                    "pollutants": ["VOC", "Benzene", "Toluene", "PM2.5"]
                }
            ],
            "transport_corridors": [
                {"id": "CORR-WEH", "name": "Western Express Highway Transit Arterial", "traffic_density": "VERY_HIGH", "avg_co2_ppm": 640},
                {"id": "CORR-EEH", "name": "Eastern Express Highway Heavy Freight Hub", "traffic_density": "EXTREME", "avg_co2_ppm": 720},
                {"id": "CORR-SCLR", "name": "Santa Cruz - Chembur Link Expressway", "traffic_density": "HIGH", "avg_co2_ppm": 590}
            ],
            "water_bodies": [
                {"id": "WATER-MITHI", "name": "Mithi River Industrial Drainage Canal", "water_quality_index": 38, "risk": "INDUSTRIAL_EFFLUENT_RUNOFF"},
                {"id": "WATER-CREEK", "name": "Thane Creek Wetland & Mangrove Basin", "water_quality_index": 62, "risk": "THERMAL_DISCHARGE"}
            ]
        }

    def get_topology(self) -> Dict[str, Any]:
        return self.topology

    def simulate_what_if_scenario(
        self,
        source_id: str,
        emission_delta_percent: float,
        wind_speed_ms: float,
        wind_direction_deg: float,
        temperature_c: float = 29.5,
        inversion_layer_height_m: float = 350.0
    ) -> Dict[str, Any]:
        """
        Executes a Gaussian Atmospheric Dispersion & Multi-Ward Exposure Simulation
        """
        source = next((s for s in self.topology["emission_sources"] if s["id"] == source_id), None)
        if not source:
            source = self.topology["emission_sources"][0]

        # Calculate modified emission rate Q (g/s)
        base_q = source["baseline_emission_rate_gps"]
        simulated_q = base_q * (1.0 + (emission_delta_percent / 100.0))

        # Effective stack height with thermal plume rise
        # Holland's formula: delta_h = (v_s * d / u) * (1.5 + 2.68e-3 * p * (T_s - T_a)/T_s * d)
        v_s = source["gas_velocity_ms"]
        d = source["stack_diameter_m"]
        u = max(1.0, wind_speed_ms)
        t_s = source["gas_temp_c"] + 273.15
        t_a = temperature_c + 273.15
        plume_rise = (v_s * d / u) * (1.5 + 0.0025 * (t_s - t_a))
        effective_height = min(inversion_layer_height_m, source["stack_height_m"] + plume_rise)

        # Dispersion wind direction vector (where plume travels: opposite of wind origin)
        plume_bearing_rad = math.radians((wind_direction_deg + 180) % 360)
        plume_dir_deg = (wind_direction_deg + 180) % 360

        # Calculate impacted wards
        ward_impacts = []
        total_affected_pop = 0
        total_vulnerable_pop = 0

        src_lat = source["lat"]
        src_lng = source["lng"]

        for ward in self.topology["wards"]:
            w_lat = ward["center"]["lat"]
            w_lng = ward["center"]["lng"]

            # Distance in km using equirectangular approximation
            dx = (w_lng - src_lng) * 40000 * math.cos(math.radians((src_lat + w_lat) / 2)) / 360
            dy = (w_lat - src_lat) * 40000 / 360
            distance_km = math.sqrt(dx * dx + dy * dy)

            # Angle from source to ward
            ward_bearing_rad = math.atan2(dx, dy)
            angular_offset_deg = math.degrees(abs(ward_bearing_rad - plume_bearing_rad))
            if angular_offset_deg > 180:
                angular_offset_deg = 360 - angular_offset_deg

            # Gaussian cross-wind dispersion factor
            # sigma_y = 0.08 * x * (1 + 0.0001*x)^(-0.5)
            x_m = distance_km * 1000.0
            sigma_y = max(10.0, 0.12 * x_m)
            sigma_z = max(5.0, 0.08 * x_m)

            # Crosswind distance y
            y_m = math.sin(math.radians(angular_offset_deg)) * x_m

            # Gaussian concentration multiplier
            if angular_offset_deg < 55.0:  # within plume corridor
                conc_factor = math.exp(-0.5 * (y_m / sigma_y)**2)
                # Dilution with distance and wind
                ground_conc_ugm3 = (simulated_q / (math.pi * u * sigma_y * sigma_z)) * 1e6 * conc_factor * math.exp(-0.5 * (effective_height / sigma_z)**2)
                ground_conc_ugm3 = max(0.0, min(350.0, ground_conc_ugm3 * 0.05))
            else:
                ground_conc_ugm3 = 0.0

            # AQI Delta
            predicted_aqi_increase = round(ground_conc_ugm3 * 0.95, 1)
            new_ward_aqi = round(ward["baseline_aqi"] + predicted_aqi_increase, 1)

            is_impacted = predicted_aqi_increase >= 12.0
            if is_impacted:
                total_affected_pop += ward["population"]
                total_vulnerable_pop += ward["vulnerable_population"]

            ward_impacts.append({
                "ward_id": ward["id"],
                "ward_name": ward["name"],
                "distance_from_source_km": round(distance_km, 2),
                "angular_offset_deg": round(angular_offset_deg, 1),
                "baseline_aqi": ward["baseline_aqi"],
                "predicted_aqi_increase": predicted_aqi_increase,
                "projected_aqi": new_ward_aqi,
                "exposure_severity": "CRITICAL" if new_ward_aqi > 220 else "HIGH" if new_ward_aqi > 160 else "MODERATE" if new_ward_aqi > 100 else "LOW",
                "affected_population": ward["population"] if is_impacted else 0,
                "is_in_primary_plume": is_impacted
            })

        # Plume Contours for GIS Overlay
        plume_contours = []
        for dist_step in [1.5, 4.0, 8.5, 14.0]:
            offset_lat = src_lat + (dist_step * math.cos(math.radians(plume_dir_deg)) / 111.0)
            offset_lng = src_lng + (dist_step * math.sin(math.radians(plume_dir_deg)) / (111.0 * math.cos(math.radians(src_lat))))
            spread_radius_m = round(dist_step * 280 * (1.0 + (12.0 / u)), 0)

            plume_contours.append({
                "distance_km": dist_step,
                "center_lat": round(offset_lat, 5),
                "center_lng": round(offset_lng, 5),
                "spread_radius_meters": spread_radius_m,
                "estimated_arrival_minutes": round((dist_step * 1000) / (u * 60), 1),
                "mean_concentration_voc_ppb": round(max(20.0, (simulated_q / (dist_step * 1.5)) * 0.4), 1)
            })

        # Mitigation Recommendations
        mitigations = []
        if emission_delta_percent > 10:
            mitigations.append(f"Issue immediate Stack Curvilinear Throttling notice to {source['name']}")
        if total_affected_pop > 500000:
            mitigations.append("Issue Municipal Health Advisory for Ward M/East & Ward F/North schools and senior centers")
        mitigations.append(f"Deploy Autonomous VTOL Drones to downwind intercept coordinates at {plume_contours[1]['center_lat']}°N, {plume_contours[1]['center_lng']}°E")
        mitigations.append("Trigger automated Continuous Ambient Air Quality Monitoring (CAAQM) dense telemetry polling (10s intervals)")

        return {
            "simulation_id": f"SIM-CITY-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
            "source_simulated": {
                "id": source["id"],
                "name": source["name"],
                "category": source["category"],
                "baseline_emission_rate_gps": base_q,
                "simulated_emission_rate_gps": round(simulated_q, 1),
                "emission_delta_percent": emission_delta_percent,
                "effective_plume_height_m": round(effective_height, 1)
            },
            "atmospheric_conditions": {
                "wind_speed_ms": wind_speed_ms,
                "wind_direction_deg": wind_direction_deg,
                "plume_travel_bearing_deg": round(plume_dir_deg, 1),
                "temperature_c": temperature_c,
                "inversion_layer_m": inversion_layer_height_m
            },
            "macro_exposure_impact": {
                "total_affected_population": total_affected_pop,
                "vulnerable_demographics_count": total_vulnerable_pop,
                "peak_plume_ground_aqi_surge": max([w["predicted_aqi_increase"] for w in ward_impacts]),
                "critical_wards_count": len([w for w in ward_impacts if w["is_in_primary_plume"]])
            },
            "ward_impacts": sorted(ward_impacts, key=lambda w: w["predicted_aqi_increase"], reverse=True),
            "plume_contours": plume_contours,
            "tactical_mitigations": mitigations
        }

city_twin_service = CityTwinService()
