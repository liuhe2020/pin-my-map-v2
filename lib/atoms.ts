import type { LatLng, PinWithPhotos } from '@/components/types';
import { atom } from 'jotai';

const pinDetailsAtom = atom<PinWithPhotos | null>(null);

const newPinAtom = atom<LatLng | null>(null);

const drawerAtom = atom({ isOpen: false, state: '' }); // state values: details | create | edit

export { pinDetailsAtom, newPinAtom, drawerAtom };
