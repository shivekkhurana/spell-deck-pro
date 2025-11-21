import type { Slide } from '@/atoms/slides/slides.types';

export const buildSpellCheckContext = (
  coverPage: Slide | null,
  currentSlide: Slide | null
): string => {
  const parts: string[] = [];

  if (coverPage) {
    if (coverPage.title) {
      parts.push(`Cover Page Title: ${coverPage.title}`);
    }
    if (coverPage.content) {
      const textContent = coverPage.content.trim();
      if (textContent) {
        parts.push(`Cover Page Content: ${textContent}`);
      }
    }
  }

  if (currentSlide) {
    if (currentSlide.title) {
      parts.push(`Current Slide Title: ${currentSlide.title}`);
    }
    if (currentSlide.content) {
      const textContent = currentSlide.content.trim();
      if (textContent) {
        parts.push(`Current Slide Content: ${textContent}`);
      }
    }
  }

  return parts.join('\n\n');
};
