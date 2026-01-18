import { IoLockClosed } from 'react-icons/io5';

const Calendar = () => {
  return (
    <div className="content justify-center items-center h-full hidden lg:flex overflow-hidden">
      <div className="overflow-hidden w-1/2 h-auto mx-auto relative flex justify-center items-center rounded-lg">
        <img
          src="/calendarExample.jpg"
          alt="Example Calendar"
          className="h-full w-full mx-auto rounded-lg shadow-lg"
        />
        <div className="overlay absolute top-0 left-0 w-full h-full bg-dark backdrop-blur-md opacity-70 flex flex-col justify-center items-center">
          <IoLockClosed className="text-6xl text-white" />
          <p className="text-white mt-2">Proximamente...</p>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
