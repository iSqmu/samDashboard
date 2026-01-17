import Sidebar from '@/components/ui/Sidebar';
import React from 'react';
const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="flex overflow-y-hidden w-full">
      <Sidebar />
      <div className=" flex-1 w-full h-screen">{children}</div>
    </div>
  );
};

export default layout;
