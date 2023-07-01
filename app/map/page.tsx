'use client';

import React, { useState } from 'react';
import Map from 'react-map-gl';
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
      >
        <GeocoderControl mapboxAccessToken={mapBoxToken} position='top-left' />
      </Map>
    </div>
  );
}
