import type { SpellCheckIndicatorProps } from './SpellCheck.types';
import clsx from 'clsx';

const getStatusText = (
  status?: 'idle' | 'checking' | 'checked' | 'error'
): string => {
  switch (status) {
    case 'checked':
      return '✅';
    case 'error':
      return '❌';
    case 'checking':
      return '⌛';
    case 'idle':
    default:
      return '';
  }
};

export const SpellCheckIndicator = ({
  status = 'idle',
}: SpellCheckIndicatorProps) => {
  return (
    <span className={clsx('px-1.5 py-0.5 text-xs font-normal')}>
      {getStatusText(status)}
    </span>
  );
};
