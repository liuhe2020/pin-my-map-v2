import type { DrawerAtom, PinValues, PinWithPhotos } from '@/components/types';
import { atom } from 'jotai';

const pinDetailsAtom = atom<PinWithPhotos | null>(null);

const newPinAtom = atom<Pick<PinValues, 'latitude' | 'longitude'> | null>(null);

const drawerAtom = atom<DrawerAtom>({ isOpen: false, state: 'details' });

const dropdownAtom = atom<null | 'search' | 'menu'>(null);

export { pinDetailsAtom, newPinAtom, drawerAtom, dropdownAtom };
