import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';

import {
  coverPageAtom,
  currentSlideAtom,
} from '@/atoms/currentSlide/currentSlide';
import { speakerNotesAtom } from '@/atoms/speakerNotes/speakerNotes';
import type { SpeakerNote } from '@/atoms/speakerNotes/speakerNotes.types';
import { SpellCheckIndicator } from '@/components/SpellCheck/SpellCheckIndicator';
import { performSpellCheck } from '@/services/spellCheckService/spellCheckService';
import { debounce, type DebouncedFunction } from '@/utils/debounce';

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

export const SpeakerNoteCard = ({ note }: SpeakerNoteCardProps) => {
  const [, setNotes] = useAtom(speakerNotesAtom);
  const currentSlide = useAtomValue(currentSlideAtom);
  const coverPage = useAtomValue(coverPageAtom);
  const [localContent, setLocalContent] = useState(note.content);
  const debounceRef = useRef<DebouncedFunction<() => Promise<void>> | null>(
    null
  );

  const debounceMs =
    parseInt(import.meta.env.SPELL_CHECK_DEBOUNCE_MS || '2000', 10) || 2000;

  useEffect(() => {
    setLocalContent(note.content);
  }, [note.content]);

  useEffect(() => {
    const handleSpellCheck = async () => {
      if (!currentSlide || !localContent.trim()) {
        setNotes((currentNotes) =>
          updateNote(currentNotes, note.id, { spellCheckStatus: 'pending' })
        );
        return;
      }

      setNotes((currentNotes) =>
        updateNote(currentNotes, note.id, { spellCheckStatus: 'checking' })
      );

      try {
        await performSpellCheck({
          noteContent: localContent,
          coverPage,
          currentSlide,
        });
        setNotes((currentNotes) =>
          updateNote(currentNotes, note.id, { spellCheckStatus: 'checked' })
        );
      } catch (error) {
        console.error('Spell check failed:', error);
        setNotes((currentNotes) =>
          updateNote(currentNotes, note.id, { spellCheckStatus: 'error' })
        );
      }
    };

    if (debounceRef.current) {
      debounceRef.current.cancel();
    }

    debounceRef.current = debounce(handleSpellCheck, debounceMs);
    debounceRef.current();

    return () => {
      if (debounceRef.current) {
        debounceRef.current.cancel();
      }
    };
  }, [localContent, currentSlide, coverPage, note.id, setNotes]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setLocalContent(newContent);
    setNotes((currentNotes) =>
      updateNote(currentNotes, note.id, { content: newContent })
    );
  };

  const handleDelete = () => {
    setNotes((currentNotes) => removeNote(currentNotes, note.id));
  };

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
        value={localContent}
        onChange={handleContentChange}
        placeholder="Enter speaker note..."
        className="w-full min-h-[100px] p-2.5 border border-gray-200/50 rounded-md resize-y focus:outline-none focus:border-gray-300 bg-white text-sm leading-relaxed"
      />
    </div>
  );
};
