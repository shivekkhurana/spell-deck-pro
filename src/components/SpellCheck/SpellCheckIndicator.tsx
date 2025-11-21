import clsx from 'clsx';

import type { SpellCheckIndicatorProps } from './SpellCheck.types';

const getStatusColor = (
  status?: 'pending' | 'checking' | 'checked' | 'error'
): string => {
  switch (status) {
    case 'checking':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'checked':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'error':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'pending':
    default:
      return 'bg-gray-50 text-gray-500 border-gray-200';
  }
};

const getStatusText = (
  status?: 'pending' | 'checking' | 'checked' | 'error'
): string => {
  switch (status) {
    case 'checking':
      return 'Checking...';
    case 'checked':
      return 'Checked';
    case 'error':
      return 'Error';
    case 'pending':
    default:
      return 'Pending';
  }
};

export const SpellCheckIndicator = ({
  status = 'pending',
}: SpellCheckIndicatorProps) => {
  return (
    <span
      className={clsx(
        'px-1.5 py-0.5 text-xs font-normal rounded border',
        getStatusColor(status)
      )}
    >
      {getStatusText(status)}
    </span>
  );
};
