import GoogleLoginButton from '@/components/ui/GoogleLoginButton';

const page = () => {
  return (
    <div className="card items-center bg-secondary w-1/2  px-4 py-6 rounded-lg shadow-lg shadow-accent text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <h1 className="font-bold text-3xl text-center mb-10">
        SIGUE AL DASHBOARD
      </h1>
      <div className="flex flex-col justify-center mx-50">
        <GoogleLoginButton />
      </div>
    </div>
  );
};

export default page;
