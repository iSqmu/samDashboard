import { Metadata } from 'next';
import Calendar from '@/components/dashboard/Calendar';
export const metadata: Metadata = {
  title: 'Dashboard',
};

const page = () => {
  return (
    <div className="content h-screen overflow-y-auto">
      <Calendar />
    </div>
  );
};

export default page;
