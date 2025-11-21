import { SpeakerNotes } from '@/components/SpeakerNotes/SpeakerNotes';

export const RightSidebar = () => {
  return (
    <div className="w-80 border-l border-gray-200/50 bg-gray-50/30 flex flex-col">
      <SpeakerNotes />
    </div>
  );
};
