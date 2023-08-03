'use client';

import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import { useState } from 'react';
import { drawerStateAtom, pinDetailsAtom } from '@/lib/atoms';
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
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/components/ReactQueryProvider';

export default function PinDetails() {
  const [isLightBoxOpen, setIsLightBoxOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [pinDetails] = useAtom(pinDetailsAtom);
  const [, setDrawerState] = useAtom(drawerStateAtom);

  const handleImageClick = (i: number) => {
    setIsLightBoxOpen(true);
    setSlideIndex(i);
  };

  const deletePin = useMutation((id: string) =>
    fetch('/api/delete-pin', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(id),
    })
  );

  const handleDeleteClick = () => {
    if (pinDetails) {
      deletePin.mutate(pinDetails.id, { onSuccess: () => queryClient.invalidateQueries(['user']) });
    }
  };

  return (
    <div className='space-y-4 text-sm font-medium'>
      <div className='space-y-2'>
        <h2>Location</h2>
        <p className=''>{pinDetails?.location}</p>
      </div>
      <div className='space-y-2'>
        <h2>City</h2>
        <p className=''>{pinDetails?.city}</p>
      </div>
      <div className='space-y-2'>
        <h2>Region</h2>
        <p className=''>{pinDetails?.region}</p>
      </div>
      <div className='space-y-2'>
        <h2>Country</h2>
        <p className=''>{pinDetails?.country}</p>
      </div>
      <div className='space-y-2'>
        <h2>Date</h2>
        <p className=''>{pinDetails?.date?.toISOString().substring(0, 10)}</p>
      </div>
      <div className='space-y-2'>
        <h2>Description</h2>
        <p className=''>{pinDetails?.description}</p>
      </div>
      {pinDetails && pinDetails.photos.length > 0 && (
        <div className='space-y-2'>
          <h2>Photos</h2>
          <div className='grid grid-cols-3 gap-2'>
            {pinDetails?.photos.map((photo, i) => (
              <Image
                key={photo.id}
                src={photo.url}
                alt={pinDetails.location}
                width={140}
                height={140}
                className='aspect-square object-cover cursor-pointer'
                onClick={() => handleImageClick(i)}
              />
            ))}
          </div>
        </div>
      )}
      <div className='flex gap-x-2'>
        <Button onClick={() => setDrawerState('edit')} type='submit' className={'w-24 bg-indigo-500 hover:bg-indigo-500 hover:brightness-110'}>
          Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger
            className={'flex justify-center items-center text-white bg-red-500 hover:brightness-110 font-medium rounded-lg p-2.5 focus:outline-none w-24'}
          >
            Delete
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this pin from your map and remove its data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className={'w-24 font-medium'}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteClick} className={'text-white bg-red-500 hover:brightness-110 hover:bg-red-500 font-medium w-24 p-2.5'}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Lightbox
        open={isLightBoxOpen}
        close={() => setIsLightBoxOpen(false)}
        slides={pinDetails?.photos.map((photo) => ({ src: photo.url, alt: pinDetails.location }))}
        index={slideIndex}
        plugins={pinDetails && pinDetails.photos.length > 1 ? [Zoom, Thumbnails] : [Zoom]}
        carousel={{ finite: true }}
      />
    </div>
  );
}
