'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { UserWithPins } from './types';
import Image from 'next/image';
import { CgMenuGridO } from 'react-icons/cg';
import { FaCircleUser } from 'react-icons/fa6';
import { FacebookShareButton, LinkedinShareButton, PinterestShareButton, RedditShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import { usePathname } from 'next/navigation';

export default function Menu({ user }: { user: UserWithPins }) {
  const pathname = usePathname();
  const url = `https://pin-my-map.vercel.app${pathname}`;
  return (
    <Popover>
      <PopoverTrigger className={'absolute top-[22px] left-5 z-10'}>
        <CgMenuGridO className='w-6 h-6 text-gray-500' />
      </PopoverTrigger>
      <PopoverContent className={'ml-3 mt-3 text-sm font-medium'}>
        <div className='flex items-center gap-x-2'>
          {user.image ? (
            <Image className='rounded-full shadow-lg' src={user.image} alt={user.name ?? 'user icon'} width={32} height={32} />
          ) : (
            <FaCircleUser className='w-8 h-8' />
          )}
          {user.name && <span>{user.name}</span>}
        </div>
        <div>
          <FacebookShareButton url={url}>yo</FacebookShareButton>
        </div>
      </PopoverContent>
    </Popover>
  );
}
