'use client';
import React from 'react';

export default function TextArea({
  id,
  rows = 3,
}: {
  id: string;
  rows?: number;
}) {
  return (
    <textarea
      id={id}
      name={id}
      rows={rows}
      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
      defaultValue={''}
    />
  );
}
