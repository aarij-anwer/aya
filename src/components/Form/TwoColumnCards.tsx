'use client';

import React, { useState } from 'react';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import FileDrop from './FileDrop';
import SectionCard from './SectionCard';
import TextArea from './TextArea';
import TextInput from './TextInput';
import Field from './Field';
import Select from './Select';
import Checkbox from './Checkbox';
import Radio from './Radio';

// ----------------------------
// Types
// ----------------------------
export type SectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  as?: 'form' | 'section';
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  open?: boolean;
  onToggle?: () => void;
};

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
