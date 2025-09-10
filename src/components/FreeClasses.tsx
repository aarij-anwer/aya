// app/components/FreeClasses.tsx
'use client';

import { useState } from 'react';
import { ArrowTurnDownRightIcon } from '@heroicons/react/20/solid';
import { Button } from './Button';
import Avatar from './Avatar';
import CalendlyModal from './CalendlyModal'; // ← from earlier snippet

type Tier = {
  name: string;
  img: string;
  id: string;
  href: string; // Calendly URL
  text: string;
  price: { monthly: string; annually: string };
  description: string;
  features: string[];
};

const tiers: Tier[] = [
  {
    name: 'Shaikh Ahmed Hasan',
    img: '/people/ahmed.png',
    id: 'tier-basic',
    href: 'https://calendly.com/qutoofacademy/30min',
    text: 'Free class with Ahmed',
    price: { monthly: '$19', annually: '$15' },
    description: 'Shaikh Ahmed specializes in',
    features: [
      'Giving ijaza in all 10 Qiraat',
      'Teaching men and women',
      'Teaching young adults and adults',
      "Memorization and recitation of Qur'an",
    ],
  },
  {
    name: 'Ustadha Hend Ahmed',
    img: '/people/woman.png',
    id: 'tier-essential',
    href: 'https://calendly.com/qutoofacademy-women/30min',
    text: 'Free class with Hend',
    price: { monthly: '$49', annually: '$39' },
    description: 'Ustadha Hend specializes in',
    features: [
      'Giving ijaza in Hafs',
      'Teaching women, boys and girls',
      "Memorization and recitation of Qur'an",
      "Learning to read the Qur'an",
    ],
  },
];

export default function FreeClasses() {
  const [open, setOpen] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  const handleOpen = (url: string) => {
    setSelectedUrl(url);
    setOpen(true);
  };

  return (
    <div className="bg-white pt-10 pb-20 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mt-2 text-5xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-6xl sm:text-balance dark:text-white">
            Try a Qur&apos;an class on us!
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-pretty text-gray-600 sm:text-xl/8 dark:text-gray-400">
          We want you to be satisfied with us before you enroll and subscribe to
          a class.
        </p>

        <div className="mt-20 flex justify-center">
          <div className="relative isolate -mt-16 grid max-w-4xl grid-cols-1 place-content-center gap-y-4 sm:mx-auto sm:grid-cols-2 sm:gap-x-12 lg:grid-cols-2 xl:grid-cols-2">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px bg-gray-200 sm:block dark:bg-white/10"
            />
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className="pt-10 text-center lg:px-8 lg:pt-0 xl:px-10"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <Avatar src={tier.img} width={128} height={128} roundedFull />
                  <h3
                    id={tier.id}
                    className="text-2xl font-semibold text-gray-900 dark:text-white"
                  >
                    {tier.name}
                  </h3>
                </div>

                {/* Use your Button to open the modal */}
                <Button
                  aria-describedby={tier.id}
                  variant="solid"
                  color="orange"
                  className="mt-5"
                  onClick={() => handleOpen(tier.href)}
                >
                  {tier.text}
                </Button>

                <p className="mt-10 text-left text-sm/6 font-semibold text-gray-900 dark:text-white">
                  {tier.description}
                </p>
                <ul
                  role="list"
                  className="mt-6 space-y-3 text-sm/6 text-gray-600 dark:text-gray-300"
                >
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <ArrowTurnDownRightIcon
                        aria-hidden="true"
                        className="h-6 w-5 flex-none text-yellow-600 dark:text-yellow-400"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Calendly modal (renders only when a tier is selected) */}
        {selectedUrl && (
          <CalendlyModal
            open={open}
            onClose={() => setOpen(false)}
            url={selectedUrl}
          />
        )}
      </div>
    </div>
  );
}
