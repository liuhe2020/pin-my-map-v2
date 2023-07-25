'use client';

import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import { useState } from 'react';
import { isEditingAtom, pinAtom } from '@/lib/atoms';
import { useAtom } from 'jotai';
import Image from 'next/image';
import { Lightbox } from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function Pin() {
  const [isLightBoxOpen, setIsLightBoxOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [pin] = useAtom(pinAtom);
  const [, setIsEditing] = useAtom(isEditingAtom);

  const handleClick = (i: number) => {
    setIsLightBoxOpen(true);
    setSlideIndex(i);
  };

  return (
    <div className='space-y-6 text-sm font-medium'>
      <div className='space-y-2'>
        <h2>Location</h2>
        <p className=''>{pin?.location}</p>
      </div>
      <div className='space-y-2'>
        <h2>City</h2>
        <p className=''>{pin?.city}</p>
      </div>
      <div className='space-y-2'>
        <h2>Region</h2>
        <p className=''>{pin?.region}</p>
      </div>
      <div className='space-y-2'>
        <h2>Country</h2>
        <p className=''>{pin?.country}</p>
      </div>
      <div className='space-y-2'>
        <h2>Date</h2>
        <p className=''>{pin?.date?.toISOString().substring(0, 10)}</p>
      </div>
      <div className='space-y-2'>
        <h2>Description</h2>
        <p className=''>{pin?.description}</p>
      </div>
      {pin && pin.photos.length > 0 && (
        <div className='space-y-2'>
          <h2>Photos</h2>
          <div className='grid grid-cols-3 gap-2'>
            {pin?.photos.map((photo, i) => (
              <Image
                key={photo.id}
                src={photo.url}
                alt={pin.location}
                width={140}
                height={140}
                className='aspect-square object-cover cursor-pointer'
                onClick={() => handleClick(i)}
              />
            ))}
          </div>
        </div>
      )}
      <div className='flex gap-x-2'>
        <button
          type='button'
          className='flex justify-center items-center gap-x-2 text-white bg-indigo-500 hover:brightness-110 font-medium rounded-lg p-2.5 focus:outline-none w-24 mx-auto lg:mx-0 text-center'
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
        <AlertDialog>
          <AlertDialogTrigger
            className={
              'flex justify-center items-center gap-x-2 text-white bg-red-500 hover:brightness-110 font-medium rounded-lg p-2.5 focus:outline-none w-24 mx-auto lg:mx-0 text-center'
            }
          >
            Delete
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone. This will permanently delete your pin and remove your data.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className={'w-24 font-medium'}>Cancel</AlertDialogCancel>
              <AlertDialogAction className={'text-white bg-red-500 hover:brightness-110 hover:bg-red-500 font-medium w-24 p-2.5'}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Lightbox
        open={isLightBoxOpen}
        close={() => setIsLightBoxOpen(false)}
        slides={pin?.photos.map((photo) => ({ src: photo.url, alt: pin.location }))}
        index={slideIndex}
        plugins={pin && pin.photos.length > 1 ? [Zoom, Thumbnails] : [Zoom]}
        carousel={{ finite: true }}
      />
    </div>
  );
}
