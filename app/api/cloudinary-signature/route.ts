import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUDNAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function GET() {
  // get user/session
  const session = await getServerSession(authOptions);

  if (!session?.user) return NextResponse.json({ message: 'User is not signed in.' }, { status: 500 });

  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.utils.api_sign_request({ timestamp, folder: 'pin-my-map' }, cloudinaryConfig.api_secret!);

  if (!signature) return NextResponse.json({ message: 'No Cloudinary signature.' }, { status: 500 });

  return NextResponse.json({ timestamp, signature }, { status: 200 });
}
