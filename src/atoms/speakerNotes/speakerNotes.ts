import type { SpeakerNote } from './speakerNotes.types';
import { atom } from 'jotai';

import { currentSlideIdAtom } from '@/atoms/currentSlide/currentSlide';
import type { ContextAwareSpellCheckResult } from '@/services/spellCheckService/contextAwareSpellCheck';

export const speakerNotesAtom = atom<SpeakerNote[]>([]);

export const currentSlideNotesAtom = atom<SpeakerNote[]>((get) => {
  const notes = get(speakerNotesAtom);
  const currentSlideId = get(currentSlideIdAtom);
  if (!currentSlideId) return [];
  return notes
    .filter((note) => note.slideId === currentSlideId)
    .sort((a, b) => a.order - b.order);
});

// Global ignored words atom - words ignored across all notes
export const ignoredWordsAtom = atom<Set<string>>(new Set<string>());

// Spell check errors per note ID - preserves state when switching slides
export const spellCheckErrorsAtom = atom<
  Map<string, ContextAwareSpellCheckResult['errors']>
>(new Map());

// Rejected suggestions per note ID - preserves rejected suggestions when switching slides
// Map<noteId, Map<word, Set<suggestion>>>
export const rejectedSuggestionsAtom = atom<
  Map<string, Map<string, Set<string>>>
>(new Map());
