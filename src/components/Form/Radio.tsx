'use client';
import React from 'react';

type Props = { id: string; name: string; label: string };

export default function Radio({ id, name, label }: Props) {
  return (
    <div className="flex items-center gap-x-3">
      <input
        id={id}
        name={name}
        type="radio"
        className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
      />
      <label htmlFor={id} className="block text-sm/6 font-medium text-gray-900">
        {label}
      </label>
    </div>
  );
}
