import React from 'react';
import prisma from '@/lib/prisma';
import MapInterface from './MapInterface';

// export async function generateStaticParams() {
//   return await prisma.user.findMany();
// }

// export async function generateMetadata({ params: { userId } }: Props) {
//   const user = await prisma.user.findUnique({
//     where: {
//       id: userId,
//     },
//   });

//   return {
//     title: `${user?.name}'s Map`,
//   };
// }

export default async function UserMapPage({ params: { id } }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { pins: { include: { photos: { select: { id: true, url: true } } } } },
  });

  if (!user) return null;

  return <MapInterface user={user} />;
}
