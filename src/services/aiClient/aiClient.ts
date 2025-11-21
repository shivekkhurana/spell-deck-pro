import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';

import type { SpellCheckResult } from '@/services/aiClient/aiClient.types';

const getApiKey = (): string => {
  return import.meta.env.ANTHROPIC_API_KEY || '';
};

const getModel = (): string => {
  return import.meta.env.SPELL_CHECK_MODEL || 'claude-3-haiku-20240307';
};

export const checkSpelling = async (
  context: string,
  text: string
): Promise<SpellCheckResult> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('API key not configured');
  }

  const prompt = `You are a spell checker for presentation speaker notes.
Context:
${context}

Text to check:
${text}

Analyze the text for spelling errors. Consider the context provided (cover page and current slide content) to understand domain-specific terms and proper nouns.

Return a JSON object with this structure:
{
  "isCorrect": boolean,
  "errors": [
    {
      "word": "misspelled_word",
      "suggestions": ["suggestion1", "suggestion2"],
      "context": "optional context about why this might be an error"
    }
  ]
}

If there are no errors, return {"isCorrect": true, "errors": []}.`;

  try {
    const { text: responseText } = await generateText({
      model: anthropic(getModel()),
      prompt,
      temperature: 0.3,
    });

    const result = JSON.parse(responseText) as SpellCheckResult;
    return result;
  } catch (error) {
    console.error('Spell check error:', error);
    throw error;
  }
};
