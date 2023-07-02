'use client';

import React, { useState } from 'react';
import Map, { type MapLayerMouseEvent, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import GeocoderControl from '@/components/geocoder';

const mapBoxToken = process.env.NEXT_PUBLIC_MAPBOX!;

export default function MapPage() {
  const [viewport, setViewport] = useState({
    latitude: 46,
    longitude: 17,
    zoom: 4,
    minZoom: 1.585, // limit zoom out to single world map
    maxZoom: 19,
  });

  const [newPin, setNewPin] = useState<null | { lat: number; long: number }>(null);

  // create a new marker at clicked location
  const handleMapClick = (e: MapLayerMouseEvent) => {
    if (newPin) return setNewPin(null);
    setNewPin({ lat: e.lngLat.lat, long: e.lngLat.lng });
  };

  return (
    <div className='h-screen'>
      <Map
        initialViewState={{
          latitude: 46,
          longitude: 17,
          zoom: 4,
        }}
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
  );
}
