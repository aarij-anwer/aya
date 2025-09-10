import Image from 'next/image';

import { Container } from '@/components/Container';
import backgroundImage from '@/images/background-call-to-action.jpg';
import { Button } from './Button';
import { NAV } from '@/app/constants';

export function CallToAction() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-yellow-600 px-4 py-20"
    >
      <Image
        className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        src={backgroundImage}
        alt=""
        width={2347}
        height={1244}
        unoptimized
      />
      <Container className="relative">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-3xl tracking-tight text-black sm:text-4xl">
            Trusted by students from across the world!
          </h2>
          <p className="mt-4 text-justify text-lg tracking-tight text-black">
            Since 2010, Qutoof Academy has been teaching students Arabic,
            Islamic Studies, and Qur’an mastery. Over 1000 learners from every
            corner of the globe have joined us, with 100+ proud graduates
            holding diplomas and ijazas.
          </p>
          <p className="mt-4 text-justify text-lg tracking-tight text-black">
            Whether you’re starting your Qur’an journey, polishing tajwid, or
            aiming for advanced ijazas, our private and one‑on‑one classes are
            designed for all ages. From children to adults, beginners to
            advanced learners – there’s a personalized path for you.
          </p>
          <div className="mt-8">
            <Button
              href="/#pricing"
              variant="solid"
              className="rounded-full px-8 py-4 shadow-lg ring-1 ring-white/20 ring-inset"
            >
              Enroll to get started!
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
