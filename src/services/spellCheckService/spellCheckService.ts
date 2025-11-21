import type { Slide } from '@/atoms/slides/slides.types';
import { checkSpelling } from '@/services/aiClient/aiClient';
import { buildSpellCheckContext } from '@/utils/contextBuilder';

export interface SpellCheckParams {
  noteContent: string;
  coverPage: Slide | null;
  currentSlide: Slide | null;
}

export const performSpellCheck = async (
  params: SpellCheckParams
): Promise<{ isCorrect: boolean; errors: unknown[] }> => {
  const context = buildSpellCheckContext(params.coverPage, params.currentSlide);
  const result = await checkSpelling(context, params.noteContent);
  return result;
};
