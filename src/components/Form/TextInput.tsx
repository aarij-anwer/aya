'use client';
import React from 'react';

type Props = {
  id: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
};

export default function TextInput({
  id,
  type = 'text',
  autoComplete,
  placeholder,
}: Props) {
  return (
    <input
      id={id}
      name={id}
      type={type}
      autoComplete={autoComplete}
      placeholder={placeholder}
      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
    />
  );
}
