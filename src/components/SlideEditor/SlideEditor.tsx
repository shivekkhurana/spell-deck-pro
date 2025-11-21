import { useAtom, useAtomValue } from 'jotai';

import { currentSlideAtom } from '@/atoms/currentSlide/currentSlide';
import { slidesAtom } from '@/atoms/slides/slides';
import type { Slide } from '@/atoms/slides/slides.types';

const updateSlide = (
  slides: Slide[],
  slideId: string,
  updates: Partial<Slide>
): Slide[] => {
  return slides.map((slide) =>
    slide.id === slideId ? { ...slide, ...updates } : slide
  );
};

export const SlideEditor = () => {
  const [, setSlides] = useAtom(slidesAtom);
  const currentSlide = useAtomValue(currentSlideAtom);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!currentSlide) return;
    setSlides((currentSlides) =>
      updateSlide(currentSlides, currentSlide.id, { content: e.target.value })
    );
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentSlide) return;
    setSlides((currentSlides) =>
      updateSlide(currentSlides, currentSlide.id, { title: e.target.value })
    );
  };

  if (!currentSlide) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No slide selected
      </div>
    );
  }

  return (
    <div className="flex p-8">
      <div className="w-full aspect-[16/9] bg-white border rounded border-gray-300 p-6 flex flex-col">
        <div className="mb-6">
          <input
            type="text"
            value={currentSlide.title || ''}
            onChange={handleTitleChange}
            placeholder="Untitled"
            className="w-full text-4xl font-semibold border-none outline-none bg-transparent text-gray-900 placeholder-gray-300"
          />
        </div>
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <textarea
            value={currentSlide.content}
            onChange={handleContentChange}
            placeholder="Start typing..."
            className="w-full h-full p-0 border-none outline-none bg-transparent resize-none text-base leading-relaxed text-gray-700 placeholder-gray-400 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          />
        </div>
      </div>
    </div>
  );
};
