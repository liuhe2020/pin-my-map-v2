import { Prisma } from '@prisma/client';

export interface Pin {
  location: string;
  city?: string;
  region?: string;
  country?: string;
  description?: string;
  date?: Date;
  latitude: number;
  longitude: number;
}

export interface Photo {
  id: string;
  url: string;
}

const userWithPins = Prisma.validator<Prisma.UserArgs>()({
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

export type UserWithPins = Prisma.UserGetPayload<typeof userWithPins>;
