'use client';

import React from 'react';

type Props = {
  /** px scrolled before showing the button */
  threshold?: number;
  /** Extra classes to tweak position or style */
  className?: string;
  /** Where to scroll back to (default: top) */
  target?: 'window' | string; // CSS selector if you want a container
};

export default function ScrollToTop({
  threshold = 200,
  className = '',
  target = 'window',
}: Props) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const el =
      target === 'window'
        ? document.documentElement
        : ((document.querySelector(target) as HTMLElement | null) ??
          document.documentElement);

    const onScroll = () => {
      const y = target === 'window' ? window.scrollY : el.scrollTop;
      setVisible(y > threshold);
    };

    // Initial check + listener
    onScroll();
    // Use passive listener for perf
    const scrollTarget: EventTarget =
      target === 'window' ? window : (el as HTMLElement);
    scrollTarget.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      scrollTarget.removeEventListener('scroll', onScroll as EventListener);
    };
  }, [threshold, target]);

  const scrollToTop = () => {
    if (typeof window === 'undefined') return;

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (target === 'window') {
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    } else {
      const el = document.querySelector(target) as HTMLElement | null;
      if (el)
        el.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    }
  };

  // Hidden until threshold reached; pointer-events-none when hidden avoids accidental hover/focus
  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Back to top"
      className={[
        'fixed right-6 bottom-6 z-50 rounded-full border border-black/10 shadow-lg',
        'bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring',
        'focus-visible:ring-black/20 focus-visible:ring-offset-2',
        'transition-opacity duration-200',
        visible
          ? 'pointer-events-auto opacity-100'
          : 'pointer-events-none opacity-0',
        // Size & layout
        'grid h-12 w-12 place-items-center',
        className,
      ].join(' ')}
    >
      {/* Inline arrow-up icon (no external deps) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12l7-7 7 7" />
        <path d="M12 19V5" />
      </svg>
      <span className="sr-only">Back to top</span>
    </button>
  );
}
