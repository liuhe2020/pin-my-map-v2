'use client';

import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import { useAtom } from 'jotai';
import { pinDetailsAtom } from '@/lib/atoms';
import { VscChromeClose } from 'react-icons/vsc';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { PinWithPhotos } from '@/components/types';
import { Lightbox } from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';

export default function Drawer() {
  const [pinDetails, setPinDetails] = useAtom(pinDetailsAtom);
  const [pin, setPin] = useState<PinWithPhotos | null>(null);
  const [isLightBoxOpen, setIsLightBoxOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  const handleImageClick = (i: number) => {
    setIsLightBoxOpen(true);
    setSlideIndex(i);
  };

  useEffect(() => {
    pinDetails && setPin(pinDetails);
  }, []);

  const handleDrawerClose = () => {
    setPinDetails(null);
  };

  return (
    <>
      <div className='p-4 sm:p-6 flex flex-col gap-y-6'>
        <div className='flex justify-end'>
          <VscChromeClose className='w-6 h-6 cursor-pointer' onClick={handleDrawerClose} />
        </div>
        <div className='space-y-6 text-sm font-medium'>
          <div className='space-y-2'>
            <h2>Location</h2>
            <p className=''>{pin?.location}</p>
          </div>
          {pin?.city && (
            <div className='space-y-2'>
              <h2>City</h2>
              <p className=''>{pin?.city}</p>
            </div>
          )}
          {pin?.region && (
            <div className='space-y-2'>
              <h2>Region</h2>
              <p className=''>{pin?.region}</p>
            </div>
          )}
          {pin?.country && (
            <div className='space-y-2'>
              <h2>Country</h2>
              <p className=''>{pin?.country}</p>
            </div>
          )}
          {pin?.date && (
            <div className='space-y-2'>
              <h2>Date</h2>
              <p className=''>{pin.date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          )}
          {pin?.description && (
            <div className='space-y-2'>
              <h2>Description</h2>
              <p className=''>{pin?.description}</p>
            </div>
          )}
          {pin && pin.photos.length > 0 && (
            <div className='space-y-2'>
              <div className='grid grid-cols-3 gap-2'>
                {pin?.photos.map((photo, i) => (
                  <Image
                    key={photo.id}
                    src={photo.url}
                    alt={pin.location}
                    width={140}
                    height={140}
                    className='aspect-square object-cover cursor-pointer'
                    onClick={() => handleImageClick(i)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Lightbox
        open={isLightBoxOpen}
        close={() => setIsLightBoxOpen(false)}
        slides={pin?.photos.map((photo) => ({ src: photo.url, alt: pin.location }))}
        index={slideIndex}
        plugins={pin && pin.photos.length > 1 ? [Zoom, Thumbnails] : [Zoom]}
        carousel={{ finite: true }}
      />
    </>
  );
}
