import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.svg"
      alt="Qutoof logo"
      width={120}
      height={40}
      priority
      className={className}
    />
  );
}
