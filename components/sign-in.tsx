'use client';

import { type Session } from 'next-auth';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { FaGoogle, FaLocationArrow, FaMapMarkedAlt } from 'react-icons/fa';

export default function SignIn({ session }: { session: Session | null }) {
  return (
    <div className='flex flex-col gap-y-3'>
      {!session && (
        <button
          type='button'
          className='flex justify-center items-center gap-x-2 text-white bg-orange-500 hover:brightness-110 font-semibold rounded-lg p-3.5 focus:outline-none w-full mx-auto lg:mx-0 text-center shadow-neutral-300 shadow-md'
          onClick={() => signIn('google')}
        >
          <FaGoogle className='w-4 h-4' />
          <span>Sign in with Google</span>
        </button>
      )}
      {session && (
        <Link
          href={`/user/${session.user?.id}`}
          className='flex justify-center items-center gap-x-2 text-white bg-orange-500 hover:brightness-110 font-semibold rounded-lg p-3.5 focus:outline-none w-full mx-auto lg:mx-0 text-center shadow-neutral-300 shadow-md'
        >
          <FaLocationArrow className='w-4 h-4' />
          <span>Continue to your map</span>
        </Link>
      )}
      <Link
        className='flex justify-center items-center gap-x-2 text-white bg-indigo-500 hover:brightness-110 font-semibold rounded-lg p-3.5 focus:outline-none w-full mx-auto lg:mx-0 text-center shadow-neutral-300 shadow-md'
        href='/map/demo'
      >
        <FaMapMarkedAlt className='w-4 h-4' />
        <span>View demo</span>
      </Link>
    </div>
  );
}
