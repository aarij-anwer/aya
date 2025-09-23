'use client';
import React, { forwardRef } from 'react';

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  options: string[];
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { id, options, ...rest },
  ref
) {
  return (
    <div className="grid grid-cols-1">
      <select
        ref={ref} // ✅ react-hook-form compatibility
        id={id}
        name={id}
        className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        {...rest} // ✅ value, onChange, defaultValue, etc.
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
});

export default Select;
