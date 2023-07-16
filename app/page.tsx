'use client';

import Image from 'next/image';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { FaGoogle, FaMapMarkedAlt, FaPowerOff } from 'react-icons/fa';

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <main className=''>
      <div className="relative before:bg-[url('/images/background.jpg')] before:opacity-60 before:-z-10 before:w-full before:h-screen before:fixed before:inset-0 before:object-cover before:object-left before:bg-no-repeat grid place-items-center h-screen">
        <div className='flex flex-col gap-y-6 max-w-md m-6 p-6 sm:p-12 rounded-2xl text-center backdrop-blur-lg shadow-xl bg-white/50'>
          <Image src='/images/pin_logo.png' width={32} height={32} alt='pin my map logo' className='mx-auto pb-2' />
          <h1 className='text-4xl font-bold text-orange-500 sm:text-5xl'>Pin My Map</h1>
          <h2 className='text-xl font-semibold text-dark'>Your World, Your Way.</h2>
          <h2 className='text-dark font-medium text-base text-center'>
            Create a personalised map of your world. Mark your favorite spots, travel footprints and explore new places.
          </h2>
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
              <button
                type='button'
                className='flex justify-center items-center gap-x-2 text-white bg-orange-500 hover:brightness-110 font-semibold rounded-lg p-3.5 focus:outline-none w-full mx-auto lg:mx-0 text-center shadow-neutral-300 shadow-md'
                onClick={() => signOut()}
              >
                <FaPowerOff className='w-4 h-4' />
                <span>Sign out</span>
              </button>
            )}
            <Link
              className='flex justify-center items-center gap-x-2 text-white bg-indigo-500 hover:brightness-110 font-semibold rounded-lg p-3.5 focus:outline-none w-full mx-auto lg:mx-0 text-center shadow-neutral-300 shadow-md'
              href='/maps/1'
            >
              <FaMapMarkedAlt className='w-4 h-4' />
              <span>View demo</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
