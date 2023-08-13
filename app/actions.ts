'use server';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUDNAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

import { type UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import prisma from '@/lib/prisma';
import type { PinValues } from '@/components/types';
import { env } from '@/env.mjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function createPinAction(pin: PinValues, files: string[]) {
  const session = await getServerSession(authOptions);

  if (!session?.user) return { error: 'The user is not signed in.' };

  try {
    let photos: UploadApiResponse[] = [];

    // upload photos to cloudinary
    if (files.length) {
      const uploadPhotos = files.map(async (file: string) => await cloudinary.uploader.upload(file, { folder: 'pin-my-map' }));
      photos = await Promise.all(uploadPhotos);
    }

    const data = await prisma.pin.create({
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
        ...(photos.length && { photos: { createMany: { data: photos.map((photo) => ({ id: photo.public_id, url: photo.secure_url })) } } }),
      },
      include: { photos: true },
    });
    return { data, error: null };
  } catch (err) {
    console.error(err);
    return { error: 'Failed to create pin.' };
  }
}

export async function editPinAction(pin: Partial<PinValues>, deletePhotos: string[], files: string[]) {
  try {
    let deleted: string[] = [];
    let uploaded: UploadApiResponse[] = [];

    // delete photos if required
    if (deletePhotos.length) {
      deletePhotos.map(async (photoId: string) => await cloudinary.uploader.destroy(photoId));
      deleted = await Promise.all(deletePhotos);
    }

    // upload to cloudinary & database
    if (files.length) {
      const uploadPhotos = files.map(async (file: string) => await cloudinary.uploader.upload(file, { folder: 'pin-my-map' }));
      uploaded = await Promise.all(uploadPhotos);
    }

    // update pin with conditions
    const data = await prisma.pin.update({
      where: { id: pin.id },
      data: {
        location: pin.location,
        city: pin.city || null,
        region: pin.region || null,
        country: pin.country || null,
        description: pin.description || null,
        date: pin.date || null,
        ...((deleted.length || uploaded.length) && {
          photos: {
            ...(deleted.length && { deleteMany: { id: { in: deletePhotos } } }),
            ...(uploaded.length && { createMany: { data: uploaded.map((photo) => ({ id: photo.public_id, url: photo.secure_url })) } }),
          },
        }),
      },
      include: { photos: true },
    });
    return { data, error: null };
  } catch (err) {
    console.error(err);
    return { error: 'Failed to edit pin.' };
  }
}

export async function deletePinAction(id: string) {
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
  } catch (err) {
    console.error(err);
    return { error: 'Failed to delete pin.' };
  }
}
