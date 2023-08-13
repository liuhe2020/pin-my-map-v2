import { Prisma } from '@prisma/client';

export interface PinValues {
  location: string;
  city?: string;
  region?: string;
  country?: string;
  date?: Date;
  description?: string;
  id?: string;
  latitude: number;
  longitude: number;
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
