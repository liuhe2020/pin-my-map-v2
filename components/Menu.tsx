'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { UserWithPins } from './types';
import Image from 'next/image';
import { CgMenuGridO } from 'react-icons/cg';

export default function Menu({ user }: { user: UserWithPins }) {
  return (
    <Popover>
      <PopoverTrigger className={'absolute top-[22px] left-5 z-10'}>
        <CgMenuGridO className='w-6 h-6 text-gray-500' />
      </PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  );
}
