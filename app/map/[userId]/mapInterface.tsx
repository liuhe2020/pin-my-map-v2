'use client';

import 'mapbox-gl/dist/mapbox-gl.css';
import React, { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import Map, { Marker, type MapLayerMouseEvent, type MapRef } from 'react-map-gl';
import GeocoderControl from '@/components/geocoder';
import { AnimatePresence, motion } from 'framer-motion';
import type { PinWithPhotos, UserWithPins } from '@/components/types';
import Image from 'next/image';
import Drawer from './Drawer';
import { pinDetailsAtom, isDrawerOpenAtom, drawerStateAtom, newPinAtom } from '@/lib/atoms';
import { useAtom } from 'jotai';
import type { MarkerEvent } from 'react-map-gl/dist/esm/types';
import { Pin } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { env } from '@/lib/env.mjs';

const ease = [[0.4, 0, 0.6, 1]];

export default function MapInterface({ user }: { user: UserWithPins | null }) {
  const [viewState, setViewState] = useState({
    latitude: 46,
    longitude: 17,
    zoom: 4,
  });
  const [newPin, setNewPin] = useAtom(newPinAtom);
  const [isDrawerOpen, setIsDrawerOpen] = useAtom(isDrawerOpenAtom);
  const [drawerState, setDrawerState] = useAtom(drawerStateAtom);
  const [, setPinDetails] = useAtom(pinDetailsAtom);

  const mapRef = useRef<MapRef>(null);

  // create a new marker at clicked location
  const handleMapClick = async (e: MapLayerMouseEvent) => {
    // if (pin) return setPin(null);
    if (!drawerState) {
      if (newPin) return setNewPin(null);
      const latitude = e.lngLat.lat;
      const longitude = e.lngLat.lng;
      setNewPin({ latitude, longitude });
    }
  };

  const handleNewPinClick = async () => {
    if (!newPin) return;
    mapRef.current?.easeTo({ center: [newPin.longitude, newPin.latitude], offset: [-240, 0] });
    setDrawerState('create');
    setIsDrawerOpen(true);
  };

  const handlePinClick = (e: MarkerEvent<mapboxgl.Marker, globalThis.MouseEvent>, pin: PinWithPhotos) => {
    e.originalEvent.stopPropagation(); // stop add pin firing on existing pins
    setIsDrawerOpen(true);
    setDrawerState('details');
    setPinDetails(pin);
    mapRef.current?.easeTo({ center: [pin.longitude, pin.latitude], offset: [-240, 0] });
  };

  return (
    <div className='overflow-hidden relative'>
      <div className='w-full h-screen'>
        <Map
          ref={mapRef}
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX}
          doubleClickZoom={false}
          mapStyle='mapbox://styles/liuhe2020/cktu2h4q70wil17m6umh33a9i'
          minZoom={1.585} // limit zoom out to single world map
          maxZoom={19}
          onClick={handleMapClick}
        >
          <GeocoderControl mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX} position='top-left' />
          {newPin && (
            <Marker
              latitude={newPin.latitude}
              longitude={newPin.longitude}
              offset={[0, -14]} //centering marker
              onClick={handleNewPinClick}
            >
              <Image src='/images/marker_blue.svg' alt='marker_pin' width={32} height={48} />
            </Marker>
          )}
          {user?.pins.map((pin) => (
            <Marker
              key={pin.id}
              latitude={pin.latitude}
              longitude={pin.longitude}
              offset={[0, -14]} //centering marker
              onClick={(e) => handlePinClick(e, pin)}
            >
              <Image src='/images/marker_orange.svg' alt='marker_pin' width={32} height={48} />
            </Marker>
          ))}
        </Map>
      </div>
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            key='create'
            className='absolute right-0 top-0 h-full z-10 bg-white w-full max-w-120 overflow-y-auto'
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease }}
          >
            <Drawer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
