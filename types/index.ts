export interface Photo {
  id: string;
  name: string;
  url: string;
  size: number;
}

export interface DropPoint {
  id: string;
  number: number;
  latitude: number;
  longitude: number;
  x: number;
  y: number;
}
