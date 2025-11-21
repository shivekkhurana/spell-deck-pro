import { useAtomValue, useSetAtom } from 'jotai';
import clsx from 'clsx';

import { currentSlideIdAtom } from '@/atoms/currentSlide/currentSlide';
import type { Slide } from '@/atoms/slides/slides.types';

interface SlideThumbnailProps {
  slide: Slide;
  index: number;
}

export const SlideThumbnail = ({ slide, index }: SlideThumbnailProps) => {
  const currentSlideId = useAtomValue(currentSlideIdAtom);
  const setCurrentSlideId = useSetAtom(currentSlideIdAtom);
  const isActive = currentSlideId === slide.id;

  const handleClick = () => {
    setCurrentSlideId(slide.id);
  };

  const contentPreview = slide.content.trim();
  const titlePreview = slide.title?.trim() || 'Untitled';

  return (
    <button
      onClick={handleClick}
      className={clsx(
        'w-full p-2.5 text-left transition-all border-l-2',
        isActive
          ? 'bg-gray-200 border-gray-600'
          : 'hover:bg-gray-50/50 border-transparent'
      )}
    >
      <div
        className={clsx(
          'bg-white border rounded overflow-hidden aspect-[16/9] p-3 shadow-sm relative',
          isActive ? 'border-gray-500 shadow-lg' : 'border-gray-300'
        )}
      >
        <div className="h-full flex flex-col bg-white">
          {titlePreview && (
            <div className="text-xs font-semibold text-gray-900 mb-1.5 line-clamp-1">
              {titlePreview}
            </div>
          )}
          {contentPreview ? (
            <div className="text-[10px] text-gray-600 leading-relaxed line-clamp-4 flex-1">
              {contentPreview}
            </div>
          ) : (
            <div className="text-[10px] text-gray-400 italic flex-1 flex items-center">
              Start typing...
            </div>
          )}
        </div>
        <div className="absolute bottom-2 right-2">
          <div className="bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-medium text-white">
            {index + 1}
          </div>
        </div>
      </div>
    </button>
  );
};
