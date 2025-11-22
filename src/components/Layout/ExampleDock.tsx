import clsx from 'clsx';
import { useAtom } from 'jotai';

import { currentSlideIdAtom } from '@/atoms/currentSlide/currentSlide';
import { slidesAtom } from '@/atoms/slides/slides';
import type { Slide } from '@/atoms/slides/slides.types';

interface ExampleSlide {
  id: string;
  number: string;
  title: string;
  content: string;
}

// Sample slides based on test cases from spell checker
const exampleSlides: ExampleSlide[] = [
  {
    id: 'example-1',
    number: '1',
    title: 'Blood Analysis Results',
    content: `The patient's hemoglobin levels were measured at 14.2 g/dL.
We need to monitor hematocrit and check for any signs of anemia.`,
  },
  {
    id: 'example-2',
    number: '2',
    title: 'Respiratory Assessment',
    content: `Patient presents with dyspnea and tachypnea.
We'll need to perform auscultation and check oxygen saturation.`,
  },
  {
    id: 'example-3',
    number: '3',
    title: 'Financial Statements Q3',
    content: `We need to calculate amortization for the new equipment.
The depreciation schedule shows a 5-year straight-line method.`,
  },
  {
    id: 'example-4',
    number: '4',
    title: 'Accrual Accounting Principles',
    content: `We use accrual basis accounting. All revenue is recognized
when earned, not when cash is received. Accounts receivable must be tracked.`,
  },
  {
    id: 'example-5',
    number: '5',
    title: 'Portfolio Liquidity Analysis',
    content: `Our portfolio has strong liquidity ratios. We maintain
adequate cash reserves and monitor our leverage carefully.`,
  },
  {
    id: 'example-6',
    number: '6',
    title: 'Derivatives Trading Strategy',
    content: `We use derivatives to hedge against market volatility.
Our options portfolio includes calls and puts with various strike prices.`,
  },
  {
    id: 'example-7',
    number: '7',
    title: 'Quality Control Specifications',
    content: `The parts must meet tight tolerances. We use calipers
to measure dimensions and ensure all components are within spec.`,
  },
  {
    id: 'example-8',
    number: '8',
    title: 'CNC Machining Process',
    content: `Our CNC machines use G-code programming. We've reduced
cycle time by 20% through optimization of feed rates and spindle speeds.`,
  },
  {
    id: 'example-9',
    number: '9',
    title: 'Customer Segmentation Strategy',
    content: `We've identified three key segments: millennials, Gen Z,
and baby boomers. Our personas help us target each demographic effectively.`,
  },
  {
    id: 'example-10',
    number: '10',
    title: 'Digital Marketing Performance',
    content: `Our ROI has improved by 35%. The CTR on our email campaigns
is 4.2%, and our conversion rate optimization efforts are paying off.`,
  },
];

const updateSlide = (
  slides: Slide[],
  slideId: string,
  updates: Partial<Slide>
): Slide[] => {
  return slides.map((slide) =>
    slide.id === slideId ? { ...slide, ...updates } : slide
  );
};

const createNewSlide = (order: number): Slide => ({
  id: crypto.randomUUID(),
  title: '',
  content: '',
  order,
});

export const ExampleDock = () => {
  const [slides, setSlides] = useAtom(slidesAtom);
  const [currentSlideId, setCurrentSlideId] = useAtom(currentSlideIdAtom);

  const handleExampleClick = (example: ExampleSlide) => {
    let targetSlideId = currentSlideId;

    // If there are no slides or no current slide, create a new one
    if (slides.length === 0 || !currentSlideId) {
      const newOrder = slides.length;
      const newSlide = createNewSlide(newOrder);
      setSlides((currentSlides) => [...currentSlides, newSlide]);
      setCurrentSlideId(newSlide.id);
      targetSlideId = newSlide.id;
    }

    if (!targetSlideId) return;

    // Update current slide content
    setSlides((currentSlides) =>
      updateSlide(currentSlides, targetSlideId, {
        title: example.title,
        content: example.content,
      })
    );
  };

  return (
    <div className="w-full bg-gray-100/80 backdrop-blur-md border-t border-gray-200/50 px-4 py-3">
      <div className="text-xs font-medium text-gray-500 mb-2 px-2">Example</div>
      <div className="flex items-end justify-start gap-3">
        {exampleSlides.map((example) => (
          <button
            key={example.id}
            onClick={() => handleExampleClick(example)}
            className={clsx(
              'flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all',
              'hover:bg-white/60 hover:scale-110',
              'active:scale-95'
            )}
          >
            <div className="bg-white border border-gray-300 rounded overflow-hidden aspect-[16/9] w-16 shadow-sm relative">
              <div className="h-full flex items-center justify-center bg-white">
                <div className="text-lg font-semibold text-gray-700 cursor-pointer">
                  {example.number}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
