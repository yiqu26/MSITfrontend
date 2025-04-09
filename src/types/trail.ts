export interface Trail {
  id: number;
  name: string;
  length: number;
  difficulty: string;
  region: string;
  description: string;
  image: string;
  rating: number;
  seasons: string[];
  terrain: string[];
  features: string[];
  hazards: string[];
  tips: string;
  nearbyTrails: string[];
  lastUpdated: string;
  tags: string[];
  latitude: number;
  longitude: number;
} 