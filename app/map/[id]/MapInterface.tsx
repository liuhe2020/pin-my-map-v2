'use client';

import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useCallback, useRef, useState } from 'react';
import Map, { Marker, type MapLayerMouseEvent, type MapRef } from 'react-map-gl';
import GeocoderControl from '@/components/GeocoderControl';
import { AnimatePresence, motion } from 'framer-motion';
import type { PinWithPhotos, UserWithPins } from '@/components/types';
import Image from 'next/image';
import Drawer from './Drawer';
import { pinDetailsAtom, drawerAtom, newPinAtom } from '@/lib/atoms';
import { useAtom } from 'jotai';
import type { MarkerEvent, ViewStateChangeEvent } from 'react-map-gl/dist/esm/types';
import { env } from '@/env.mjs';
// import { useQuery } from '@tanstack/react-query';

const ease = [[0.4, 0, 0.6, 1]];

export default function MapInterface({ user }: { user: UserWithPins }) {
  const [viewState, setViewState] = useState({
    latitude: 46,
    longitude: 17,
    zoom: 4,
  });
  const [cursor, setCursor] = useState('default');
  const [newPin, setNewPin] = useAtom(newPinAtom);
  const [drawer, setDrawer] = useAtom(drawerAtom);
  const [, setPinDetails] = useAtom(pinDetailsAtom);

  const mapRef = useRef<MapRef>(null);

  // create a new marker at clicked location
  const handleMapClick = async (e: MapLayerMouseEvent) => {
    // if (pin) return setPin(null);
    if (drawer.isOpen === false) {
      if (newPin) {
        return setNewPin(null);
      }
      return setNewPin({ latitude: e.lngLat.lat, longitude: e.lngLat.lng });
    }
    if (drawer.state === 'details') {
      setDrawer((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleNewPinClick = async () => {
    if (!newPin) return;
    mapRef.current?.easeTo({ center: [newPin.longitude, newPin.latitude], offset: [-240, 0] });
    setDrawer({ isOpen: true, state: 'create' });
  };

  const handlePinClick = (e: MarkerEvent<mapboxgl.Marker, globalThis.MouseEvent>, pin: PinWithPhotos) => {
    e.originalEvent.stopPropagation(); // stop add pin firing on existing pins
    setDrawer({ isOpen: true, state: 'details' });
    setPinDetails(pin);
    mapRef.current?.easeTo({ center: [pin.longitude, pin.latitude], offset: [-240, 0] });
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
          <GeocoderControl mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX} position='top-left' />
          {newPin && (
            <Marker
              latitude={newPin.latitude}
              longitude={newPin.longitude}
              offset={[0, -14]} //centering marker
              onClick={handleNewPinClick}
            >
              <Image src='/images/marker_blue.svg' alt='marker_pin' width={32} height={48} className='cursor-pointer' />
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
              <Image src='/images/marker_orange.svg' alt='marker_pin' width={32} height={48} className='cursor-pointer' />
            </Marker>
          ))}
        </Map>
      </div>
      <AnimatePresence>
        {drawer.isOpen && (
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
