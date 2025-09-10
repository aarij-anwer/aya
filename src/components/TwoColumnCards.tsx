'use client';

import React, { useState } from 'react';
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { ChevronDownIcon } from '@heroicons/react/16/solid';

// ----------------------------
// Types
// ----------------------------
type SectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  as?: 'form' | 'section';
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  open?: boolean;
  onToggle?: () => void;
};

// ----------------------------
// Header + Card
// ----------------------------
function SectionHeader({
  title,
  description,
  open,
  onToggle,
}: {
  title: string;
  description?: string;
  open: boolean;
  onToggle: () => void;
}) {
  const slug = title.replace(/\s+/g, '-').toLowerCase();
  return (
    <div className="px-4 sm:px-0">
      <button
        type="button"
        onClick={onToggle}
        className="group flex w-full items-start gap-3 text-left"
        aria-expanded={open}
        aria-controls={`${slug}-panel`}
      >
        <ChevronDownIcon
          aria-hidden="true"
          className={`size-5 shrink-0 translate-y-1 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
        <div>
          <h2 className="text-base/7 font-semibold text-gray-900">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm/6 text-gray-600">{description}</p>
          ) : null}
        </div>
      </button>
    </div>
  );
}

function SectionCard({
  title,
  description,
  children,
  as = 'form',
  onSubmit,
  open = true,
  onToggle,
}: SectionProps) {
  const As = (as ?? 'form') as React.ElementType;
  const slug = title.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-4 py-6 md:grid-cols-3">
      <SectionHeader
        title={title}
        description={description}
        open={open}
        onToggle={onToggle ?? (() => {})}
      />

      <As
        id={`${slug}-panel`}
        onSubmit={as === 'form' ? onSubmit : undefined}
        className={`bg-white shadow-xs outline outline-gray-900/5 transition-all duration-200 sm:rounded-xl md:col-span-2 ${open ? 'opacity-100' : 'opacity-95'}`}
      >
        <div className="px-4 py-6 sm:p-8">{children}</div>

        <div
          className={`${open ? 'flex' : 'hidden'} items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8`}
        >
          <button
            type="button"
            onClick={onToggle}
            className="text-sm/6 font-semibold text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </As>
    </div>
  );
}

// ----------------------------
// PreviewClamp: show only first N items when closed
// ----------------------------
function PreviewClamp({
  open,
  previewCount = 1,
  children,
}: {
  open: boolean;
  previewCount?: number;
  children: React.ReactNode;
}) {
  const items = React.Children.toArray(children);

  // When open, render everything exactly as-is (keeps grid col-spans intact).
  if (open) return <>{items}</>;

  // When closed, render only the first N direct children.
  // Everything after N is wrapped in a hidden div so we don't mutate child props.
  return (
    <>
      {items.map((child, i) => {
        // Use the child's existing key if present; otherwise fall back to index.
        const rawKey =
          React.isValidElement(child) && child.key != null ? child.key : i;
        const key = typeof rawKey === 'string' ? rawKey : String(rawKey);

        if (i < previewCount) {
          return <React.Fragment key={key}>{child}</React.Fragment>;
        }

        return (
          <div key={key} className="hidden" aria-hidden>
            {child}
          </div>
        );
      })}
    </>
  );
}
// ----------------------------
// Field primitives
// ----------------------------
type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
};

function Field({ id, label, hint, children }: FieldProps) {
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

function TextInput({
  id,
  type = 'text',
  autoComplete,
  placeholder,
}: {
  id: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
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

function TextArea({ id, rows = 3 }: { id: string; rows?: number }) {
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

function Select({ id, options }: { id: string; options: string[] }) {
  return (
    <div className="grid grid-cols-1">
      <select
        id={id}
        name={id}
        className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <ChevronDownIcon
        aria-hidden="true"
        className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
      />
    </div>
  );
}

function Checkbox({
  id,
  defaultChecked,
  label,
  description,
}: {
  id: string;
  defaultChecked?: boolean;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-6 shrink-0 items-center">
        <div className="group grid size-4 grid-cols-1">
          <input
            defaultChecked={defaultChecked}
            id={id}
            name={id}
            type="checkbox"
            aria-describedby={`${id}-description`}
            className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
          />
          <svg
            fill="none"
            viewBox="0 0 14 14"
            className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
          >
            <path
              d="M3 8L6 11L11 3.5"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-0 group-has-checked:opacity-100"
            />
            <path
              d="M3 7H11"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-0 group-has-indeterminate:opacity-100"
            />
          </svg>
        </div>
      </div>
      <div className="text-sm/6">
        <label htmlFor={id} className="font-medium text-gray-900">
          {label}
        </label>
        {description ? (
          <p id={`${id}-description`} className="text-gray-500">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Radio({
  id,
  name,
  label,
}: {
  id: string;
  name: string;
  label: string;
}) {
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

function FileDrop({
  id,
  iconLabel,
  helpText,
}: {
  id: string;
  iconLabel?: string;
  helpText?: string;
}) {
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

// ----------------------------
// Accordion state helpers
// ----------------------------
type SectionState = { open: boolean };
function useAccordion(
  initial = true
): [SectionState, (next?: boolean) => void] {
  const [open, setOpen] = useState<boolean>(initial);
  return [
    { open },
    (next) => setOpen((prev) => (typeof next === 'boolean' ? next : !prev)),
  ];
}

// ----------------------------
// Page
// ----------------------------
export default function TwoColumnCards() {
  const [profile, toggleProfile] = useAccordion(true);
  const [personal, togglePersonal] = useAccordion(true);
  const [notify, toggleNotify] = useAccordion(true);

  // Generic submit handler: collapse on save
  function makeOnSubmit(toggle: (next?: boolean) => void) {
    return (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      toggle(false);
    };
  }

  return (
    <div className="min-h-screen divide-y divide-gray-900/10 bg-gray-50 p-10 dark:bg-gray-900">
      {/* Profile */}
      <SectionCard
        title="Profile"
        description="This information will be displayed publicly so be careful what you share."
        open={profile.open}
        onToggle={() => toggleProfile()}
        onSubmit={makeOnSubmit(toggleProfile)}
      >
        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <PreviewClamp open={profile.open} previewCount={1}>
            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                  <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">
                    workcation.com/
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="janesmith"
                    className="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                  />
                </div>
              </div>
            </div>

            <Field
              id="about"
              label="About"
              hint="Write a few sentences about yourself."
            >
              <TextArea id="about" rows={3} />
            </Field>

            <div className="col-span-full">
              <label
                htmlFor="photo"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Photo
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <UserCircleIcon
                  aria-hidden="true"
                  className="size-12 text-gray-300"
                />
                <button
                  type="button"
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50"
                >
                  Change
                </button>
              </div>
            </div>

            <Field id="cover-photo" label="Cover photo">
              <FileDrop id="file-upload" />
            </Field>
          </PreviewClamp>
        </div>
      </SectionCard>

      {/* Personal Information */}
      <SectionCard
        title="Personal Information"
        description="Use a permanent address where you can receive mail."
        open={personal.open}
        onToggle={() => togglePersonal()}
        onSubmit={makeOnSubmit(togglePersonal)}
      >
        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <PreviewClamp open={personal.open} previewCount={2}>
            <div className="sm:col-span-3">
              <label
                htmlFor="first-name"
                className="block text-sm/6 font-medium text-gray-900"
              >
                First name
              </label>
              <div className="mt-2">
                <TextInput id="first-name" autoComplete="given-name" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="last-name"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Last name
              </label>
              <div className="mt-2">
                <TextInput id="last-name" autoComplete="family-name" />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <TextInput id="email" type="email" autoComplete="email" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="country"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Country
              </label>
              <div className="mt-2">
                <Select
                  id="country"
                  options={['United States', 'Canada', 'Mexico']}
                />
              </div>
            </div>

            <Field id="street-address" label="Street address">
              <TextInput id="street-address" autoComplete="street-address" />
            </Field>

            <div className="sm:col-span-2 sm:col-start-1">
              <label
                htmlFor="city"
                className="block text-sm/6 font-medium text-gray-900"
              >
                City
              </label>
              <div className="mt-2">
                <TextInput id="city" autoComplete="address-level2" />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="region"
                className="block text-sm/6 font-medium text-gray-900"
              >
                State / Province
              </label>
              <div className="mt-2">
                <TextInput id="region" autoComplete="address-level1" />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="postal-code"
                className="block text-sm/6 font-medium text-gray-900"
              >
                ZIP / Postal code
              </label>
              <div className="mt-2">
                <TextInput id="postal-code" autoComplete="postal-code" />
              </div>
            </div>
          </PreviewClamp>
        </div>
      </SectionCard>

      {/* Notifications */}
      <SectionCard
        title="Notifications"
        description="We'll always let you know about important changes, but you pick what else you want to hear about."
        open={notify.open}
        onToggle={() => toggleNotify()}
        onSubmit={makeOnSubmit(toggleNotify)}
      >
        <div className="max-w-2xl space-y-10 md:col-span-2">
          <PreviewClamp open={notify.open} previewCount={1}>
            <fieldset>
              <legend className="text-sm/6 font-semibold text-gray-900">
                By email
              </legend>
              <div className="mt-6 space-y-6">
                <Checkbox
                  id="comments"
                  defaultChecked
                  label="Comments"
                  description="Get notified when someone posts a comment on a posting."
                />
                <Checkbox
                  id="candidates"
                  label="Candidates"
                  description="Get notified when a candidate applies for a job."
                />
                <Checkbox
                  id="offers"
                  label="Offers"
                  description="Get notified when a candidate accepts or rejects an offer."
                />
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm/6 font-semibold text-gray-900">
                Push notifications
              </legend>
              <p className="mt-1 text-sm/6 text-gray-600">
                These are delivered via SMS to your mobile phone.
              </p>
              <div className="mt-6 space-y-6">
                <Radio
                  id="push-everything"
                  name="push-notifications"
                  label="Everything"
                />
                <Radio
                  id="push-email"
                  name="push-notifications"
                  label="Same as email"
                />
                <Radio
                  id="push-nothing"
                  name="push-notifications"
                  label="No push notifications"
                />
              </div>
            </fieldset>
          </PreviewClamp>
        </div>
      </SectionCard>
    </div>
  );
}
