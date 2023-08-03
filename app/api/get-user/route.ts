import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const userId = await request.json();

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
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

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'Failed to get user.', error: err }, { status: 500 });
  }
}
