export type NewPin = {
  location: string;
  city?: string;
  region?: string;
  country?: string;
  description?: string;
  date?: Date;
  latitude: number;
  longitude: number;
};
