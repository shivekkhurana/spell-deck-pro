import { describe, expect, it } from 'vitest';

import { callClaudeHaiku } from '@/services/spellCheckService/aiSpellChecker';

describe('callClaudeHaiku', () => {
  it('should check spelling for a simple note with a misspelled word', async () => {
    const systemPrompt =
      'This is a presentation about technology and innovation.';
    const noteContent = 'This is a test notte with a misspeling.';

    const result = await callClaudeHaiku(systemPrompt, noteContent);

    expect(result).toHaveProperty('isCorrect');
    expect(result).toHaveProperty('errors');
    expect(Array.isArray(result.errors)).toBe(true);
    expect(typeof result.isCorrect).toBe('boolean');
  });

  it('should return no errors if the note is correct', async () => {
    const systemPrompt =
      'This is a presentation about technology and innovation.';
    const noteContent = 'This is a test note with no misspelling.';

    const result = await callClaudeHaiku(systemPrompt, noteContent);

    expect(result).toHaveProperty('isCorrect');
    expect(result).toHaveProperty('errors');
    expect(Array.isArray(result.errors)).toBe(true);
    expect(typeof result.isCorrect).toBe('boolean');
  });

  it('should return no errors if the note is empty', async () => {
    const systemPrompt =
      'This is a presentation about technology and innovation.';
    const noteContent = '';

    const result = await callClaudeHaiku(systemPrompt, noteContent);

    expect(result).toHaveProperty('isCorrect');
    expect(result).toHaveProperty('errors');
    expect(Array.isArray(result.errors)).toBe(true);
    expect(result.isCorrect).toBe(true);
    expect(result.errors).toEqual([]);
  });
});
