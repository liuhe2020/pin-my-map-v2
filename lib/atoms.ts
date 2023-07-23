import { PinWithPhotos } from '@/components/types';
import { atom } from 'jotai';

export const pinAtom = atom<PinWithPhotos | null>(null);

export const isAddingAtom = atom(false);
export const isEditingAtom = atom(false);
