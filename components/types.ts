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

export type UploadImage = {
  path: string;
  preview: Blob;
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
};
