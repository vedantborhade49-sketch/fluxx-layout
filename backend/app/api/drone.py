from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timezone
from app.database import get_db
from app.models.drone import Drone
from app.schemas.drone import DroneResponse, DroneCreate, DroneUpdate
from app.services.simulator import simulator

router = APIRouter(prefix="/drone", tags=["Drones"])

@router.get("", response_model=List[DroneResponse])
def get_all_drones(db: Session = Depends(get_db)):
    drones = db.query(Drone).all()
    # Merge live simulator coordinates if available
    for d in drones:
        if d.id in simulator.drones:
            sim_d = simulator.drones[d.id]
            d.latitude = sim_d.lat
            d.longitude = sim_d.lng
            d.altitude = sim_d.altitude
            d.speed = sim_d.speed
            d.heading = sim_d.heading
            d.battery = sim_d.battery
            d.status = sim_d.status
            d.signal_strength = sim_d.signal_strength
            d.last_seen = datetime.now(timezone.utc)
    return drones

@router.get("/{drone_id}", response_model=DroneResponse)
def get_drone(drone_id: str, db: Session = Depends(get_db)):
    drone = db.query(Drone).filter(Drone.id == drone_id).first()
    if not drone:
        raise HTTPException(status_code=404, detail="Drone not found")
    
    if drone_id in simulator.drones:
        sim_d = simulator.drones[drone_id]
        drone.latitude = sim_d.lat
        drone.longitude = sim_d.lng
        drone.altitude = sim_d.altitude
        drone.speed = sim_d.speed
        drone.heading = sim_d.heading
        drone.battery = sim_d.battery
        drone.status = sim_d.status
        drone.signal_strength = sim_d.signal_strength
    return drone

@router.post("/status")
def update_drone_status(drone_id: str, status: str, db: Session = Depends(get_db)):
    drone = db.query(Drone).filter(Drone.id == drone_id).first()
    if not drone:
        raise HTTPException(status_code=404, detail="Drone not found")
    
    drone.status = status
    if drone_id in simulator.drones:
        simulator.drones[drone_id].status = status
    db.commit()
    return {"message": f"Drone {drone_id} status updated to {status}", "status": status}
