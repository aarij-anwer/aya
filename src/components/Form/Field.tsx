'use client';
import React from 'react';

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
};

export default function Field({ id, label, hint, children }: FieldProps) {
  return (
    <div className="col-span-full">
      <label htmlFor={id} className="block text-sm/6 font-medium text-gray-900">
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {hint ? <p className="mt-3 text-sm/6 text-gray-600">{hint}</p> : null}
    </div>
  );
}
