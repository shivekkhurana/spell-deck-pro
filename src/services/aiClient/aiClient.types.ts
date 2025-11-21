export interface SpellCheckResult {
  errors: Array<{
    word: string;
    suggestions: string[];
    context?: string;
  }>;
  isCorrect: boolean;
}
