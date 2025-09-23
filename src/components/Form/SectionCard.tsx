// app/components/SectionCard.tsx
'use client';
import React from 'react';
import SectionHeader from './SectionHeader';

type SectionCardProps = {
  title: string;
  description?: string;
  open?: boolean;
  onToggle?: () => void;
  onSaveClick?: () => void;
  onCancelClick?: () => void;
  children: React.ReactNode;
};

export default function SectionCard({
  title,
  description,
  open = true,
  onToggle,
  onSaveClick,
  onCancelClick,
  children,
}: SectionCardProps) {
  const slug = title.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-4 py-6 md:grid-cols-3">
      <SectionHeader
        title={title}
        description={description}
        open={open}
        onToggle={onToggle ?? (() => {})}
      />

      <div
        id={`${slug}-panel`}
        className={`bg-white shadow-xs outline outline-gray-900/5 transition-all duration-200 sm:rounded-xl md:col-span-2 ${
          open ? 'opacity-100' : 'opacity-95'
        }`}
      >
        <div className="px-4 py-6 sm:p-8">{children}</div>

        <div
          className={`${
            open ? 'flex' : 'hidden'
          } items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8`}
        >
          <button
            type="button"
            onClick={onCancelClick}
            className="text-sm/6 font-semibold text-gray-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSaveClick}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
