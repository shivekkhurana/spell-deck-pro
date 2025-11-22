import { ExampleDock } from './ExampleDock';

import { SlideEditor } from '@/components/SlideEditor/SlideEditor';

export const CenterPanel = () => {
  return (
    <div className="flex-1 flex flex-col justify-between overflow-hidden bg-gray-50">
      <SlideEditor />
      <ExampleDock />
    </div>
  );
};
