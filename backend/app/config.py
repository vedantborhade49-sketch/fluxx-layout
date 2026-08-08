import os

class Settings:
    PROJECT_NAME: str = "FLUXX Environmental Intelligence Platform"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "fluxx-secret-key-environmental-intelligence-v2")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database (Default: SQLite for local zero-dependency run, can be overridden by DATABASE_URL for Postgres/PostGIS)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./fluxx_platform.db")
    
    # Redis & MQTT
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    MQTT_BROKER_HOST: str = os.getenv("MQTT_BROKER_HOST", "localhost")
    MQTT_BROKER_PORT: int = int(os.getenv("MQTT_BROKER_PORT", "1883"))
    MQTT_TOPIC_PREFIX: str = "fluxx"
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8000",
        "*"
    ]
    
    # Simulation
    SIMULATION_INTERVAL_SEC: float = 1.5
    SIMULATION_ENABLED: bool = True

settings = Settings()
