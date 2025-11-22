import { callClaudeHaiku } from '@/services/spellCheckService/aiSpellChecker';
import { hasErrors } from '@/services/spellCheckService/browserSpellChecker';

export interface ContextAwareSpellCheckResult {
  stage: 'browser' | 'ai' | 'none';
  hasErrors: boolean;
  errors: Array<{
    word: string;
    suggestions: string[];
    context?: string;
    position?: number;
  }>;
}

/**
 * Orchestrate the two-stage spell checking process
 * @param systemPrompt - Context-aware system prompt
 * @param noteContent - The note content to check
 * @returns Promise with unified spell check results
 */
export const contextAwareSpellCheck = async (
  systemPrompt: string,
  noteContent: string
): Promise<ContextAwareSpellCheckResult> => {
  // Stage 1: Run browser spell check
  if (!(await hasErrors(noteContent))) {
    // If no errors found by browser spell check, return early (no AI call needed)
    return {
      stage: 'browser',
      hasErrors: false,
      errors: [],
    };
  }

  // Stage 2: Call Claude Haiku for context-aware checking
  try {
    const aiResult = await callClaudeHaiku(systemPrompt, noteContent);

    // Convert AI result to unified format
    const errors = aiResult.errors.map((error) => ({
      word: error.word,
      suggestions: error.suggestions,
      context: error.context,
      position: error.position,
    }));

    return {
      stage: 'ai',
      hasErrors: !aiResult.isCorrect,
      errors,
    };
  } catch (error) {
    // If AI check fails, return browser spell check results as fallback
    console.error(
      'AI spell check failed, returning browser spell check results:',
      error
    );

    // Browser spell checker only returns boolean, so return empty errors array
    return {
      stage: 'browser',
      hasErrors: false,
      errors: [],
    };
  }
};
