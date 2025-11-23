import clsx from 'clsx';

import type { SpellCheckIndicatorProps } from '@/components/SpellCheck/SpellCheck.types';

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
