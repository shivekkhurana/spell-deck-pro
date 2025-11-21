import { atom } from 'jotai';

import { slidesAtom } from '@/atoms/slides/slides';
import type { Slide } from '@/atoms/slides/slides.types';

export const currentSlideIdAtom = atom<string | null>(null);

export const currentSlideAtom = atom<Slide | null>((get) => {
  const slides = get(slidesAtom);
  const currentSlideId = get(currentSlideIdAtom);
  if (!currentSlideId) return null;
  return slides.find((slide) => slide.id === currentSlideId) ?? null;
});

export const coverPageAtom = atom<Slide | null>((get) => {
  const slides = get(slidesAtom);
  return slides.find((slide) => slide.order === 0) ?? null;
});
