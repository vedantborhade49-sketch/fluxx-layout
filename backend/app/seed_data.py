import json
import random
from datetime import datetime, timezone, timedelta
from app.database import SessionLocal, Base, engine
from app.models.user import User
from app.models.drone import Drone
from app.models.mission import Mission
from app.models.sensor import SensorReading
from app.models.heatmap import HeatmapPoint
from app.models.alert import Alert
from app.models.weather import WeatherData
from app.models.ai_analysis import AIAnalysis
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def seed_database():
    """Initializes and seeds database with realistic fleet, missions, telemetry, and alerts."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(Drone).first():
        db.close()
        return

    print("Seeding FLUXX v2.0 Platform Database...")

    # 1. Users
    hashed_pwd = pwd_context.hash("admin123")
    admin_user = User(
        name="Chief Flight Officer",
        email="admin@fluxx.ai",
        password_hash=hashed_pwd,
        role="admin"
    )
    operator_user = User(
        name="Mission Specialist",
        email="operator@fluxx.ai",
        password_hash=hashed_pwd,
        role="operator"
    )
    db.add_all([admin_user, operator_user])

    # 2. Drones
    drones = [
        Drone(
            id="VTOL-001",
            serial_number="FLX-VTOL-8801-PRO",
            model="Fluxx AeroVTOL X8 Industrial",
            firmware="v4.2.1-PRO",
            status="ACTIVE",
            battery=91.5,
            latitude=37.7749,
            longitude=-122.4194,
            altitude=120.0,
            speed=12.5,
            heading=45.0,
            signal_strength=98.0,
            current_mission_id="MSN-2026-001"
        ),
        Drone(
            id="VTOL-002",
            serial_number="FLX-VTOL-8802-PRO",
            model="Fluxx AeroVTOL X8 Urban",
            firmware="v4.2.1-PRO",
            status="ACTIVE",
            battery=87.0,
            latitude=37.7840,
            longitude=-122.4080,
            altitude=110.0,
            speed=11.2,
            heading=120.0,
            signal_strength=95.0,
            current_mission_id="MSN-2026-002"
        ),
        Drone(
            id="VTOL-003",
            serial_number="FLX-VTOL-8803-PRO",
            model="Fluxx AeroVTOL X8 EcoRanger",
            firmware="v4.2.1-PRO",
            status="ACTIVE",
            battery=96.0,
            latitude=37.7650,
            longitude=-122.4350,
            altitude=140.0,
            speed=14.0,
            heading=290.0,
            signal_strength=99.0,
            current_mission_id="MSN-2026-003"
        )
    ]
    db.add_all(drones)

    # 3. Missions
    missions = [
        Mission(
            id="MSN-2026-001",
            drone_id="VTOL-001",
            name="Industrial Sector Alpha Emission Sweep",
            type="Industrial Inspection",
            status="IN_PROGRESS",
            area_name="Alpha Refinery & Logistics Hub",
            area_polygon=json.dumps([[37.770, -122.425], [37.780, -122.425], [37.780, -122.410], [37.770, -122.410]]),
            waypoints=json.dumps([
                {"lat": 37.772, "lng": -122.422, "alt": 120, "action": "TAKEOFF"},
                {"lat": 37.775, "lng": -122.418, "alt": 120, "action": "SURVEY"},
                {"lat": 37.778, "lng": -122.414, "alt": 120, "action": "SURVEY"},
                {"lat": 37.772, "lng": -122.422, "alt": 120, "action": "RTH"}
            ]),
            distance_km=14.8,
            flight_time_min=34.0,
            coverage_sqkm=5.2,
            average_aqi=68.5
        ),
        Mission(
            id="MSN-2026-002",
            drone_id="VTOL-002",
            name="Downtown Transit Corridor Air Profiling",
            type="Environmental Survey",
            status="IN_PROGRESS",
            area_name="Downtown Metro Grid",
            distance_km=11.2,
            flight_time_min=26.5,
            coverage_sqkm=3.8,
            average_aqi=48.2
        ),
        Mission(
            id="MSN-2026-003",
            drone_id="VTOL-003",
            name="Forest Reserve Bio-Corridor Patrol",
            type="Forest Monitoring",
            status="IN_PROGRESS",
            area_name="Presidio Green Belt",
            distance_km=18.5,
            flight_time_min=42.0,
            coverage_sqkm=8.4,
            average_aqi=24.5
        )
    ]
    db.add_all(missions)

    # 4. Historical Sensor Readings (Last 24 hours)
    now = datetime.now(timezone.utc)
    readings = []
    heatmap_points = []
    
    # Generate 100 spatial grid points across the city
    base_lat, base_lng = 37.7749, -122.4194
    for i in range(120):
        lat = base_lat + random.uniform(-0.04, 0.04)
        lng = base_lng + random.uniform(-0.04, 0.04)
        
        # Center industrial has higher AQI
        dist_from_ind = ((lat - 37.7749)**2 + (lng - -122.4194)**2)**0.5
        is_hotspot = dist_from_ind < 0.015
        
        aqi_val = random.uniform(85, 145) if is_hotspot else random.uniform(25, 70)
        pm25_val = round(aqi_val * 0.28, 1)
        pm10_val = round(aqi_val * 0.55, 1)
        co2_val = round(400.0 + aqi_val * 2.5, 1)
        voc_val = round(60.0 + aqi_val * 2.0, 1)
        temp_val = round(21.0 + random.uniform(-2, 3), 1)
        wind_val = round(random.uniform(2.5, 8.5), 1)

        t_stamp = now - timedelta(minutes=random.randint(1, 1440))
        
        readings.append(SensorReading(
            drone_id=random.choice(["VTOL-001", "VTOL-002", "VTOL-003"]),
            mission_id="MSN-2026-001",
            timestamp=t_stamp,
            latitude=round(lat, 6),
            longitude=round(lng, 6),
            altitude=random.uniform(100, 140),
            battery=random.uniform(30, 100),
            aqi=round(aqi_val, 1),
            pm25=pm25_val,
            pm10=pm10_val,
            co2=co2_val,
            voc=voc_val,
            ozone=round(random.uniform(20, 45), 1),
            methane=round(random.uniform(1.4, 3.2), 2),
            temperature=temp_val,
            humidity=round(random.uniform(45, 75), 1),
            pressure=1013.25,
            wind_speed=wind_val,
            wind_direction=random.uniform(0, 360),
            uv_index=4.5,
            noise_level=random.uniform(40, 75)
        ))

        # Add to Heatmap Points
        heatmap_points.append(HeatmapPoint(
            layer="aqi",
            latitude=round(lat, 6),
            longitude=round(lng, 6),
            value=round(aqi_val, 1),
            weight=1.0,
            zone="Metro Bay Area",
            timestamp=t_stamp
        ))
        
    db.add_all(readings)
    db.add_all(heatmap_points)

    # 5. Initial Alerts
    alerts = [
        Alert(
            id="ALT-2026-001",
            drone_id="VTOL-001",
            type="PM25_SPIKE",
            severity="CRITICAL",
            title="Severe PM2.5 Pollution Spike Detected",
            description="PM2.5 levels surged to 112.4 µg/m³ near Sector 4 logistics junction.",
            location_name="Sector 4 - Alpha Industrial",
            latitude=37.7782,
            longitude=-122.4165,
            metric_name="pm25",
            metric_value=112.4,
            threshold_value=100.0,
            timestamp=now - timedelta(minutes=18),
            resolved=False
        ),
        Alert(
            id="ALT-2026-002",
            drone_id="VTOL-002",
            type="VOC_TOXIC",
            severity="WARNING",
            title="Elevated Volatile Organic Compounds (VOC)",
            description="VOC concentration recorded at 380 ppb in Urban Commercial perimeter.",
            location_name="Downtown Transit Corridor",
            latitude=37.7845,
            longitude=-122.4072,
            metric_name="voc",
            metric_value=380.0,
            threshold_value=350.0,
            timestamp=now - timedelta(minutes=45),
            resolved=False
        ),
        Alert(
            id="ALT-2026-003",
            drone_id="VTOL-003",
            type="LOW_BATTERY",
            severity="INFO",
            title="Scheduled Mission Battery Level Notification",
            description="VTOL-003 battery at 32% during long-range patrol. Normal scheduled return.",
            location_name="Presidio Green Belt",
            latitude=37.7655,
            longitude=-122.4340,
            metric_name="battery",
            metric_value=32.0,
            threshold_value=35.0,
            timestamp=now - timedelta(hours=3),
            resolved=True,
            resolved_at=now - timedelta(hours=2, minutes=50),
            resolved_by="Autonomous Flight Controller"
        )
    ]
    db.add_all(alerts)

    # 6. Weather
    weather = WeatherData(
        location="San Francisco Bay Area",
        timestamp=now,
        temperature=22.4,
        humidity=58.0,
        pressure=1013.8,
        wind_speed=4.8,
        wind_direction=210.0,
        rain_probability=5.0,
        uv_index=4.8,
        condition="Partly Cloudy",
        sunrise="06:18 AM",
        sunset="08:04 PM"
    )
    db.add(weather)

    db.commit()
    db.close()
    print("Database seeded successfully with initial fleet, missions, telemetry, and alerts.")

if __name__ == "__main__":
    seed_database()
