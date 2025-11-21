import { SlideMiniMap } from '@/components/SlideMiniMap/SlideMiniMap';

export const LeftSidebar = () => {
  return (
    <div className="w-64 border-r border-gray-200/50 bg-gray-50/30 flex flex-col">
      <SlideMiniMap />
    </div>
  );
};
