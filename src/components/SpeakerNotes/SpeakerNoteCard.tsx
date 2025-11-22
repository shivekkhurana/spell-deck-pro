import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import {
  coverPageAtom,
  currentSlideAtom,
} from '@/atoms/currentSlide/currentSlide';
import { slidesAtom } from '@/atoms/slides/slides';
import type { Slide } from '@/atoms/slides/slides.types';
import {
  ignoredWordsAtom,
  rejectedSuggestionsAtom,
  speakerNotesAtom,
  spellCheckErrorsAtom,
} from '@/atoms/speakerNotes/speakerNotes';
import type { SpeakerNote } from '@/atoms/speakerNotes/speakerNotes.types';
import { SpellCheckIndicator } from '@/components/SpellCheck/SpellCheckIndicator';
import { SpellCheckRecommendations } from '@/components/SpellCheck/SpellCheckRecommendations';
import {
  contextAwareSpellCheck,
  type ContextAwareSpellCheckResult,
} from '@/services/spellCheckService/contextAwareSpellCheck';

interface SpeakerNoteCardProps {
  note: SpeakerNote;
}

const updateNote = (
  notes: SpeakerNote[],
  noteId: string,
  updates: Partial<SpeakerNote>
): SpeakerNote[] => {
  return notes.map((note) =>
    note.id === noteId ? { ...note, ...updates } : note
  );
};

const removeNote = (notes: SpeakerNote[], noteId: string): SpeakerNote[] => {
  return notes.filter((note) => note.id !== noteId);
};

interface HandleSpellCheckParams {
  noteId: string;
  noteContent: string;
  currentSlide: Slide | null;
  coverPage: Slide | null;
  setNotes: (updater: (notes: SpeakerNote[]) => SpeakerNote[]) => void;
  setSpellCheckErrors: (
    updater: (
      prev: Map<string, ContextAwareSpellCheckResult['errors']>
    ) => Map<string, ContextAwareSpellCheckResult['errors']>
  ) => void;
}

const handleSpellCheck = async ({
  noteId,
  noteContent,
  currentSlide,
  coverPage,
  setNotes,
  setSpellCheckErrors,
}: HandleSpellCheckParams) => {
  if (!currentSlide || !noteContent.trim()) {
    setNotes((currentNotes) =>
      updateNote(currentNotes, noteId, { spellCheckStatus: 'idle' })
    );
    return;
  }

  setNotes((currentNotes) =>
    updateNote(currentNotes, noteId, { spellCheckStatus: 'checking' })
  );

  try {
    const isCoverPageSameAsCurrentSlide = coverPage?.id === currentSlide?.id;
    const contextString = isCoverPageSameAsCurrentSlide
      ? `Current slide Title: ${currentSlide?.title || ''}\nCurrent slide Content: ${currentSlide?.content || ''}`
      : `Cover page Title: ${coverPage?.title || ''}\nCover page Content: ${coverPage?.content || ''}

        Current slide Title: ${currentSlide?.title || ''}\nCurrent slide Content: ${currentSlide?.content || ''}`;
    const result = await contextAwareSpellCheck(contextString, noteContent);
    // Store errors in persistent state keyed by note ID
    setSpellCheckErrors((prev) => {
      const next = new Map(prev);
      next.set(noteId, result.errors);
      return next;
    });
    setNotes((currentNotes) =>
      updateNote(currentNotes, noteId, { spellCheckStatus: 'checked' })
    );
  } catch (error) {
    console.error('Spell check failed:', error);
    // Clear errors for this note in persistent state
    setSpellCheckErrors((prev) => {
      const next = new Map(prev);
      next.delete(noteId);
      return next;
    });
    setNotes((currentNotes) =>
      updateNote(currentNotes, noteId, { spellCheckStatus: 'error' })
    );
  }
};

interface ReplaceWordParams {
  noteId: string;
  noteContent: string;
  oldWord: string;
  newWord: string;
  setNotes: (updater: (notes: SpeakerNote[]) => SpeakerNote[]) => void;
  setSpellCheckErrors: (
    updater: (
      prev: Map<string, ContextAwareSpellCheckResult['errors']>
    ) => Map<string, ContextAwareSpellCheckResult['errors']>
  ) => void;
}

