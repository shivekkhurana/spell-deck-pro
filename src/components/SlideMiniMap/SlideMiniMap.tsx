import clsx from 'clsx';
import { useAtom, useSetAtom } from 'jotai';

import { currentSlideIdAtom } from '@/atoms/currentSlide/currentSlide';
import { slidesAtom } from '@/atoms/slides/slides';
import type { Slide } from '@/atoms/slides/slides.types';
import { SlideThumbnail } from '@/components/SlideMiniMap/SlideThumbnail';

const createNewSlide = (order: number): Slide => ({
  id: crypto.randomUUID(),
  title: '',
  content: '',
  order,
});

export const SlideMiniMap = () => {
  const [slides, setSlides] = useAtom(slidesAtom);
  const setCurrentSlideId = useSetAtom(currentSlideIdAtom);

  const handleAddSlide = () => {
    const newOrder = slides.length;
    const newSlide = createNewSlide(newOrder);
    const updatedSlides = [...slides, newSlide];
    setSlides(updatedSlides);
    setCurrentSlideId(newSlide.id);
  };

  const sortedSlides = [...slides].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-200/50">
        <button
          onClick={handleAddSlide}
          className={clsx(
            // Layout
            'w-full',
            // Spacing
            'px-3 py-2',
            // Colors
            'bg-white text-gray-700',
            // Border
            'border border-gray-200/50 rounded-md',
            // Hover
            'hover:bg-gray-100',
            // Transitions
            'transition-colors',
            // Typography
            'font-normal text-sm',
            // Cursor
            'cursor-pointer'
          )}
        >
          + Add Slide
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {sortedSlides.map((slide, index) => (
          <SlideThumbnail key={slide.id} slide={slide} index={index} />
        ))}
      </div>
    </div>
  );
};
