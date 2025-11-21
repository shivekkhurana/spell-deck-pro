import type { Slide } from './slides.types';
import { atom } from 'jotai';

export const slidesAtom = atom<Slide[]>([]);
