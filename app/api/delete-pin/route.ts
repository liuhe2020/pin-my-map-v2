import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import prisma from '@/lib/prisma';
import { env } from '@/env.mjs';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUDNAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: Request) {
  // get user/session
  const session = await getServerSession(authOptions);

  if (!session?.user) return NextResponse.json({ message: 'User is not signed in.' }, { status: 401 });

  const id = await request.json();

  try {
    // get pin inc photos id in database
    const pin = await prisma.pin.findUnique({ where: { id }, include: { photos: true } });

    // delete photos if exist
    if (pin?.photos.length) {
      const deletePhotos = pin.photos.map(async (photo) => await cloudinary.uploader.destroy(photo.id));
      const deleteResponse = await Promise.all(deletePhotos);

      // if photo deletion successful, delete pin
      if (deleteResponse && deleteResponse.length) {
        await prisma.pin.delete({ where: { id } });
      }
    } else {
      // delete pin in case of no photos
      await prisma.pin.delete({ where: { id } });
    }

    return NextResponse.json({ message: 'Pin deleted.' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'Failed to delete pin.', error: err }, { status: 500 });
  }
}
