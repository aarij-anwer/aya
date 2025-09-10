import { NavProps } from '@/components/Nav';

export const NAV: NavProps[] = [
  {
    href: '/#about',
    children: 'About',
  },
  {
    href: '/#instructors',
    children: 'Instructors',
  },
  {
    href: '/#pricing',
    children: 'Pricing',
  },
  {
    href: '/free',
    children: 'Free Class',
  },
  // {
  //   href: '/#pricing',
  //   children: 'Pricing',
  // },
];

export const PEOPLE = [
  {
    name: 'Aarij Anwer',
    role: 'Co-Founder / CEO',
    imageUrl: '/people/aarij.png',
  },
  {
    name: 'Sh Muhammad Helmi',
    role: 'Co-Founder / Arabic Lead',
    imageUrl: '/people/muhammad.png',
  },
  {
    name: 'Sh Ahmed Hasan',
    role: "Qur'an Lead",
    imageUrl: '/people/ahmed.png',
  },
  {
    name: 'Ust Hend Ahmed',
    role: "Qur'an Instructor",
    imageUrl: '/people/woman.png',
  },
  {
    name: 'Dr Ibrahim Helmi',
    role: 'Arabic Instructor',
    imageUrl: '/people/ibrahim.png',
  },
  {
    name: 'Ust Aisha Talat',
    role: 'Arabic Instructor',
    imageUrl: '/people/woman.png',
  },
];

export const TIERS = [
  {
    name: 'Lite',
    id: 'tier-lite',
    href: 'https://buy.stripe.com/7sIeXp5zs8EK96EdR2',
    priceMonthly: '$20.99',
    description:
      "Begin your Qur'an journey with confidence—includes a 14‑day free trial.",
    features: [
      '14‑day free trial — no-questions-asked cancellation',
      'Two 30-minute sessions/week',
      '1 hour/week',
      '~4 hours/month',
      "Build a consistent and lasting Qur'an habit",
    ],
    featured: false,
  },
  {
    name: 'Recite and Ascend',
    id: 'tier-high',
    href: 'https://buy.stripe.com/4gw7uXe5Y9IObeMaER',
    priceMonthly: '$54.99',
    description:
      "Take your relationship with the Qur'an to the next level...'recite and ascend!' (Hadith)",
    features: [
      '21‑day free trial — peace of mind, hassle-free',
      '3 hours/week',
      '~12 hours/month',
      'Flexible: sessions can be 30 minutes or 60 minutes',
      'Recite with excellence and ascend to new spiritual heights',
    ],
    featured: true,
  },
];
