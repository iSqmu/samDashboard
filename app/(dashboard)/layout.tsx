import Sidebar from '@/components/ui/Sidebar';
import React from 'react';
const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <Sidebar />
      <div className=" flex-1 w-full h-screen">{children}</div>
    </>
  );
};

export default layout;
