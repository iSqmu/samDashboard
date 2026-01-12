import Sidebar from '@/components/ui/Sidebar';
import React from 'react';
const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <Sidebar />
      <div>{children}</div>
    </>
  );
};

export default layout;
