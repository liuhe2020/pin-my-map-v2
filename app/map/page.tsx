'use client';

import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Map, { Marker, type MapLayerMouseEvent, type MapRef } from 'react-map-gl';
import GeocoderControl from '@/components/geocoder';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const mapBoxToken = process.env.NEXT_PUBLIC_MAPBOX!;
const ease = [[0.4, 0, 0.6, 1]];

export default function MapPage() {
  const [viewState, setViewState] = useState({
    latitude: 46,
    longitude: 17,
    zoom: 4,
    // minZoom: 1.585, // limit zoom out to single world map
    // maxZoom: 19,
  });

  const mapRef = useRef<MapRef>(null);

  const [newPin, setNewPin] = useState<null | { lat: number; long: number }>(null);

  // create a new marker at clicked location
  const handleMapClick = (e: MapLayerMouseEvent) => {
    if (newPin) {
      // setWidth('w-full');
      setNewPin(null);
      return;
    }
    // setWidth('w-3/4');
    setNewPin({ lat: e.lngLat.lat, long: e.lngLat.lng });
    mapRef.current?.easeTo({ center: [e.lngLat.lng + 8, e.lngLat.lat] });
  };

  return (
    <div className='overflow-hidden relative'>
      <div className='w-full h-screen'>
        <Map
          ref={mapRef}
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          mapboxAccessToken={mapBoxToken}
          // doubleClickZoom={false}
          mapStyle='mapbox://styles/liuhe2020/cktu2h4q70wil17m6umh33a9i'
          minZoom={1.585} // limit zoom out to single world map
          maxZoom={19}
          onClick={handleMapClick}
        >
          <GeocoderControl mapboxAccessToken={mapBoxToken} position='top-left' />
          {newPin && (
            <Marker
              latitude={newPin.lat}
              longitude={newPin.long}
              offset={[0, -14]} //centering marker
            >
              <img src='/images/marker_blue.svg' alt='marker_pin' style={{ cursor: 'pointer' }} />
            </Marker>
          )}
        </Map>
      </div>
      {newPin && (
        <motion.div
          className='absolute right-0 top-0 h-full z-10 bg-white'
          initial={{ width: 0 }}
          animate={{ width: 384 }}
          exit={{ width: 0 }}
          transition={{ duration: 0.5, ease }}
        ></motion.div>
      )}
    </div>
  );
}
