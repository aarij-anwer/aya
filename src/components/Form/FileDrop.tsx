'use client';
import React from 'react';
import { PhotoIcon } from '@heroicons/react/24/solid';

type Props = { id: string; iconLabel?: string; helpText?: string };

export default function FileDrop({ id, iconLabel, helpText }: Props) {
  return (
    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
      <div className="text-center">
        <PhotoIcon
          aria-hidden="true"
          className="mx-auto size-12 text-gray-300"
        />
        <div className="mt-4 flex text-sm/6 text-gray-600">
          <label
            htmlFor={id}
            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600 hover:text-indigo-500"
          >
            <span>{iconLabel ?? 'Upload a file'}</span>
            <input id={id} name={id} type="file" className="sr-only" />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs/5 text-gray-600">
          {helpText ?? 'PNG, JPG, GIF up to 10MB'}
        </p>
      </div>
    </div>
  );
}
