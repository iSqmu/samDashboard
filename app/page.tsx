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
    // Solo ejecutar animaciones complejas en desktop
    const isDesktop = window.innerWidth >= 1024;

    if (isDesktop && imageRef.current) {
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
    }

    const parallaxTl = gsap.timeline({
      scrollTrigger: {
        trigger: parallaxRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        pinSpacing: false,
      },
    });

    // Animaciones más sutiles en móvil
    const xOffset = isDesktop ? 100 : 30;

    parallaxTl
      .fromTo(
        calendarRef.current,
        {
          x: -xOffset,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
        },
      )
      .fromTo(
        panelRef.current,
        {
          x: xOffset,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
        },
      )
      .fromTo(
        stackRef.current,
        {
          opacity: 0,
          x: isDesktop ? -200 : -50,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          delay: 0.5,
        },
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
      },
    );

    gsap.to(instructRef.current, {
      scrollTrigger: {
        trigger: instructRef.current,
        start: 'top center',
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
        start: 'center center',
        end: 'bottom center',
        pin: isDesktop, // Solo pin en desktop
        scrub: 1,
        toggleActions: 'start none none restart',
      },
      opacity: 0,
      ease: 'power2.out',
      duration: 2,
    });
  }, []);

  return (
    <>
      {/* Imagen circular - solo visible en desktop */}
      <img
        ref={imageRef}
        src="/asd.svg"
        alt="Imagen animada"
        className="hidden lg:flex absolute -top-100 left-1/2 -translate-x-1/2 z-2 max-w-2xl drop-shadow-2xl drop-shadow-accent"
      />

      <div className="content mt-12 md:mt-20">
        {/* Título principal - responsive */}
        <h1
          className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-black text-center z-1 pt-20 md:pt-40 lg:pt-50 px-4"
          ref={titleRef}
        >
          BIENVENIDO A MI DASHBOARD
        </h1>

        <div
          ref={instructRef}
          className="mark flex flex-col items-center justify-center absolute bottom-50 left-1/2 -translate-x-1/2 text-sm md:text-base"
        >
          Haz scroll para ver más
          <FaAngleDown className="arrow text-2xl md:text-4xl" />
        </div>

        <div className="section1 bg-linear-to-t from-accent to-dark min-h-screen flex flex-col justify-center items-center px-6 md:px-12 lg:px-24 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black mb-4">
            Implementación con la IA
          </h2>
          <p className="max-w-2xl text-sm sm:text-base md:text-lg">
            Asistencia para la asignación de nombres, descripciones, fechas a
            trabajos, compromisos o cosas que se quieran hacer a futuro para una
            mayor facilidad.
          </p>
        </div>

        <div ref={parallaxRef} className="paralax">
          <div
            ref={calendarRef}
            className="section2 bg-linear-to-b from-accent to-tertiary min-h-screen flex flex-col justify-center items-center px-6 md:px-12 lg:px-24 text-center"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black mb-4">
              Conexión con Google Calendar
            </h2>
            <p className="max-w-2xl text-sm sm:text-base md:text-lg">
              Integración con Google Calendar para manejo de tiempos y
              recordatorios de trabajos o actividades pendientes, te queremos
              ayudar usando herramientas que ya conoces.
            </p>
          </div>

          <div
            ref={panelRef}
            className="section3 bg-linear-to-b from-tertiary to-dark min-h-screen flex flex-col justify-center items-center px-6 md:px-12 lg:px-24 text-center"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black mb-4">
              Panel de control
            </h2>
            <p className="max-w-2xl text-sm sm:text-base md:text-lg">
              Te ofrecemos un panel de control donde podrás acceder a
              información valiosa, como actividades prontas a cumplir, trabajos
              categorizados por urgencia y peso y demás información para un
              mejor manejo de tiempo.
            </p>
          </div>

          <div
            ref={stackRef}
            className="section4 min-h-[50vh] flex flex-col justify-center items-center px-6 md:px-12 lg:px-24 py-12 md:py-20"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black mt-12 md:mt-20 lg:mt-30 mb-4 text-center">
              STACK UTILIZADOS
            </h2>
            <p className="mb-8 text-sm sm:text-base text-center">
              Para este proyecto se usaron distintas librerías como:
            </p>

            <div className="card bg-secondary px-20 md:px-24 lg:px-32 sm:px-20 py-5 md:py-8 rounded-lg mb-12 md:mb-20">
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-4 md:gap-6">
                {icons.map(({ Icon, label, url }, index) => (
                  <a
                    href={url}
                    key={index}
                    title={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl sm:text-4xl md:text-5xl lg:text-6xl flex justify-center items-center hover:scale-110 md:hover:scale-130 transition-all duration-300"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="bg-light flex flex-col sm:flex-row justify-center items-center text-xl sm:text-2xl md:text-3xl font-black rounded-t-2xl sm:rounded-t-full px-6 sm:px-8 md:px-12 py-6 md:py-8 hover:bg-tertiary hover:*:text-light transition-all duration-500 ease-in-out gap-2 sm:gap-0"
          >
            <span className="bg-linear-to-r from-tertiary via-accent to-sky-400 bg-clip-text text-transparent transition-all duration-300 text-center">
              Continuar al dashboard
            </span>
            <GrFormNextLink className="text-3xl md:text-4xl text-sky-400 transition-all duration-300" />
          </Link>
        </div>
      </div>
    </>
  );
}
