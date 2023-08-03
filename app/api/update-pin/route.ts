import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import prisma from '@/lib/prisma';
import { CloudinaryImage } from '@/components/types';
import { env } from '@/env.mjs';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUDNAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function PATCH(request: Request) {
  // get user/session
  const session = await getServerSession(authOptions);

  if (!session?.user) return NextResponse.json({ message: 'User is not signed in.' }, { status: 401 });

  const { pin, deletePhotos, files } = await request.json();

  try {
    // update pin
    await prisma.pin.update({
      where: { id: pin.id },
      data: {
        location: pin.location,
        city: pin.city || null,
        region: pin.region || null,
        country: pin.country || null,
        description: pin.description || null,
        date: pin.date || null,
      },
    });

    // delete photos if required
    if (deletePhotos.length) {
      deletePhotos.map(async (photoId: string) => await cloudinary.uploader.destroy(photoId));
      const deleteResponse = await Promise.all(deletePhotos);

      if (deleteResponse && deleteResponse.length) {
        await prisma.photo.deleteMany({
          where: {
            id: { in: deletePhotos },
          },
        });
      }
    }

    // upload to cloudinary & database
    if (files.length) {
      const uploadPhotos = files.map(async (file: string) => await cloudinary.uploader.upload(file, { folder: 'pin-my-map' }));
      const photos: CloudinaryImage[] = await Promise.all(uploadPhotos);
      await prisma.photo.createMany({ data: photos.map((photo) => ({ id: photo.public_id, pin_id: pin.id, url: photo.secure_url })) });
    }

    return NextResponse.json({ message: 'Pin updated.' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'Failed to update pin.', error: err }, { status: 500 });
  }
}
