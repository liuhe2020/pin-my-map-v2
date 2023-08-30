'use client';

import { ImSearch } from 'react-icons/im';
import { Input } from './ui/input';
import { useState } from 'react';
import useDebounce from '@/lib/useDebounce';
import { env } from '@/env.mjs';
import { useQuery } from '@tanstack/react-query';
import { menuDropdownAtom } from '@/lib/atoms';
import { useAtom } from 'jotai';

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchDropdown, setIsSearchDropdown] = useAtom(menuDropdownAtom);
  const debouncedTerm = useDebounce(searchTerm);

  // const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setSearchTerm(e.target.value);
  //   if (e.target.value.length) {
  //     setIsSearchDropdown('search');
  //   } else {
  //     setIsSearchDropdown(null);
  //   }
  // };

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
      <ImSearch className='absolute top-3.5 left-3.5' />
      <Input
        onChange={(e) => {
          setIsSearchDropdown('search');
          setSearchTerm(e.target.value);
        }}
        type='text'
        value={searchTerm}
        placeholder='Search'
        className='px-10 py-3 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent font-medium border-none'
      />
      <ul className='border-t'>
        {isSearchDropdown === 'search' &&
          data?.features.map((i: any) => (
            <li key={i.id} className='text-sm cursor-pointer px-3.5 py-1.5 first:pt-3 last:pb-3 hover:bg-gray-200'>
              <p className='font-medium overflow-hidden whitespace-nowrap text-ellipsis'>{i.place_name.split(',')[0]}</p>
              <p className='overflow-hidden whitespace-nowrap text-ellipsis'>{i.place_name.substring(i.place_name.indexOf(',') + 1).trim()}</p>
            </li>
          ))}
      </ul>
    </div>
  );
}
