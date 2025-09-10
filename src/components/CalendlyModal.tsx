// app/components/CalendlyModal.tsx
'use client';

import dynamic from 'next/dynamic';
import Modal from './Modal';
import { Inter } from 'next/font/google';

const InlineWidget = dynamic(
  () => import('react-calendly').then((m) => m.InlineWidget),
  { ssr: false }
);

type CalendlyModalProps = {
  open: boolean;
  onClose: () => void;
  url: string;
  name?: string;
  email?: string;
};

const inter = Inter({ subsets: ['latin'] });

function inferInstructor(url: string): string {
  const u = url.toLowerCase();
  if (u.includes('qutoofacademy-women')) return 'Ustadha Hend Ahmed';
  if (u.includes('qutoofacademy/30min')) return 'Shaikh Ahmed Hasan';
  return 'Instructor';
}

export default function CalendlyModal({
  open,
  onClose,
  url,
  name,
  email,
}: CalendlyModalProps) {
  const instructor = inferInstructor(url);

  const subject = encodeURIComponent(`Free class booking with ${instructor}`);
  const body = encodeURIComponent(
    [
      'Salaam Qutoof Support,',
      ' ',
      `I need help with booking a free class with ${instructor}.`,
      name ? `Name: ${name}` : undefined,
      email ? `Email: ${email}` : undefined,
      `Booking link: ${url}`,
      ' ',
      'Jazakum Allahu khairan.',
    ]
      .filter(Boolean)
      .join('\n')
  );

  const mailtoHref = `mailto:admin@qutoofacademy.com?subject=${subject}&body=${body}`;

  return (
    <Modal open={open} onClose={onClose} className={`${inter.className} p-0`}>
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-xl font-bold sm:text-2xl">Book a time</h2>
        <button
          onClick={onClose}
          className="rounded-full py-1 pl-3 text-sm hover:bg-slate-100"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <div className="h-[80vh] w-full">
        <InlineWidget
          url={url}
          styles={{ height: '100%', width: '100%' }}
          prefill={{
            name: name ?? '',
            email: email ?? '',
          }}
          pageSettings={{ hideEventTypeDetails: false }}
        />
      </div>
      <div className="border-t px-4 py-2 text-center">
        <a
          href={mailtoHref}
          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          Need help? Email Qutoof Support (re: {instructor})
        </a>
      </div>
    </Modal>
  );
}