const replaceWord = ({
  noteId,
  noteContent,
  oldWord,
  newWord,
  setNotes,
  setSpellCheckErrors,
}: ReplaceWordParams) => {
  // Use word boundaries to match whole words only
  const regex = new RegExp(
    `\\b${oldWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
    'gi'
  );
  const newContent = noteContent.replace(regex, newWord);
  setNotes((currentNotes) =>
    updateNote(currentNotes, noteId, { content: newContent })
  );
  // Remove the error from the list after replacement
  setSpellCheckErrors((prev) => {
    const next = new Map(prev);
    const noteErrors = next.get(noteId) || [];
    const updatedErrors = noteErrors.filter(
      (error) => error.word.toLowerCase() !== oldWord.toLowerCase()
    );
    if (updatedErrors.length === 0) {
      next.delete(noteId);
    } else {
      next.set(noteId, updatedErrors);
    }
    return next;
  });
};

interface HandleReplaceParams {
  noteId: string;
  noteContent: string;
  oldWord: string;
  newWord: string;
  setNotes: (updater: (notes: SpeakerNote[]) => SpeakerNote[]) => void;
  setSpellCheckErrors: (
    updater: (
      prev: Map<string, ContextAwareSpellCheckResult['errors']>
    ) => Map<string, ContextAwareSpellCheckResult['errors']>
  ) => void;
}

const handleReplace = ({
  noteId,
  noteContent,
  oldWord,
  newWord,
  setNotes,
  setSpellCheckErrors,
}: HandleReplaceParams) => {
  replaceWord({
    noteId,
    noteContent,
    oldWord,
    newWord,
    setNotes,
    setSpellCheckErrors,
  });
};

interface HandleIgnoreParams {
  noteId: string;
  word: string;
  setIgnoredWords: (updater: (prev: Set<string>) => Set<string>) => void;
  setSpellCheckErrors: (
    updater: (
      prev: Map<string, ContextAwareSpellCheckResult['errors']>
    ) => Map<string, ContextAwareSpellCheckResult['errors']>
  ) => void;
}

const handleIgnore = ({
  noteId,
  word,
  setIgnoredWords,
  setSpellCheckErrors,
}: HandleIgnoreParams) => {
  // Add to global ignored words (applies across all notes)
  setIgnoredWords((prev: Set<string>) => new Set(prev).add(word.toLowerCase()));
  // Remove the error from the displayed list
  setSpellCheckErrors((prev) => {
    const next = new Map(prev);
    const noteErrors = next.get(noteId) || [];
    const updatedErrors = noteErrors.filter(
      (error) => error.word.toLowerCase() !== word.toLowerCase()
    );
    if (updatedErrors.length === 0) {
      next.delete(noteId);
    } else {
      next.set(noteId, updatedErrors);
    }
    return next;
  });
};

export const SpeakerNoteCard = ({ note }: SpeakerNoteCardProps) => {
  const [, setNotes] = useAtom(speakerNotesAtom);
  const [ignoredWords, setIgnoredWords] = useAtom(ignoredWordsAtom);
  const [spellCheckErrors, setSpellCheckErrors] = useAtom(spellCheckErrorsAtom);
  const [rejectedSuggestions, setRejectedSuggestions] = useAtom(
    rejectedSuggestionsAtom
  );
  const currentSlide = useAtomValue(currentSlideAtom);
  const coverPage = useAtomValue(coverPageAtom);
  const notes = useAtomValue(speakerNotesAtom);
  const slides = useAtomValue(slidesAtom);

  const prevNoteRef = useRef<string | null>(null);
  const prevSlideRef = useRef<string | null>(null);

  // Get errors for this note from persistent state
  const noteErrors = spellCheckErrors.get(note.id) || [];

  const debounceMs =
    parseInt(import.meta.env.VITE_SPELL_CHECK_DEBOUNCE_MS || '2000', 10) ||
    2000;

  const debouncedSpellCheck = useDebouncedCallback((noteContent?: string) => {
    handleSpellCheck({
      noteId: note.id,
      noteContent: noteContent || note.content,
      currentSlide,
      coverPage,
      setNotes,
      setSpellCheckErrors,
    });
  }, debounceMs);

  // Effect for note content changes
  useEffect(() => {
    const currentNote = notes.find((n) => n.id === note.id);
    if (!currentNote) return;

    const prevContent = prevNoteRef.current;

    // Initialize on first render
    if (prevContent === null) {
      prevNoteRef.current = currentNote.content;
      return;
    }

    // Check if content changed significantly
    if (currentNote.content !== prevContent) {
      const contentChangedSignificantly =
        Math.abs(currentNote.content.length - prevContent.length) > 10 ||
        currentNote.content.split(' ').length !== prevContent.split(' ').length;

      if (contentChangedSignificantly) {
        // Clear errors and trigger spell check
        setSpellCheckErrors((prev) => {
          const next = new Map(prev);
          next.delete(note.id);
          return next;
        });
        debouncedSpellCheck(currentNote.content);
      }

      // Always update ref to track current state
      prevNoteRef.current = currentNote.content;
    }
  }, [notes, note.id, debouncedSpellCheck, setSpellCheckErrors]);

  // Effect for slide content changes
  useEffect(() => {
    if (!currentSlide) return;

    const currentSlideInSlides = slides.find((s) => s.id === currentSlide.id);
    if (!currentSlideInSlides) return;

    const prevContent = prevSlideRef.current;

    // Initialize on first render
    if (prevContent === null) {
      prevSlideRef.current = currentSlideInSlides.content;
      return;
    }

    // Check if slide content changed significantly
    if (currentSlideInSlides.content !== prevContent) {
      const contentChangedSignificantly =
        Math.abs(currentSlideInSlides.content.length - prevContent.length) >
          10 ||
        currentSlideInSlides.content.split(' ').length !==
          prevContent.split(' ').length;

      if (contentChangedSignificantly) {
        // Clear errors and trigger spell check
        setSpellCheckErrors((prev) => {
          const next = new Map(prev);
          next.delete(note.id);
          return next;
        });
        debouncedSpellCheck(note.content);
      }

      // Always update ref to track current state
      prevSlideRef.current = currentSlideInSlides.content;
    }
  }, [
    slides,
    currentSlide,
    note.id,
    note.content,
    debouncedSpellCheck,
    setSpellCheckErrors,
  ]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setNotes((currentNotes) =>
      updateNote(currentNotes, note.id, { content: newContent })
    );
  };

  const handleDelete = () => {
    setNotes((currentNotes) => removeNote(currentNotes, note.id));
  };

  const onReplace = (oldWord: string, newWord: string) => {
    handleReplace({
      noteId: note.id,
      noteContent: note.content,
      oldWord,
      newWord,
      setNotes,
      setSpellCheckErrors,
    });
  };

  const onIgnore = (word: string) => {
    handleIgnore({
      noteId: note.id,
      word,
      setIgnoredWords,
      setSpellCheckErrors,
    });
  };

  const handleAcceptAll = () => {
    // Apply first suggestion for each visible (non-ignored) error
    visibleErrors.forEach((error) => {
      const suggestion = error.suggestions[0];
      if (suggestion) {
        replaceWord({
          noteId: note.id,
          noteContent: note.content,
          oldWord: error.word,
          newWord: suggestion,
          setNotes,
          setSpellCheckErrors,
        });
      }
    });
  };

  // Filter out ignored words from displayed errors
  const visibleErrors = noteErrors.filter(
    (error) => !ignoredWords.has(error.word.toLowerCase())
  );

  // Get rejected suggestions for this note
  const noteRejectedSuggestions =
    rejectedSuggestions.get(note.id) || new Map<string, Set<string>>();

  return (
    <div className="border border-gray-200/50 rounded-md p-3 bg-white">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400">
            Note {note.order + 1}
          </span>
          <SpellCheckIndicator status={note.spellCheckStatus} />
        </div>
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-gray-600 text-xs font-normal transition-colors"
        >
          Delete
        </button>
      </div>
      <textarea
        value={note.content}
        onChange={handleContentChange}
        spellCheck={false}
        placeholder="Enter speaker note..."
        className="w-full min-h-[100px] p-2.5 border border-gray-200/50 rounded-md resize-y focus:outline-none focus:border-gray-300 bg-white text-sm leading-relaxed"
      />
      {visibleErrors.length > 0 && (
        <SpellCheckRecommendations
          errors={visibleErrors}
          rejectedSuggestions={noteRejectedSuggestions}
          onReplace={onReplace}
          onReject={(word, suggestion) => {
            setRejectedSuggestions((prev) => {
              const next = new Map(prev);
              const noteRejections =
                next.get(note.id) || new Map<string, Set<string>>();
              const wordRejections =
                noteRejections.get(word) || new Set<string>();
              wordRejections.add(suggestion);
              noteRejections.set(word, wordRejections);
              next.set(note.id, noteRejections);
              return next;
            });
          }}
          onIgnore={onIgnore}
          onAcceptAll={handleAcceptAll}
        />
      )}
    </div>
  );
};
