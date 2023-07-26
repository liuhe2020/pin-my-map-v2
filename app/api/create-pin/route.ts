import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import prisma from '@/lib/prisma';
import type { Photo } from '@/components/types';

export async function POST(request: Request) {
  // get user/session
  const session = await getServerSession(authOptions);

  if (!session?.user) return NextResponse.json({ message: 'User is not signed in.' }, { status: 401 });

  const { pin, photos } = await request.json();

  try {
    const newPin = await prisma.pin.create({
      data: {
        location: pin.location,
        city: pin.city ? pin.city : null,
        region: pin.region ? pin.region : null,
        country: pin.country ? pin.country : null,
        description: pin.description ? pin.description : null,
        date: pin.date ? pin.date : null,
        latitude: pin.latitude,
        longitude: pin.longitude,
        userId: session.user.id,
      },
    });

    if (photos.length) {
      const uploadPhotos = photos.map(async (photo) => await cloudinary.uploader.upload(photo, { folder: 'pin-my-map' }));

      const uploadResponse = await Promise.all(uploadPhotos);
      console.log(uploadResponse);
    }

    // photos.length && (await prisma.photo.createMany({ data: photos.map((photo: Photo) => ({ ...photo, pin_id: newPin.id })) }));

    return NextResponse.json({ message: 'New pin created.' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'Failed to create new pin.', error: err }, { status: 500 });
  }
}
