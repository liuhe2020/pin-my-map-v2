'use client';

import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useCallback, useRef, useState } from 'react';
import Map, { Marker, type MapLayerMouseEvent, type MapRef } from 'react-map-gl';
import GeocoderControl from '@/components/GeocoderControl';
import { AnimatePresence, motion } from 'framer-motion';
import type { PinWithPhotos, UserWithPins } from '@/components/types';
import Drawer from './Drawer';
import { pinDetailsAtom, drawerAtom, newPinAtom, menuAtom } from '@/lib/atoms';
import { useAtom } from 'jotai';
import type { MarkerEvent } from 'react-map-gl/dist/esm/types';
import { env } from '@/env.mjs';
import { cn } from '@/lib/utils';
import PinIcon from '@/components/ui/pin-icon';
import Menu from '@/app/user/[id]/Menu';

export default function MapInterface({ user }: { user: UserWithPins }) {
  const [viewState, setViewState] = useState({
    latitude: 46,
    longitude: 17,
    zoom: 4,
  });
  const [cursor, setCursor] = useState('default');
  const [newPin, setNewPin] = useAtom(newPinAtom);
  const [drawer, setDrawer] = useAtom(drawerAtom);
  const [isMenuOpen, setIsMenuOpen] = useAtom(menuAtom);
  const [, setPinDetails] = useAtom(pinDetailsAtom);

  const mapRef = useRef<MapRef>(null);

  const handleMapClick = async (e: MapLayerMouseEvent) => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
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
    mapRef.current?.easeTo({ center: [newPin.longitude, newPin.latitude], offset: [-240, 0] });
    setDrawer({ isOpen: true, state: 'create' });
  };

  const handlePinClick = (e: MarkerEvent<mapboxgl.Marker, globalThis.MouseEvent>, pin: PinWithPhotos) => {
    e.originalEvent.stopPropagation(); // stop add pin firing on existing pins
    if (isMenuOpen) {
      setIsMenuOpen(false); // stop drawer open if menu is open
      return;
    }
    if (newPin && drawer.isOpen === true) return;
    if (drawer.isOpen && drawer.state === 'edit') return;
    setNewPin(null);
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
      <Menu user={user} />
      <AnimatePresence>
        {drawer.isOpen && (
          <motion.div
            className='absolute right-0 top-0 h-full z-10 bg-white w-full max-w-120 overflow-y-auto'
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
