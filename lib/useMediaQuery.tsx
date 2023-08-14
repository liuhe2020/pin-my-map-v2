'use client';

import React from 'react';

type MediaQueryListener = (event: MediaQueryListEvent) => void;

export function useMediaQuery(query: string): boolean {
  const subscribe = React.useCallback(
    (callback: MediaQueryListener) => {
      const matchMedia = window.matchMedia(query);

      const handleChange: MediaQueryListener = (event) => {
        callback(event);
      };

      matchMedia.addEventListener('change', handleChange);

      return () => {
        matchMedia.removeEventListener('change', handleChange);
      };
    },
    [query]
  );

  const getSnapshot = (): boolean => {
    return window.matchMedia(query).matches;
  };

  const getServerSnapshot = (): boolean => {
    throw new Error('useMediaQuery is a client-only hook');
  };

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
