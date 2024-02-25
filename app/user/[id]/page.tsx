import prisma from '@/lib/prisma';
import MapInterface from './map-interface';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';

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

  if (!session || session?.user?.id !== id) redirect('/');

  return <MapInterface user={user} session={session} />;
}
