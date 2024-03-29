'use client';

import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useCallback, useRef, useState } from 'react';
import Map, { Marker, type MapLayerMouseEvent, type MapRef } from 'react-map-gl';
import { AnimatePresence, motion } from 'framer-motion';
import type { PinWithPhotos, UserWithPins } from '@/components/types';
import Drawer from './drawer';
import { pinDetailsAtom, drawerAtom, newPinAtom, dropdownAtom } from '@/lib/atoms';
import { useAtom } from 'jotai';
import type { MarkerEvent } from 'react-map-gl/dist/esm/types';
import { env } from '@/env.mjs';
import { cn } from '@/lib/utils';
import PinIcon from '@/components/ui/pin-icon';
import Search from '@/components/search';
import { useWindowSize } from 'usehooks-ts';
import { type Session } from 'next-auth';

export default function MapInterface({ user, session }: { user: UserWithPins; session: Session | null }) {
  const [viewState, setViewState] = useState({
    latitude: 46,
    longitude: 17,
    zoom: 4,
  });
  const [cursor, setCursor] = useState('default');
  const [newPin, setNewPin] = useAtom(newPinAtom);
  const [drawer, setDrawer] = useAtom(drawerAtom);
  const [, setPinDetails] = useAtom(pinDetailsAtom);
  const [dropDown, setDropdown] = useAtom(dropdownAtom);
  const { width: windowWidth } = useWindowSize();

  const mapRef = useRef<MapRef>(null);

  const handleMapClick = async (e: MapLayerMouseEvent) => {
    if (dropDown) {
      setDropdown(null); // close search/menu dropdown if open
      return;
    }
    if (!drawer.isOpen) {
      if (newPin) {
        setNewPin(null);
        return;
      }
      setNewPin({ latitude: e.lngLat.lat, longitude: e.lngLat.lng });
      return;
    }
    if (drawer.state === 'details') {
      setDrawer((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleNewPinClick = async () => {
    if (!newPin) return;
    windowWidth && windowWidth >= 640 && mapRef.current?.easeTo({ center: [newPin.longitude, newPin.latitude], offset: [-240, 0] });
    setDrawer({ isOpen: true, state: 'create' });
  };

  const handlePinClick = (e: MarkerEvent<mapboxgl.Marker, globalThis.MouseEvent>, pin: PinWithPhotos) => {
    e.originalEvent.stopPropagation(); // stop add pin firing on existing pins
    if (dropDown) setDropdown(null);
    if (newPin && drawer.isOpen === true) return;
    if (drawer.isOpen && drawer.state === 'edit') return;
    setNewPin(null);
    setDrawer({ isOpen: true, state: 'details' });
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
          {newPin && (
            <Marker
              latitude={newPin.latitude}
              longitude={newPin.longitude}
              offset={[0, -14]} //centering marker
              onClick={handleNewPinClick}
            >
              <PinIcon className='cursor-pointer' colour='#6366f1' />
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
              <PinIcon
                className={cn(drawer.isOpen === true && (drawer.state === 'create' || drawer.state === 'edit') ? 'cursor-default' : 'cursor-pointer')}
                colour='#f97316'
              />
            </Marker>
          ))}
        </Map>
      </div>
      <Search mapRef={mapRef} session={session} />
      <AnimatePresence>
        {drawer.isOpen && (
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
