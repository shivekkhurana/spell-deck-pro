import { describe, expect, it } from 'vitest';

import { hasErrors } from '@/services/spellCheckService/browserSpellChecker';

describe('browserSpellChecker hasErrors', () => {
  it('should return false for empty string', async () => {
    const result = await hasErrors('');
    expect(result).toBe(false);
  });

  it('should return false for whitespace-only string', async () => {
    const result = await hasErrors('   \n\t  ');
    expect(result).toBe(false);
  });

  it('should return false for correctly spelled text', async () => {
    const result = await hasErrors('the quick brown fox');
    expect(result).toBe(false);
  });

  it('should return true for text with misspellings', async () => {
    const result = await hasErrors('the quick brown fox og kjkj mispeling');
    expect(result).toBe(true);
  });

  it('should handle special characters correctly', async () => {
    const result = await hasErrors('the quick, brown fox!');
    expect(result).toBe(false);
  });

  it('should handle case sensitivity', async () => {
    const result = await hasErrors('The Quick Brown Fox');
    expect(result).toBe(false);
  });

  it('should return true when any word is misspelled', async () => {
    const result = await hasErrors('the quick brown xyzabc123 fox');
    expect(result).toBe(true);
  });
});
