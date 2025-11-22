import { AddNoteButton } from './AddNoteButton';
import { SpeakerNoteCard } from './SpeakerNoteCard';
import { useAtom, useAtomValue } from 'jotai';

import { currentSlideIdAtom } from '@/atoms/currentSlide/currentSlide';
import {
  currentSlideNotesAtom,
  speakerNotesAtom,
} from '@/atoms/speakerNotes/speakerNotes';
import type { SpeakerNote } from '@/atoms/speakerNotes/speakerNotes.types';

const createNewNote = (slideId: string, order: number): SpeakerNote => ({
  id: crypto.randomUUID(),
  slideId,
  content: '',
  order,
  spellCheckStatus: 'idle',
});

export const SpeakerNotes = () => {
  const [notes, setNotes] = useAtom(speakerNotesAtom);
  const currentSlideId = useAtomValue(currentSlideIdAtom);
  const currentNotes = useAtomValue(currentSlideNotesAtom);

  const handleAddNote = () => {
    if (!currentSlideId) return;
    const newOrder = currentNotes.length;
    const newNote = createNewNote(currentSlideId, newOrder);
    setNotes([...notes, newNote]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-200/50">
        <AddNoteButton onClick={handleAddNote} />
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {currentNotes.length === 0 ? (
          <div className="text-center text-gray-400 text-xs py-8">
            No speaker notes yet.
            <br /> Click "Add Note" to create one.
          </div>
        ) : (
          currentNotes.map((note) => (
            <SpeakerNoteCard key={note.id} note={note} />
          ))
        )}
      </div>
    </div>
  );
};
