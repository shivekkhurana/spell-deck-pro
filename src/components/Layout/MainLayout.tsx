import { CenterPanel } from './CenterPanel';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { TopBar } from './TopBar';
import { useAtomValue } from 'jotai';

import { slidesAtom } from '@/atoms/slides/slides';

export const MainLayout = () => {
  const slides = useAtomValue(slidesAtom);
  const hasSlides = slides.length > 0;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <CenterPanel />
        {hasSlides && <RightSidebar />}
      </div>
    </div>
  );
};
