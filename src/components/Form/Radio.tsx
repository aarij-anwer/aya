'use client';
import React, { forwardRef } from 'react';

type RadioProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'id' | 'name'
> & {
  id: string;
  label: string;
};

const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { id, label, ...rest },
  ref
) {
  return (
    <div className="flex items-center gap-x-3">
      <input
        ref={ref} // ✅ react-hook-form / focus control
        id={id}
        type="radio"
        className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
        {...rest} // ✅ supports value, onChange, checked, disabled, aria-*, etc.
      />
      <label htmlFor={id} className="block text-sm/6 font-medium text-gray-900">
        {label}
      </label>
    </div>
  );
});

export default Radio;
