import { Metadata } from 'next';
import HighTasks from '@/components/dashboard/HighTasks';
import RecentTasksCompleted from '@/components/dashboard/RecentTasksCompleted';
import TodayTasks from '@/components/dashboard/TodayTasks';
import Calendar from '@/components/dashboard/Calendar';
export const metadata: Metadata = {
  title: 'Dashboard',
};

const page = () => {
  return (
    <div className="content h-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 md:h-1/3 z-10 relative">
        <HighTasks />
        <RecentTasksCompleted />
        <TodayTasks />
      </div>
      <div className="lg:h-2/3 w-full -z-50 relative">
        <Calendar />
      </div>
    </div>
  );
};

export default page;
