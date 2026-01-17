import GoogleLoginButton from '@/components/ui/GoogleLoginButton';
import Image from 'next/image';
export const metadata = {
  title: 'Login',
};

const page = () => {
  return (
    <div>
      <div className="card absolute bg-light gap-5 text-dark top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-10 py-5 rounded-lg  flex flex-col items-center justify-center">
        <h2 className="text-tertiary">SamDashboard</h2>
        <h1 className="text-2xl font-bold text-center ">
          Continúa con google para ir al{' '}
          <span className="text-tertiary">dashboard</span>.
        </h1>
        <GoogleLoginButton />
      </div>
      <Image src={'/bg.jpg'} alt="asd" fill className="-z-50" />
    </div>
  );
};

export default page;
