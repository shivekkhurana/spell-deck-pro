import type { SpeakerNote } from './speakerNotes.types';
import { atom } from 'jotai';

import { currentSlideIdAtom } from '@/atoms/currentSlide/currentSlide';

export const speakerNotesAtom = atom<SpeakerNote[]>([]);

export const currentSlideNotesAtom = atom<SpeakerNote[]>((get) => {
  const notes = get(speakerNotesAtom);
  const currentSlideId = get(currentSlideIdAtom);
  if (!currentSlideId) return [];
  return notes
    .filter((note) => note.slideId === currentSlideId)
    .sort((a, b) => a.order - b.order);
});
