import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  // get user/session
  const session = await getServerSession(authOptions);

  if (!session?.user) return NextResponse.json({ message: 'User is not signed in.' }, { status: 400 });

  const data = await request.json();

  console.log(data);

  //   return NextResponse.json({ message: 'No Cloudinary signature.' }, { status: 500 });

  //   return NextResponse.json({ timestamp, signature }, { status: 200 });
}
