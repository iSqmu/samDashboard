'use client';

import gsap from 'gsap';
import Link from 'next/link';
import { useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useGSAP } from '@gsap/react';
import { GrFormNextLink } from 'react-icons/gr';
import { FaAngleDown } from 'react-icons/fa';
import {
  RiTailwindCssFill,
  RiReactjsFill,
  RiNextjsFill,
  RiSupabaseLine,
} from 'react-icons/ri';
import { TbBrandFramerMotion, TbBrandTypescript } from 'react-icons/tb';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function Home() {
  const imageRef = useRef<HTMLImageElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const instructRef = useRef<HTMLDivElement>(null);

  const icons = [
    {
      Icon: RiTailwindCssFill,
      label: 'Tailwind CSS',
      url: 'https://tailwindcss.com/',
    },
    { Icon: RiReactjsFill, label: 'React', url: 'https://react.dev/' },
    { Icon: RiNextjsFill, label: 'Next.js', url: 'https://nextjs.org/' },
    { Icon: RiSupabaseLine, label: 'Supabase', url: 'https://supabase.com/' },
    {
      Icon: TbBrandFramerMotion,
      label: 'Framer Motion',
      url: 'https://motion.dev/',
    },
    {
      Icon: TbBrandTypescript,
      label: 'TypeScript',
      url: 'https://www.typescriptlang.org/',
    },
  ];

  useGSAP(() => {
    if (!imageRef.current) return;

    const parallaxTl = gsap.timeline({
      scrollTrigger: {
        trigger: parallaxRef.current,
        start: 'top top',
        end: '110% bottom',
        scrub: true,
        pinSpacing: false,
      },
    });

    parallaxTl
      .fromTo(
        calendarRef.current,
        {
          x: -100,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
        }
      )
      .fromTo(
        panelRef.current,
        {
          x: 100,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
        }
      )
      .fromTo(
        stackRef.current,
        {
          opacity: 0,
          x: -200,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          delay: 0.5,
        }
      );

    gsap.fromTo(
      '.arrow',
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        yoyo: true,
        repeat: -1,
        stagger: 1,
        ease: 'power2.out',
        duration: 0.5,
      }
    );

    gsap.to(instructRef.current, {
      scrollTrigger: {
        trigger: instructRef.current,
        start: '-300% center',
        end: 'bottom center',
        scrub: true,
        pinSpacing: false,
      },
      opacity: 0,
      ease: 'power2.out',
      duration: 2,
    });

    gsap.from(titleRef.current, {
      scrollTrigger: {
        trigger: titleRef.current,
        start: '55% center',
        end: 'bottom center',
        pin: true,
        scrub: 1,
        toggleActions: 'start none none restart',
      },
      opacity: 0,
      ease: 'power2.out',
      duration: 2,
    });

    gsap.to(imageRef.current, {
      scrollTrigger: {
        trigger: imageRef.current,
        start: '100% 35%',
        end: '430% 35%',
        pin: true,
        scrub: true,
        toggleActions: 'restart pause reverse restart',
      },
      keyframes: {
        rotation: [0, 90, 180, 270, 360],
        opacity: [0, 1, 1, 1, 0],
      },
    });
  }, []);

  return (
    <>
      <img
        ref={imageRef}
        src="/asd.svg"
        alt="Imagen animada"
        className="min-w-2xl absolute -top-100 left-1/2 -translate-x-1/2 z-2 max-w-2xl drop-shadow-2xl drop-shadow-accent"
      />
      <div className="content mt-20">
        <h1
          className="text-9xl font-black text-center z-1 pt-50"
          ref={titleRef}
        >
          BIENVENIDO A MI DASHBOARD
        </h1>
        <div
          ref={instructRef}
          className="mark flex flex-col items-center justify-center absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          Haz scroll para ver más
          <FaAngleDown className="arrow text-4xl" />
        </div>
        <div className="section1 bg-linear-to-t from-accent to-dark h-100 flex flex-col justify-center items-center">
          <h2 className="text-2xl font-black ">Implementación con la IA</h2>
          <p>
            Asistencia para la asignación de nombres, descripciones, fechas a
            trabajos, compromisos o cosas que se quieran hacer a futuro para una
            mayor facilidad.
          </p>
        </div>
        <div ref={parallaxRef} className="paralax">
          <div
            ref={calendarRef}
            className="section2 bg-linear-to-b from-accent to-tertiary h-svh flex flex-col justify-center items-center"
          >
            <h2 className="text-2xl font-black ">
              Conexión con Google Calendar
            </h2>
            <p>
              Integración con Google Calendar para manejo de tiempos y
              recordatorios de trabajos o actividades pendientes, te queremos
              ayudar usando herramientas que ya conoces.
            </p>
          </div>
          <div
            ref={panelRef}
            className="section3 bg-linear-to-b from-tertiary to-dark h-svh flex flex-col justify-center items-center"
          >
            <h2 className="text-2xl font-black ">Panel de control</h2>
            <p>
              Te ofrecemos un panel de control donde podrás acceder a
              información valiosa, como actividades prontas a cumplir, trabajos
              catagorizados por urgencia y peso y demás información para un
              mejor manejo de tiempo.
            </p>
          </div>
          <div
            ref={stackRef}
            className="section4 h-1/2 flex flex-col justify-center items-center"
          >
            <h2 className="text-2xl font-black mt-30">STACK UTILIZADOS</h2>
            <p>Para este proyecto se usaron distintas librerias como:</p>
            <div className="card bg-secondary px-20 grid grid-cols-6 gap-10 mb-20 mt-5 py-8 rounded-lg">
              {icons.map(({ Icon, label, url }, index) => (
                <a
                  href={url}
                  key={index}
                  title={label}
                  className="text-2xl flex justify-center hover:scale-130 transition-all duratoin-300"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
          <Link
            href="/dashboard"
            className="bg-light flex justify-center items-center text-3xl font-black rounded-t-full px-4 py-6 hover:bg-tertiary hover:*:text-light transition-all duration-500 ease-in-out"
          >
            <span className="bg-linear-to-r from-tertiary via-accent to-sky-400 bg-clip-text text-transparent transition-all duration-300">
              Continuar al dashboard
            </span>
            <GrFormNextLink className="text-4xl text-sky-400 transition-all duration-300" />
          </Link>
        </div>
      </div>
    </>
  );
}