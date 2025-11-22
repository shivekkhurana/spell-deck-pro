import type { ContextAwareSpellCheckResult } from '@/services/spellCheckService/contextAwareSpellCheck';

interface SpellCheckRecommendationsProps {
  errors: ContextAwareSpellCheckResult['errors'];
  rejectedSuggestions?: Map<string, Set<string>>;
  onReplace: (oldWord: string, newWord: string) => void;
  onReject?: (word: string, suggestion: string) => void;
  onIgnore: (word: string) => void;
  onAcceptAll: () => void;
}

interface SpellCheckHeaderProps {
  errorCount: number;
  onAcceptAll: () => void;
}

const SpellCheckHeader = ({
  errorCount,
  onAcceptAll,
}: SpellCheckHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">
          {errorCount} {errorCount === 1 ? 'spelling error' : 'spelling errors'}{' '}
          found
        </span>
      </div>
      <button
        onClick={onAcceptAll}
        className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
      >
        Accept All
      </button>
    </div>
  );
};

interface ErrorWordDisplayProps {
  errorWord: string;
}

const ErrorWordDisplay = ({ errorWord }: ErrorWordDisplayProps) => {
  return (
    <span className="text-xs font-medium text-red-600 line-through">
      {errorWord}
    </span>
  );
};

interface ErrorContextProps {
  context: string;
}

const ErrorContext = ({ context }: ErrorContextProps) => {
  return <p className="text-xs text-gray-500 mt-1">{context}</p>;
};

interface ErrorCardProps {
  error: ContextAwareSpellCheckResult['errors'][0];
  rejectedSuggestions: Set<string>;
  onReplace: (oldWord: string, newWord: string) => void;
  onReject: (word: string, suggestion: string) => void;
  onIgnore: (word: string) => void;
}

const ErrorCard = ({
  error,
  rejectedSuggestions,
  onReplace,
  onReject,
  onIgnore,
}: ErrorCardProps) => {
  const visibleSuggestions = error.suggestions.filter(
    (suggestion) => !rejectedSuggestions.has(suggestion)
  );

  return (
    <div className="bg-white border border-gray-200 rounded-md p-3">
      <div className="space-y-1">
        {visibleSuggestions.map((suggestion, idx) => (
          <div key={idx} className="mb-2 w-full">
            <div className="flex flex-col gap-1.5 mt-1.5 w-full">
              <div className="flex items-center gap-1.5">
                {error.word && <ErrorWordDisplay errorWord={error.word} />}
                <span className="text-gray-400 text-xs">→</span>
                {suggestion && (
                  <span className="text-xs font-medium text-emerald-600">
                    {suggestion}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onReplace(error.word, suggestion)}
                  className="px-2 py-1 text-[10px] font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={() => onReject(error.word, suggestion)}
                  className="px-2 py-1 text-[10px] font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => onIgnore(error.word)}
                  className="px-2 py-1 text-[10px] font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                >
                  Ignore
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {error.context && <ErrorContext context={error.context} />}
    </div>
  );
};

interface ErrorListProps {
  errors: ContextAwareSpellCheckResult['errors'];
  rejectedSuggestions: Map<string, Set<string>>;
  onReplace: (oldWord: string, newWord: string) => void;
  onReject: (word: string, suggestion: string) => void;
  onIgnore: (word: string) => void;
}

const ErrorList = ({
  errors,
  rejectedSuggestions,
  onReplace,
  onReject,
  onIgnore,
}: ErrorListProps) => {
  return (
    <div className="space-y-2">
      {errors.map((error, index) => (
        <ErrorCard
          key={`${error.word}-${index}`}
          error={error}
          rejectedSuggestions={rejectedSuggestions.get(error.word) || new Set()}
          onReplace={onReplace}
          onReject={onReject}
          onIgnore={onIgnore}
        />
      ))}
    </div>
  );
};

export const SpellCheckRecommendations = ({
  errors,
  rejectedSuggestions = new Map(),
  onReplace,
  onReject,
  onIgnore,
  onAcceptAll,
}: SpellCheckRecommendationsProps) => {
  if (errors.length === 0) {
    return null;
  }

  const handleReject = (word: string, suggestion: string) => {
    if (onReject) {
      onReject(word, suggestion);
    }
  };

  return (
    <div className="mt-3 border border-gray-200/50 rounded-md bg-gray-50/50 p-3">
      <SpellCheckHeader errorCount={errors.length} onAcceptAll={onAcceptAll} />
      <ErrorList
        errors={errors}
        rejectedSuggestions={rejectedSuggestions}
        onReplace={onReplace}
        onReject={handleReject}
        onIgnore={onIgnore}
      />
    </div>
  );
};
