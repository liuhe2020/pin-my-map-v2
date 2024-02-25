import Image from 'next/image';
import { getServerSession } from 'next-auth';
import SignIn from '@/components/sign-in';
import { authOptions } from '@/lib/auth-options';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <main>
      <div className="relative bg-[url('/images/background.webp')] before:w-full before:h-full before:bg-white/50 before:absolute before:inset-0 w-full h-[100dvh] inset-0 bg-cover bg-center grid place-items-center">
        <div className='flex flex-col gap-y-6 max-w-md m-6 p-6 sm:p-12 rounded-2xl text-center backdrop-blur-lg shadow-xl bg-white/50'>
          <Image src='/images/pin_logo.png' width={32} height={46} alt='pin my map logo' className='mx-auto pb-2' />
          <h1 className='text-4xl font-bold text-orange-500 sm:text-5xl'>Pin My Map</h1>
          <h2 className='text-xl font-semibold text-dark'>Your World, Your Way.</h2>
          <h2 className='text-dark font-medium text-base text-center'>
            Create a personalised map of your world. Mark your favorite spots, travel footprints and explore new places.
          </h2>
          <SignIn session={session} />
        </div>
      </div>
    </main>
  );
}
