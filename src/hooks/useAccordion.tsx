import { useState } from 'react';

export type SectionState = { open: boolean };

export function useAccordion(
  initial = true
): [SectionState, (next?: boolean) => void] {
  const [open, setOpen] = useState<boolean>(initial);
  return [
    { open },
    (next) => setOpen((prev) => (typeof next === 'boolean' ? next : !prev)),
  ];
}
