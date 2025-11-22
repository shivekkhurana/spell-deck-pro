import clsx from 'clsx';

export const TopBar = () => {
  return (
    <div
      className={clsx(
        'h-12 border-b border-gray-200/50 bg-white flex items-center px-4'
      )}
    >
      <div className="flex items-center gap-2">
        <div
          className={clsx(
            'w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded flex items-center justify-center'
          )}
        >
          <span className="text-white text-xs font-bold">SD</span>
        </div>
        <span className="text-sm font-semibold text-gray-900">
          Spell Deck Pro - Pitch Test
        </span>
      </div>
    </div>
  );
};
