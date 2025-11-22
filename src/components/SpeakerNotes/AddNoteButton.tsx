import clsx from 'clsx';

interface AddNoteButtonProps {
  onClick: () => void;
}

export const AddNoteButton = ({ onClick }: AddNoteButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        // Layout
        'w-full',
        // Spacing
        'px-3 py-2',
        // Colors
        'bg-white text-gray-700',
        // Border
        'border border-gray-200/50 rounded-md',
        // Hover
        'hover:bg-gray-100',
        // Transitions
        'transition-colors',
        // Typography
        'font-normal text-sm',
        // Cursor
        'cursor-pointer'
      )}
    >
      + Add Note
    </button>
  );
};
