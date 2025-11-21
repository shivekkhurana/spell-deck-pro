import { CenterPanel } from './CenterPanel';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';

export const MainLayout = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      <LeftSidebar />
      <CenterPanel />
      <RightSidebar />
    </div>
  );
};
