import React from 'react';
import prisma from '@/lib/prisma';
import MapInterface from './MapInterface';
import JotaiProvider from '@/components/JotaiProvider';

type Props = { params: { userId: string } };

export async function generateStaticParams() {
  return await prisma.user.findMany();
}

export async function generateMetadata({ params: { userId } }: Props) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return {
    title: `${user?.name}'s Map`,
  };
}

export default async function UserMapPage({ params: { userId } }: Props) {
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

  return (
    <JotaiProvider>
      <MapInterface user={user} />
    </JotaiProvider>
  );
}
