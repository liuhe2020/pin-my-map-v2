'use client';

import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useState } from 'react';
import Map, { type MapLayerMouseEvent, Marker, type ViewState, useMap } from 'react-map-gl';
import GeocoderControl from '@/components/geocoder';
import { AnimatePresence, motion } from 'framer-motion';

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

  const [newPin, setNewPin] = useState<null | { lat: number; long: number }>(null);

  // create a new marker at clicked location
  const handleMapClick = (e: MapLayerMouseEvent) => {
    if (newPin) return setNewPin(null);
    setNewPin({ lat: e.lngLat.lat, long: e.lngLat.lng });
  };

  return (
    <div className='h-screen overflow-hidden relative'>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={mapBoxToken}
        // doubleClickZoom={false}
        mapStyle='mapbox://styles/liuhe2020/cktu2h4q70wil17m6umh33a9i'
        minZoom={1.585} // limit zoom out to single world map
        maxZoom={19}
        onClick={handleMapClick}
        style={{ width: `${newPin ? '70%' : '100%'}` }}
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
      {/* {newPin && (
        <motion.div
          className='absolute right-0 top-0 w-96 h-full z-10 bg-white'
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.5, ease }}
        ></motion.div>
      )} */}
    </div>
  );
}
