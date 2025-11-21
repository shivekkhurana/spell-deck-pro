import { useEffect } from 'react';
import { useAtom } from 'jotai';

import { currentSlideIdAtom } from '@/atoms/currentSlide/currentSlide';
import { slidesAtom } from '@/atoms/slides/slides';
import type { Slide } from '@/atoms/slides/slides.types';

import { SlideThumbnail } from './SlideThumbnail';

const createNewSlide = (order: number): Slide => ({
  id: crypto.randomUUID(),
  title: '',
  content: '',
  order,
});

export const SlideMiniMap = () => {
  const [slides, setSlides] = useAtom(slidesAtom);
  const [, setCurrentSlideId] = useAtom(currentSlideIdAtom);

  // Initialize with a cover slide if no slides exist
  useEffect(() => {
    if (slides.length === 0) {
      const coverSlide = createNewSlide(0);
      setSlides([coverSlide]);
      setCurrentSlideId(coverSlide.id);
    }
  }, [slides.length, setSlides, setCurrentSlideId]);

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
          className="w-full px-3 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 border border-gray-200/50 transition-colors font-normal text-sm"
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
