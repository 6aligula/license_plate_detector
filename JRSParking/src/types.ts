export interface ParkingSpot {
    id: string;
    number: string;
    isOccupied: boolean;
    type: 'disabled' | 'electric' | 'standard';
    currentVehicle?: string; 
  }
  
  export interface VehicleEntry {
    id: string;
    plate: string;
    vehicleType: 'car' | 'motorcycle' | 'van';
    entryTime: Date;
    exitTime?: Date;
    status: 'active' | 'completed';
    parkingSpot: string;
  }
  
  export interface Spot {
    id: number;
    plate: string;
    status: string;
  }
  