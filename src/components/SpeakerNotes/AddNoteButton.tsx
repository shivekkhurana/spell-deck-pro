interface AddNoteButtonProps {
  onClick: () => void;
}

export const AddNoteButton = ({ onClick }: AddNoteButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full px-3 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 border border-gray-200/50 transition-colors font-normal text-sm"
    >
      + Add Note
    </button>
  );
};
