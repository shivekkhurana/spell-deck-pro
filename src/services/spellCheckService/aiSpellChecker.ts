import { createAnthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';

export interface AISpellCheckResult {
  isCorrect: boolean;
  errors: Array<{
    word: string; // Misspelled word
    suggestions: string[]; // AI suggestions
    context?: string; // Why this might be an error
    position?: number; // Optional position if provided
  }>;
}

const getApiKey = (): string => {
  return import.meta.env.VITE_ANTHROPIC_API_KEY || '';
};

const getModel = (): string => {
  return import.meta.env.VITE_SPELL_CHECK_MODEL || 'claude-3-haiku-20240307';
};

/**
 * Call Claude Haiku for context-aware spell checking
 * @param systemPrompt - Context-aware system prompt (built from slide context)
 * @param noteContent - The note content to check
 * @returns Promise with AI spell check results
 */
export const callClaudeHaiku = async (
  systemPrompt: string,
  noteContent: string
): Promise<AISpellCheckResult> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('API key not configured');
  }

  const prompt = `You are a context-aware spell checker for presentation speaker notes.

${systemPrompt}

Please review the following note content and provide intelligent corrections considering the context above.

Text to check:
<note-content>
${noteContent}
</note-content>

Analyze the text for spelling errors. Consider the context provided (cover page and current slide content) to understand domain-specific terms, proper nouns, and technical jargon that may be correct in this context.

Return a JSON object with this structure:
{
  "isCorrect": boolean,
  "errors": [
    {
      "word": "misspelled_word",
      "suggestions": ["suggestion1", "suggestion2"]
    }
  ]
}

If there are no errors, return {"isCorrect": true, "errors": []}.

If the note content is empty, return {"isCorrect": true, "errors": []}.

Important: Only flag words that are actually misspelled. If a word is domain-specific jargon that appears in the context, it should NOT be flagged as an error.

Only return a JSON object. Do not return any other text or comments.
`;

  try {
    const anthropicProvider = createAnthropic({ apiKey });
    const { text: responseText } = await generateText({
      model: anthropicProvider(getModel()),
      prompt,
      temperature: 0.3,
    });

    console.log('responseText', responseText);

    // Try to extract JSON from the response (Claude might wrap it in markdown)
    let jsonText = responseText.trim();

    // Remove markdown code blocks if present
    if (jsonText.startsWith('```')) {
      const lines = jsonText.split('\n');
      const startIndex = lines[0].includes('json') ? 1 : 0;
      const endIndex =
        lines[lines.length - 1] === '```' ? lines.length - 1 : lines.length;
      jsonText = lines.slice(startIndex, endIndex).join('\n');
    }

    const result = JSON.parse(jsonText) as AISpellCheckResult;

    // Validate result structure
    if (typeof result.isCorrect !== 'boolean') {
      throw new Error('Invalid response: isCorrect must be boolean');
    }

    if (!Array.isArray(result.errors)) {
      throw new Error('Invalid response: errors must be an array');
    }

    console.log('result', result);

    return result;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error('Failed to parse Claude response as JSON:', error);
      throw new Error('Failed to parse spell check response');
    }
    console.error('Spell check error:', error);
    throw error;
  }
};
