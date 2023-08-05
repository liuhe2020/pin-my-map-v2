import type { LatLng, PinWithPhotos } from '@/components/types';
import { atom } from 'jotai';

const pinDetailsAtom = atom<PinWithPhotos | null>(null);

const newPinAtom = atom<LatLng | null>(null);

const isDrawerOpenAtom = atom(false);

const drawerStateAtom = atom(''); // values: details | create | edit

export { pinDetailsAtom, newPinAtom, isDrawerOpenAtom, drawerStateAtom };
