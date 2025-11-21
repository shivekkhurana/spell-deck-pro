import { SlideEditor } from '@/components/SlideEditor/SlideEditor';

export const CenterPanel = () => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      <SlideEditor />
    </div>
  );
};
