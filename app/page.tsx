'use client';
import Image from 'next/image';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import {
  RiTailwindCssFill,
  RiReactjsFill,
  RiNextjsFill,
  RiSupabaseLine,
} from 'react-icons/ri';
import { useGSAP } from '@gsap/react'
import { useEffect, useRef } from 'react';
import { TbBrandFramerMotion, TbBrandTypescript } from 'react-icons/tb';

gsap.registerPlugin(ScrollTrigger);
export default function Home() {
  let sect1 = useRef<HTMLDivElement>(null);
  let image = useRef<HTMLImageElement>(null);
  let sect3 = useRef<HTMLDivElement>(null);
  let iconsRef = useRef<HTMLDivElement>(null);

  const icons = [
    { Icon: RiTailwindCssFill, label: 'Tailwind CSS' },
    { Icon: RiReactjsFill, label: 'React' },
    { Icon: RiNextjsFill, label: 'Next.js' },
    { Icon: RiSupabaseLine, label: 'Supabase' },
    { Icon: TbBrandFramerMotion, label: 'Framer Motion' },
    { Icon: TbBrandTypescript, label: 'TypeScript' },
  ];

  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'power2.out', duration: 0.5 },
    });

    tl.from(sect1.current, { y: -100, opacity: 0 })
      .from(image.current, {
        x: -100,
        opacity: 0,
      })
      .from(sect3.current, { scale: 0.9, opacity: 0 });

    tl.from(
      '.stack-icon',
      {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.12,
        ease: 'power2',
      },
      '-=0.5'
    );
  }, []);

  return (
    <>
      <div id="1" ref={sect1}>
        <h1 className="h-1/3 text-center text-xl font-bold text-primary bg-accent/90 py-3">
          Bienvenido a mi Dashboard, creado para el manejo de horarios, tareas y
          demás actividades.
        </h1>
      </div>
      <div
        id="2"
        className="h-1/3 flex flex-col place-items-center justify-center p-2 text-accent"
      >
        <Image
          ref={image}
          src="/dashboard.png"
          alt="Dashboard"
          width={800}
          height={600}
          className="shadow-lg shadow-accent mb-5"
        />
        <p>
          Esta es una aplicación web diseñada por{' '}
          <a
            href="https://github.com/iSqmu"
            className="font-bold underline m-1"
          >
            Samuel Gómez
          </a>
          para manejo y seguimiento de actividades de la vida diaria.
        </p>
      </div>
      <div
        id="3"
        ref={sect3}
        className="h-1/2 bg-tertiary overflow-hidden text-primary m-5 py-2 px-6 rounded-lg"
      >
        <h2 className="text-center text-xl font-bold">STACKS</h2>
        <div ref={iconsRef} className="flex justify-center text-2xl gap-5">
          {icons.map(({ Icon, label }, index) => (
            <span
              key={index}
              className="stack-icon inline-block scale-90 hover:scale-130 transition-transform duration-300 cursor-pointer"
              title={label}
            >
              <Icon />
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
