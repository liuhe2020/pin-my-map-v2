import { Prisma } from '@prisma/client';

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface PinValues {
  location: string;
  city?: string;
  region?: string;
  country?: string;
  date?: Date;
  description?: string;
  id?: string;
}

export interface NewPinValues extends PinValues, LatLng {}

export interface CloudinaryImage {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  api_key: string;
}

const userWithPins = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    pins: {
      include: {
        photos: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    },
  },
});

const pinWithPhotos = Prisma.validator<Prisma.PinDefaultArgs>()({
  include: {
    photos: {
      select: {
        id: true,
        url: true,
      },
    },
  },
});

export type UserWithPins = Prisma.UserGetPayload<typeof userWithPins>;
export type PinWithPhotos = Prisma.PinGetPayload<typeof pinWithPhotos>;
