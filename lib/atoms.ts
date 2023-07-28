import { PinDetails, PinWithPhotos } from '@/components/types';
import { atom } from 'jotai';

const pinAtom = atom<PinWithPhotos | null>(null);

const newPinAtom = atom<PinDetails | null>(null);

const isDrawerOpenAtom = atom(false);

const drawerStateAtom = atom('');

export { pinAtom, newPinAtom, isDrawerOpenAtom, drawerStateAtom };
