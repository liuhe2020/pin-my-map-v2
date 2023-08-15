'use client';

import { ImSearch } from 'react-icons/im';
import { Input } from './ui/input';
import { useState } from 'react';
import useDebounce from '@/lib/useDebounce';
import { env } from '@/env.mjs';
import { useQuery } from '@tanstack/react-query';

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedTerm = useDebounce(searchTerm);

  const fetcher = async () => {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${debouncedTerm}.json?fuzzyMatch=true&limit=10&proximity=ip&access_token=${env.NEXT_PUBLIC_MAPBOX}`
    );
    return await response.json();
  };

  const { data } = useQuery(['search', debouncedTerm], fetcher);
  // console.log(debouncedTerm);

  console.log(data);
  return (
    <div className='fixed top-2 left-2 sm:w-72'>
      <ImSearch className='absolute top-3.5 left-3.5' />
      <Input
        onChange={(e) => setSearchTerm(e.target.value)}
        type='text'
        value={searchTerm}
        placeholder='Search'
        className='px-10 py-3 h-auto focus-visible:ring-0 focus-visible:ring-offset-0'
      />
      <ul className=''>
        {data?.features.map((i) => (
          <li key={i.id}>{i.place_name}</li>
        ))}
      </ul>
    </div>
  );
}
