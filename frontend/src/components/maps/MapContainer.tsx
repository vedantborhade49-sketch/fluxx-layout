import React from 'react';
import { DroneState, HeatmapPoint, HeatmapLayerType, Mission, MultiSourceData } from '../../types';
import { EnvironmentalTwinMap } from './EnvironmentalTwinMap';

interface MapContainerProps {
  drones: DroneState[];
  selectedDroneId: string;
  onSelectDrone: (id: string) => void;
  heatmapPoints: HeatmapPoint[];
  currentLayer: HeatmapLayerType;
  onChangeLayer: (layer: HeatmapLayerType) => void;
  activeMission?: Mission | null;
  multiSources?: MultiSourceData | null;
  hotspots?: any[];
}

export const MapContainer: React.FC<MapContainerProps> = (props) => {
  return <EnvironmentalTwinMap {...props} />;
};

export default MapContainer;
