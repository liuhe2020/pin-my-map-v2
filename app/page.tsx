import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className=''>
      <div className="relative before:bg-[url('/images/background.jpg')] before:opacity-60 before:-z-10 before:w-full before:h-screen before:fixed before:inset-0 before:object-cover before:object-left before:bg-no-repeat grid place-items-center h-screen">
        <div className='max-w-2xl p-14 rounded-xl text-center space-y-6 lg:text-left backdrop-blur-lg shadow-xl bg-white/30'>
          <h1 className='text-4xl font-bold text-orange-500 sm:text-5xl sm:mb-2'>Pin My Map</h1>
          <h2 className='text-xl font-semibold text-dark sm:text-2xl'>Your World, Your Way.</h2>
          <h2 className='text-dark font-medium text-base sm:text-lg'>
            Create a personalised map of your world. Mark your favorite spots, travel footprints and explore new places. Pin your world your way &#8209; the
            possibilities are endless.
          </h2>
          <Link href='/maps/1' className='inline-flex items-center gap-x-2 text-indigo-700 hover:brightness-150'>
            <svg
              fill='currentColor'
              clipRule='evenodd'
              fillRule='evenodd'
              strokeLinejoin='round'
              strokeMiterlimit='2'
              width='20'
              height='20'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='m14.523 18.787s4.501-4.505 6.255-6.26c.146-.146.219-.338.219-.53s-.073-.383-.219-.53c-1.753-1.754-6.255-6.258-6.255-6.258-.144-.145-.334-.217-.524-.217-.193 0-.385.074-.532.221-.293.292-.295.766-.004 1.056l4.978 4.978h-14.692c-.414 0-.75.336-.75.75s.336.75.75.75h14.692l-4.979 4.979c-.289.289-.286.762.006 1.054.148.148.341.222.533.222.19 0 .378-.072.522-.215z'
                fillRule='nonzero'
              />
            </svg>
            <span className='text-xl font-medium'>View demo</span>
          </Link>
          <div className='flex gap-x-4'>
            <Link
              className='text-white bg-orange-500 hover:brightness-110 font-medium rounded-lg p-2.5 focus:outline-none w-36 block mx-auto lg:mx-0 text-center shadow-neutral-300 shadow-md'
              href='/maps/1'
            >
              Sign in
            </Link>
            <Link
              className='text-white bg-indigo-500 hover:brightness-110 font-medium rounded-lg p-2.5 focus:outline-none w-36 block mx-auto lg:mx-0 text-center shadow-neutral-300 shadow-md'
              href='/maps/1'
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
