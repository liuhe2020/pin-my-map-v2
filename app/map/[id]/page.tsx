import React from 'react';
import prisma from '@/lib/prisma';
import MapInterface from './MapInterface';
import { notFound } from 'next/navigation';

// export async function generateStaticParams() {
//   const users = await prisma.user.findMany();
//   return users.map((user) => ({ id: user.id }));
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

// export const revalidate = 0;

export default async function UserMapPage({ params: { id } }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { pins: { include: { photos: { select: { id: true, url: true } } } } },
  });

  if (!user) return notFound();

  return <MapInterface user={user} />;
}
