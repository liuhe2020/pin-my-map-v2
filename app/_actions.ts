'use server';

import { v2 as cloudinary } from 'cloudinary';

const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function getSignature() {
  console.log('00000000000000000000000000000000');
}

export async function saveToDatabase({ public_id, version, signature }: { public_id: string; version: string; signature: string }) {
  // verify the data
  const expectedSignature = cloudinary.utils.api_sign_request({ public_id, version }, cloudinaryConfig.api_secret!);

  if (expectedSignature === signature) {
    // safe to write to database
    console.log({ public_id });
  }
}

export async function action(data: FormData) {
  console.log(data);
}
