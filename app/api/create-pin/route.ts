import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { NewPin } from '@/components/types';

export async function POST(request: Request) {
  // get user/session
  const session = await getServerSession(authOptions);

  if (!session?.user) return NextResponse.json({ message: 'User is not signed in.' }, { status: 400 });

  const { pin, photos } = await request.json();

  const createPin = async () =>
    session.user &&
    (await prisma.pin.create({
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
    }));

  //   return NextResponse.json({ message: 'No Cloudinary signature.' }, { status: 500 });

  //   return NextResponse.json({ timestamp, signature }, { status: 200 });
}
