import { atom } from 'jotai';

import type { Slide } from '@/atoms/slides/slides.types';

export const slidesAtom = atom<Slide[]>([]);
