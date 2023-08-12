'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CgMenuGridO } from 'react-icons/cg';
import { BsFillCaretLeftFill } from 'react-icons/bs';
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
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Menu() {
  const pathname = usePathname();
  const url = `https://pinmymap.vercel.app${pathname}`;

  return (
    <Popover>
      <PopoverTrigger className={'absolute top-[22px] left-5 z-10'}>
        <CgMenuGridO className='w-6 h-6 text-gray-500' />
      </PopoverTrigger>
      <PopoverContent className={'ml-3 mt-3 text-sm font-medium space-y-4 w-[calc(100vw-24px)] sm:w-[280px]'}>
        <Link
          href='/'
          className='text-white bg-orange-500 hover:brightness-110 hover:bg-orange-500 rounded-md font-medium pl-2.5 pr-3.5 py-2 inline-flex items-center gap-1'
        >
          <BsFillCaretLeftFill className='w-4 h-4' />
          <span>Home</span>
        </Link>
        <div className='space-y-2'>
          <p>Share this map</p>
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
