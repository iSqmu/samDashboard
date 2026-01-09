import { TbBrandGithub } from 'react-icons/tb';

const Footer = () => {
  return (
    <div className="flex justify-center bg-accent text-primary py-4 px-2">
      <a
        href="https://github.com/iSqmu/samDashboard"
        className="flex justify-center place-items-center text-2xl font-bold"
      >
        <TbBrandGithub /> Repositorio
      </a>
    </div>
  );
};

export default Footer;
