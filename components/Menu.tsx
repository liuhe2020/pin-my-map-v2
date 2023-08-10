'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { UserWithPins } from './types';
import Image from 'next/image';
import { FaUserCircle } from 'react-icons/fa';

export default function Menu({ user }: { user: UserWithPins }) {
  return (
    <Popover>
      <PopoverTrigger className={'absolute top-3.5 right-3'}>
        {user.image ? <Image src={user.image} alt={user.name ?? 'user icon'} width={42} height={42} className='rounded-full shadow-lg' /> : <FaUserCircle />}
      </PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  );
}
