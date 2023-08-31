import prisma from '@/lib/prisma';
import MapInterface from './MapInterface';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

// export async function generateStaticParams() {
//   const users = await prisma.user.findMany();
//   return users.map((user) => ({ id: user.id }));
// }

export async function generateMetadata({ params: { id } }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  return {
    title: `${user && user.name ? user.name : 'User'}'s Map`,
  };
}

export default async function UserMapPage({ params: { id } }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { pins: { include: { photos: { select: { id: true, url: true } } } } },
  });

  if (!user) return notFound();

  const session = await getServerSession(authOptions);

  if (!session) return notFound();

  return <MapInterface user={user} />;
}
