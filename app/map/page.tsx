'use client';

import React, { useState } from 'react';
import Map from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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
        {...viewport}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX}
        doubleClickZoom={false}
        mapStyle='mapbox://styles/liuhe2020/cktu2h4q70wil17m6umh33a9i'
      />
    </div>
  );
}
