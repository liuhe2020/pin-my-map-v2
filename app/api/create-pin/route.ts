import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import prisma from '@/lib/prisma';
import { CloudinaryImage } from '@/components/types';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: Request) {
  // get user/session
  const session = await getServerSession(authOptions);

  if (!session?.user) return NextResponse.json({ message: 'User is not signed in.' }, { status: 401 });

  const { pin, files } = await request.json();

  try {
    // create pin in database
    const newPin = await prisma.pin.create({
      data: {
        location: pin.location,
        city: pin.city || null,
        region: pin.region || null,
        country: pin.country || null,
        description: pin.description || null,
        date: pin.date || null,
        latitude: pin.latitude,
        longitude: pin.longitude,
        userId: session.user.id,
      },
    });

    // upload to cloudinary & database
    if (files.length) {
      const uploadPhotos = files.map(async (file: string) => await cloudinary.uploader.upload(file, { folder: 'pin-my-map' }));
      const photos: CloudinaryImage[] = await Promise.all(uploadPhotos);
      await prisma.photo.createMany({ data: photos.map((photo) => ({ id: photo.public_id, pin_id: newPin.id, url: photo.secure_url })) });
    }

    return NextResponse.json({ message: 'New pin created.' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'Failed to create new pin.', error: err }, { status: 500 });
  }
}
