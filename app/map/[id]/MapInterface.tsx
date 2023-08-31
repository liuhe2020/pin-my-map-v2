'use client';

import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useCallback, useRef, useState } from 'react';
import Map, { Marker, type MapRef } from 'react-map-gl';
import { AnimatePresence, motion } from 'framer-motion';
import type { PinWithPhotos, UserWithPins } from '@/components/types';
import { menuAtom, pinDetailsAtom } from '@/lib/atoms';
import { useAtom } from 'jotai';
import { env } from '@/env.mjs';
import PinIcon from '@/components/ui/pin-icon';
import Drawer from './Drawer';
import type { MarkerEvent } from 'react-map-gl/dist/esm/types';
import Search from '@/components/Search';
import { useWindowSize } from 'usehooks-ts';

export default function MapInterface({ user }: { user: UserWithPins }) {
  const [viewState, setViewState] = useState({
    latitude: 46,
    longitude: 17,
    zoom: 4,
  });
  const [cursor, setCursor] = useState('default');
  const [pinDetails, setPinDetails] = useAtom(pinDetailsAtom);
  const [isMenuOpen, setIsMenuOpen] = useAtom(menuAtom);
  const { width: windowWidth } = useWindowSize();

  const mapRef = useRef<MapRef>(null);

  // create a new marker at clicked location
  const handleMapClick = async () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      return;
    }
    if (pinDetails) setPinDetails(null);
  };

  const handlePinClick = (e: MarkerEvent<mapboxgl.Marker, globalThis.MouseEvent>, pin: PinWithPhotos) => {
    e.originalEvent.stopPropagation(); // stop handleMapClick firing
    if (isMenuOpen) {
      setIsMenuOpen(false); // stop drawer open if menu is open
      return;
    }
    setPinDetails(pin);
    windowWidth && windowWidth >= 640 && mapRef.current?.easeTo({ center: [pin.longitude, pin.latitude], offset: [-240, 0] });
  };

  const handleMapDragStart = useCallback(() => setCursor('all-scroll'), []);
  const handleMapDragEnd = useCallback(() => setCursor('default'), []);

  return (
    <div className='overflow-hidden relative'>
      <div className='w-full h-screen'>
        <Map
          ref={mapRef}
          {...viewState}
          onMove={(e) => setViewState(e.viewState)}
          onDragStart={handleMapDragStart}
          onDragEnd={handleMapDragEnd}
          mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX}
          doubleClickZoom={false}
          mapStyle='mapbox://styles/liuhe2020/cktu2h4q70wil17m6umh33a9i'
          minZoom={1.585} // limit zoom out to single world map
          maxZoom={19}
          cursor={cursor}
          onClick={handleMapClick}
        >
          {user?.pins.map((pin) => (
            <Marker
              key={pin.id}
              latitude={pin.latitude}
              longitude={pin.longitude}
              offset={[0, -14]} //centering marker
              onClick={(e) => handlePinClick(e, pin)}
            >
              <PinIcon className={'cursor-pointer'} colour='#f97316' />
            </Marker>
          ))}
        </Map>
      </div>
      <Search />
      <AnimatePresence>
        {pinDetails && (
          <motion.div
            className='absolute right-0 top-0 h-full z-10 backdrop-blur-lg shadow-xl bg-white/80 w-full max-w-120 overflow-y-auto'
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.6, 1] }}
          >
            <Drawer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
