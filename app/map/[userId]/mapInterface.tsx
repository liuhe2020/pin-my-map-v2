'use client';

import 'mapbox-gl/dist/mapbox-gl.css';
import React, { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import Map, { Marker, type MapLayerMouseEvent, type MapRef, type MapEvent, MarkerEvent, MarkerDragEvent } from 'react-map-gl';
import GeocoderControl from '@/components/geocoder';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import AddPin from '@/app/map/[userId]/addPin';
import type { PinDetails, UserWithPins } from '@/components/types';
import Image from 'next/image';
import Drawer from './drawer';
import { isAddingAtom, pinAtom } from '@/lib/atoms';
import { useAtom } from 'jotai';

const mapBoxToken = process.env.NEXT_PUBLIC_MAPBOX!;
const ease = [[0.4, 0, 0.6, 1]];

export default function MapInterface({ user }: { user: UserWithPins | null }) {
  const [viewState, setViewState] = useState({
    latitude: 46,
    longitude: 17,
    zoom: 4,
  });
  const [newPin, setNewPin] = useState<null | PinDetails>(null);
  const [isAdding, setIsAdding] = useAtom(isAddingAtom);
  const [pin, setPin] = useAtom(pinAtom);

  const mapRef = useRef<MapRef>(null);

  // create a new marker at clicked location
  const handleMapClick = async (e: MapLayerMouseEvent) => {
    if (!isAdding) {
      if (newPin) return setNewPin(null);
      const latitude = e.lngLat.lat;
      const longitude = e.lngLat.lng;
      setNewPin({ latitude, longitude });
    }
  };

  const handleNewPinClick = async () => {
    if (newPin) {
      const getPlace = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${newPin.longitude},${newPin.latitude}.json?access_token=${mapBoxToken}`);
      const place = await getPlace.json();

      const location =
        place.features.find((i: { id: string }) => i.id.includes('poi'))?.text ||
        place.features.find((i: { id: string }) => i.id.includes('neighborhood'))?.text ||
        place.features.find((i: { id: string }) => i.id.includes('locality'))?.text ||
        '';
      const city = place.features.find((i: { id: string }) => i.id.includes('place'))?.text || '';
      const region = place.features.find((i: { id: string }) => i.id.includes('region'))?.text || '';
      const country = place.features.find((i: { id: string }) => i.id.includes('country'))?.text || '';

      setNewPin({ ...newPin, location, city, region, country });
      mapRef.current?.easeTo({ center: [newPin.longitude, newPin.latitude], offset: [-240, 0] });
      setIsAdding(true);
    }
  };

  return (
    <div className='overflow-hidden relative'>
      <div className='w-full h-screen'>
        <Map
          ref={mapRef}
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          mapboxAccessToken={mapBoxToken}
          doubleClickZoom={false}
          mapStyle='mapbox://styles/liuhe2020/cktu2h4q70wil17m6umh33a9i'
          minZoom={1.585} // limit zoom out to single world map
          maxZoom={19}
          onClick={handleMapClick}
        >
          <GeocoderControl mapboxAccessToken={mapBoxToken} position='top-left' />
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
              onClick={(e) => {
                e.originalEvent.stopPropagation(); // stop add pin firing on existing pins
                setPin(pin);
                mapRef.current?.easeTo({ center: [pin.longitude, pin.latitude], offset: [-240, 0] });
              }}
            >
              <Image src='/images/marker_orange.svg' alt='marker_pin' width={32} height={48} />
            </Marker>
          ))}
        </Map>
      </div>
      <AnimatePresence>
        {newPin && isAdding && (
          <motion.div
            key='create'
            className='absolute right-0 top-0 h-full z-10 bg-white w-full max-w-120 overflow-y-auto'
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease }}
          >
            <AddPin newPin={newPin} />
          </motion.div>
        )}
        {pin && (
          <motion.div
            key='current'
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
