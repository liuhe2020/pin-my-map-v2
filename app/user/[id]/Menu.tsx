'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { UserWithPins } from '../../../components/types';
import Image from 'next/image';
import { CgMenuGridO } from 'react-icons/cg';
import { FaCircleUser } from 'react-icons/fa6';
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
import { useAtom } from 'jotai';
import { menuAtom } from '@/lib/atoms';

export default function Menu({ user }: { user: UserWithPins }) {
  const [isMenuOpen, setIsMenuOpen] = useAtom(menuAtom);

  const url = `https://pinmymap.vercel.app/map/${user.id}`;

  return (
    <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <PopoverTrigger className={'absolute top-[22px] left-5 z-10'}>
        <CgMenuGridO className='w-6 h-6 text-gray-500' />
      </PopoverTrigger>
      <PopoverContent onInteractOutside={(e) => e.preventDefault()} className={'ml-3 mt-3 text-sm font-medium space-y-6 w-[calc(100vw-24px)] sm:w-[280px]'}>
        <div className='flex items-center gap-x-2'>
          {user.image ? (
            <Image className='rounded-full shadow-lg' src={user.image} alt={user.name ?? 'user icon'} width={32} height={32} />
          ) : (
            <FaCircleUser className='w-8 h-8' />
          )}
          {user.name && <span>{user.name}</span>}
          <Button className={'text-white bg-orange-500 hover:brightness-110 hover:bg-orange-500 font-medium w-20 p-2.5 h-9 ml-auto'}>Sign out</Button>
        </div>
        <div className='space-y-2'>
          <p>Share your map</p>
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
      </PopoverContent>
    </Popover>
  );
}
