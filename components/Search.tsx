'use client';

import { ImSearch } from 'react-icons/im';
import { Input } from './ui/input';
import { useRef, useState } from 'react';
import { env } from '@/env.mjs';
import { useQuery } from '@tanstack/react-query';
import { dropdownAtom, newPinAtom } from '@/lib/atoms';
import { useAtom } from 'jotai';
import { CgMenuGridO } from 'react-icons/cg';
import { signOut, useSession } from 'next-auth/react';
import {
  FacebookShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  RedditShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  LinkedinIcon,
  PinterestIcon,
  RedditIcon,
  TwitterIcon,
  WhatsappIcon,
} from 'next-share';
import Image from 'next/image';
import { FaCircleUser } from 'react-icons/fa6';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { BsFillCaretLeftFill } from 'react-icons/bs';
import { useDebounce } from 'usehooks-ts';
import type { MapRef } from 'react-map-gl';

export default function Search({ mapRef }: { mapRef: React.RefObject<MapRef> }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchDropdown, setIsSearchDropdown] = useAtom(dropdownAtom);
  const [, setNewPin] = useAtom(newPinAtom);
  const debouncedTerm = useDebounce(searchTerm);
  const pathname = usePathname();
  const { data: session } = useSession();

  const url = `${env.NEXT_PUBLIC_BASE_URL}/map/${pathname.split('/')[2]}`;

  const handleMenuClick = () => {
    if (isSearchDropdown !== 'menu') {
      setIsSearchDropdown('menu');
    } else {
      setIsSearchDropdown(null);
    }
  };

  const handleSearchClick = (i: any) => {
    setNewPin({ latitude: i.center[1], longitude: i.center[0] });
    mapRef.current?.flyTo({ center: i.center });
  };

  const fetcher = async () => {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${debouncedTerm}.json?fuzzyMatch=true&limit=10&proximity=ip&access_token=${env.NEXT_PUBLIC_MAPBOX}`
    );
    return await response.json();
  };

  const { data } = useQuery(['search', debouncedTerm], fetcher);

  // console.log(data);
  return (
    <div className='fixed top-2 left-2 sm:w-72 backdrop-blur-lg shadow bg-white/80 rounded-md overflow-hidden'>
      <div className='h-11 flex px-2.5'>
        <div className='flex items-center text-gray-500 gap-2'>
          <CgMenuGridO className='w-6 h-6 cursor-pointer' onClick={handleMenuClick} />
          <ImSearch />
        </div>
        <Input
          onChange={(e) => {
            setIsSearchDropdown('search');
            setSearchTerm(e.target.value);
          }}
          type='text'
          value={searchTerm}
          placeholder='Search'
          className='px-2 py-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent font-medium border-none'
        />
      </div>
      <ul className='border-t'>
        {isSearchDropdown === 'search' &&
          data?.features.map((i: any) => (
            <li key={i.id} className='text-sm cursor-pointer px-3.5 py-1.5 first:pt-3 last:pb-3 hover:bg-gray-200' onClick={() => handleSearchClick(i)}>
              <p className='font-medium overflow-hidden whitespace-nowrap text-ellipsis'>{i.place_name.split(',')[0]}</p>
              <p className='overflow-hidden whitespace-nowrap text-ellipsis'>{i.place_name.substring(i.place_name.indexOf(',') + 1).trim()}</p>
            </li>
          ))}
      </ul>
      {isSearchDropdown === 'menu' && (
        <div className='p-4 space-y-4'>
          {session?.user && (
            <div className='flex items-center gap-x-2'>
              {session.user.image ? (
                <Image className='rounded-full shadow-lg' src={session.user.image} alt={session.user.name ?? 'user icon'} width={32} height={32} />
              ) : (
                <FaCircleUser className='w-8 h-8' />
              )}
              {session.user.name && <span>{session.user.name}</span>}
              <Button
                onClick={() => signOut({ callbackUrl: '/' })}
                className='text-white bg-orange-500 hover:brightness-110 hover:bg-orange-500 font-medium w-20 p-2.5 h-9 ml-auto'
              >
                Sign out
              </Button>
            </div>
          )}
          {!session?.user && (
            <Link
              href='/'
              className='text-white bg-orange-500 hover:brightness-110 hover:bg-orange-500 rounded-md font-medium pl-2.5 pr-3.5 py-2 inline-flex items-center gap-1'
            >
              <BsFillCaretLeftFill className='w-4 h-4' />
              <span>Home</span>
            </Link>
          )}
          <div className='space-y-2'>
            <p>{session?.user ? 'Share your map' : 'Share this map'}</p>
            <div className='flex gap-2 flex-wrap'>
              <FacebookShareButton url={url}>
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <TwitterShareButton url={url}>
                <TwitterIcon size={32} round />
              </TwitterShareButton>
              <WhatsappShareButton url={url}>
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
              <LinkedinShareButton url={url}>
                <LinkedinIcon size={32} round />
              </LinkedinShareButton>
              <RedditShareButton url={url}>
                <RedditIcon size={32} round />
              </RedditShareButton>
              <PinterestShareButton url={url} media='/background.webp'>
                <PinterestIcon size={32} round />
              </PinterestShareButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
