import { useAtomValue } from 'jotai';

import { slidesAtom } from '@/atoms/slides/slides';
import { CenterPanel } from '@/components/Layout/CenterPanel';
import { LeftSidebar } from '@/components/Layout/LeftSidebar';
import { RightSidebar } from '@/components/Layout/RightSidebar';
import { TopBar } from '@/components/Layout/TopBar';

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
