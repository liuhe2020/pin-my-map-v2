'use client';

import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Map, { Marker, type MapLayerMouseEvent, type MapRef } from 'react-map-gl';
import GeocoderControl from '@/components/geocoder';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import AddPin from '@/components/addPin';
import type { NewPin } from '@/components/types';

const mapBoxToken = process.env.NEXT_PUBLIC_MAPBOX!;
const ease = [[0.4, 0, 0.6, 1]];

export default function MapPage() {
  const [viewState, setViewState] = useState({
    latitude: 46,
    longitude: 17,
    zoom: 4,
  });

  const mapRef = useRef<MapRef>(null);

  const [newPin, setNewPin] = useState<null | NewPin>(null);

  // create a new marker at clicked location
  const handleMapClick = async (e: MapLayerMouseEvent) => {
    if (newPin) {
      return setNewPin(null);
    }
    const latitude = e.lngLat.lat;
    const longitude = e.lngLat.lng;
    const getPlace = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapBoxToken}`);
    const place = await getPlace.json();

    const location =
      place.features.find((i: { id: string }) => i.id.includes('poi'))?.text ||
      place.features.find((i: { id: string }) => i.id.includes('neighborhood'))?.text ||
      place.features.find((i: { id: string }) => i.id.includes('locality'))?.text ||
      '';
    const city = place.features.find((i: { id: string }) => i.id.includes('place'))?.text || '';
    const region = place.features.find((i: { id: string }) => i.id.includes('region'))?.text || '';
    const country = place.features.find((i: { id: string }) => i.id.includes('country'))?.text || '';

    setNewPin({ latitude, longitude, location, city, region, country });
    mapRef.current?.easeTo({ center: [longitude, latitude], offset: [-240, 0] });
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
            >
              <img src='/images/marker_blue.svg' alt='marker_pin' style={{ cursor: 'pointer' }} />
            </Marker>
          )}
        </Map>
      </div>
      <AnimatePresence>
        {newPin && (
          <motion.div
            className='absolute right-0 top-0 h-full z-10 bg-white w-full max-w-120'
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease }}
          >
            <AddPin newPin={newPin} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
