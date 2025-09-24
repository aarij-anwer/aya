'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

import { faker } from '@faker-js/faker';

function makeFixture() {
  const first = faker.person.firstName();
  const last = faker.person.lastName();
  const coFirst = faker.person.firstName();
  const coLast = faker.person.lastName();
  const street = `${faker.location.streetAddress()}`;
  const city = faker.location.city();
  const prov = 'ON';
  const postal = 'M5V 2T6';

  return {
    // Applicant — Identity & Contact
    'app-first': first,
    'app-last': last,
    'app-dob': '1990-01-15',
    'app-sin': '123-456-789',
    'app-status': 'Citizen',
    'app-email': faker.internet.email({ firstName: first, lastName: last }),
    'app-phone': '416-555-0133',
    'app-street': street,
    'app-city': city,
    'app-province': prov,
    'app-postal': postal,
    'app-occupancy': 'Rent',
    'app-housing-payment': 2400,
    'app-tenure': 2,
    'app-prev-street': '',
    'app-prev-city': '',
    'app-prev-province': '',
    'app-prev-postal': '',

    // Applicant — Employment
    'emp-employer': 'Acme Corp',
    'emp-position': 'Software Engineer',
    'emp-paytype': 'Salary',
    'emp-income': 145000,
    'emp-tenure': 3,
    'emp-street': '123 King St W',
    'emp-city': 'Toronto',
    'emp-province': 'ON',
    'emp-postal': 'M5H 1A1',
    'emp-prev-employer': 'Globex',
    'emp-prev-position': 'Developer',
    'emp-prev-tenure': 1,

    // Personal Reference
    'ref-name': 'Jamie Rivera',
    'ref-relationship': 'Friend',
    'ref-phone': '647-555-0199',
    'ref-email': 'jamie@example.com',
    'ref-street': '55 Queen St E',
    'ref-city': 'Toronto',
    'ref-province': 'ON',
    'ref-postal': 'M5C 1R6',

    // Co-Applicant — Identity & Employment
    'co-first': coFirst,
    'co-last': coLast,
    'co-dob': '1991-06-20',
    'co-sin': '987-654-321',
    'co-status': 'Permanent Resident',
    'co-email': faker.internet.email({ firstName: coFirst, lastName: coLast }),
    'co-phone': '289-555-0100',
    'co-street': '10 Dundas St E',
    'co-city': 'Toronto',
    'co-province': 'ON',
    'co-postal': 'M5B 2G9',
    'co-occupancy': 'Rent',
    'co-housing-payment': 0,
    'co-tenure': 2,
    'co-prev-street': '',
    'co-prev-city': '',
    'co-prev-province': '',
    'co-prev-postal': '',

    'co-emp-employer': 'Initech',
    'co-emp-position': 'Analyst',
    'co-emp-paytype': 'Salary',
    'co-emp-income': 98000,
    'co-emp-tenure': 2,
    'co-emp-street': '200 Bay St',
    'co-emp-city': 'Toronto',
    'co-emp-province': 'ON',
    'co-emp-postal': 'M5J 2J5',
    'co-emp-prev-employer': '',
    'co-emp-prev-position': '',
    'co-emp-prev-tenure': 0,

    // Assets
    'asset-bank-name-1': 'RBC Chequing',
    'asset-bank-balance-1': 12000,
    'asset-invest-type-1': 'TFSA',
    'asset-invest-amount-1': 25000,
    'asset-re-type-1': 'Condo',
    'asset-re-value-1': 650000,
    'asset-vehicle-status-1': 'Owned',
    'asset-vehicle-value-1': 18000,
    'asset-other-desc-1': 'Jewelry',
    'asset-other-value-1': 3000,

    // Liabilities
    'debt-cc-desc-1': 'TD Visa',
    'debt-cc-balance-1': 2400,
    'debt-cc-pay-1': 75,
    'debt-loan-desc-1': 'RBC LOC',
    'debt-loan-balance-1': 8000,
    'debt-loan-pay-1': 200,
    'debt-mortgage-desc-1': 'Primary residence',
    'debt-mortgage-balance-1': 420000,
    'debt-mortgage-pay-1': 2200,
    'debt-other-desc-1': '',
    'debt-other-balance-1': 0,

    // Totals (placeholder)
    'nw-assets': 0,
    'nw-liabs': 0,
    'nw-net': 0,

    // Declarations
    'app-bankruptcy': 'no',
    'app-bankruptcy-year': '',
    'co-bankruptcy': 'no',
    'co-bankruptcy-year': '',

    // Consent (only essentials; server compacts anyway)
    'sign-app-name': `${first} ${last}`,
    'sign-app-date': '2025-09-24',
    'sign-co-name': `${coFirst} ${coLast}`,
    'sign-co-date': '2025-09-24',
  };
}

type FormValues = Record<string, any>;

export default function BasicMortgageForm() {
  const { register, handleSubmit, reset, getValues } = useForm<FormValues>();

  const onSubmit = async () => {
    const values = getValues(); // RHF snapshot
    console.log(values);
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    console.log('Saved:', json);
  };

  const onCancel = () => {
    reset();
    console.log('Form cleared.');
  };

  const fillDemo = () => reset(makeFixture());
  const clearAll = () => reset({});

  const input =
    'mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-200';
  const section = 'space-y-4 border-t pt-6';
  const grid = 'grid grid-cols-1 gap-4 sm:grid-cols-2';

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto max-w-5xl space-y-8 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800"
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Mortgage Application — Basic Form
        </h1>

        {/* Applicant — Identity & Contact */}
        <section className={section}>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Applicant — Identity & Contact
          </h2>
          <div className={grid}>
            <div>
              <label htmlFor="app-first" className={label}>
                First name
              </label>
              <input
                id="app-first"
                {...register('app-first')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="app-last" className={label}>
                Last name
              </label>
              <input
                id="app-last"
                {...register('app-last')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="app-dob" className={label}>
                Date of birth
              </label>
              <input
                id="app-dob"
                type="date"
                {...register('app-dob')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="app-sin" className={label}>
                SIN (optional)
              </label>
              <input
                id="app-sin"
                placeholder="###-###-###"
                {...register('app-sin')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="app-status" className={label}>
                Residency status
              </label>
              <select
                id="app-status"
                {...register('app-status')}
                className={input}
              >
                <option value="">Select…</option>
                <option>Citizen</option>
                <option>Permanent Resident</option>
                <option>Work Permit</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="app-email" className={label}>
                Email
              </label>
              <input
                id="app-email"
                type="email"
                autoComplete="email"
                {...register('app-email')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="app-phone" className={label}>
                Mobile phone
              </label>
              <input
                id="app-phone"
                type="tel"
                autoComplete="tel"
                {...register('app-phone')}
                className={input}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="app-street" className={label}>
                Street address
              </label>
              <input
                id="app-street"
                autoComplete="street-address"
                {...register('app-street')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="app-city" className={label}>
                City
              </label>
              <input
                id="app-city"
                autoComplete="address-level2"
                {...register('app-city')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="app-province" className={label}>
                Province / State
              </label>
              <input
                id="app-province"
                autoComplete="address-level1"
                {...register('app-province')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="app-postal" className={label}>
                Postal / ZIP
              </label>
              <input
                id="app-postal"
                autoComplete="postal-code"
                {...register('app-postal')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="app-occupancy" className={label}>
                Own / Rent
              </label>
              <select
                id="app-occupancy"
                {...register('app-occupancy')}
                className={input}
              >
                <option value="">Select…</option>
                <option>Own</option>
                <option>Rent</option>
                <option>With Family</option>
              </select>
            </div>
            <div>
              <label htmlFor="app-housing-payment" className={label}>
                Monthly housing payment ($)
              </label>
              <input
                id="app-housing-payment"
                type="number"
                inputMode="decimal"
                {...register('app-housing-payment')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="app-tenure" className={label}>
                How long at address? (years)
              </label>
              <input
                id="app-tenure"
                type="number"
                {...register('app-tenure')}
                className={input}
              />
            </div>

            {/* Previous address */}
            <div className="sm:col-span-2">
              <label htmlFor="app-prev-street" className={label}>
                Previous address (if &lt; 2 yrs)
              </label>
              <input
                id="app-prev-street"
                {...register('app-prev-street')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="app-prev-city" className={label}>
                Prev. City
              </label>
              <input
                id="app-prev-city"
                {...register('app-prev-city')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="app-prev-province" className={label}>
                Prev. Province
              </label>
              <input
                id="app-prev-province"
                {...register('app-prev-province')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="app-prev-postal" className={label}>
                Prev. Postal
              </label>
              <input
                id="app-prev-postal"
                {...register('app-prev-postal')}
                className={input}
              />
            </div>
          </div>
        </section>

        {/* Applicant — Employment */}
        <section className={section}>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Applicant — Employment
          </h2>
          <div className={grid}>
            <div className="sm:col-span-2">
              <label htmlFor="emp-employer" className={label}>
                Employer name
              </label>
              <input
                id="emp-employer"
                {...register('emp-employer')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="emp-position" className={label}>
                Position / Title
              </label>
              <input
                id="emp-position"
                {...register('emp-position')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="emp-paytype" className={label}>
                Pay type
              </label>
              <select
                id="emp-paytype"
                {...register('emp-paytype')}
                className={input}
              >
                <option value="">Select…</option>
                <option>Salary</option>
                <option>Hourly</option>
                <option>Commission</option>
                <option>Contract</option>
                <option>Self-employed</option>
              </select>
            </div>
            <div>
              <label htmlFor="emp-income" className={label}>
                Annual income ($)
              </label>
              <input
                id="emp-income"
                type="number"
                inputMode="decimal"
                {...register('emp-income')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="emp-tenure" className={label}>
                Time in role (years)
              </label>
              <input
                id="emp-tenure"
                type="number"
                {...register('emp-tenure')}
                className={input}
              />
            </div>

            {/* Employer address */}
            <div className="sm:col-span-2">
              <label htmlFor="emp-street" className={label}>
                Employer address
              </label>
              <input
                id="emp-street"
                {...register('emp-street')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="emp-city" className={label}>
                City
              </label>
              <input
                id="emp-city"
                {...register('emp-city')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="emp-province" className={label}>
                Province / State
              </label>
              <input
                id="emp-province"
                {...register('emp-province')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="emp-postal" className={label}>
                Postal / ZIP
              </label>
              <input
                id="emp-postal"
                {...register('emp-postal')}
                className={input}
              />
            </div>

            {/* Previous employer */}
            <div className="sm:col-span-2">
              <label htmlFor="emp-prev-employer" className={label}>
                Previous employer (if &lt; 2 yrs)
              </label>
              <input
                id="emp-prev-employer"
                {...register('emp-prev-employer')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="emp-prev-position" className={label}>
                Prev. position
              </label>
              <input
                id="emp-prev-position"
                {...register('emp-prev-position')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="emp-prev-tenure" className={label}>
                Prev. time in role (years)
              </label>
              <input
                id="emp-prev-tenure"
                type="number"
                {...register('emp-prev-tenure')}
                className={input}
              />
            </div>
          </div>
        </section>

        {/* Personal Reference */}
        <section className={section}>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Personal Reference
          </h2>
          <div className={grid}>
            <div>
              <label htmlFor="ref-name" className={label}>
                Reference name
              </label>
              <input
                id="ref-name"
                {...register('ref-name')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="ref-relationship" className={label}>
                Relationship
              </label>
              <input
                id="ref-relationship"
                {...register('ref-relationship')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="ref-phone" className={label}>
                Phone
              </label>
              <input
                id="ref-phone"
                type="tel"
                {...register('ref-phone')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="ref-email" className={label}>
                Email (optional)
              </label>
              <input
                id="ref-email"
                type="email"
                {...register('ref-email')}
                className={input}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="ref-street" className={label}>
                Reference address
              </label>
              <input
                id="ref-street"
                {...register('ref-street')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="ref-city" className={label}>
                City
              </label>
              <input
                id="ref-city"
                {...register('ref-city')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="ref-province" className={label}>
                Province / State
              </label>
              <input
                id="ref-province"
                {...register('ref-province')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="ref-postal" className={label}>
                Postal / ZIP
              </label>
              <input
                id="ref-postal"
                {...register('ref-postal')}
                className={input}
              />
            </div>
          </div>
        </section>

        {/* Co-Applicant — Identity & Contact */}
        <section className={section}>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Co-Applicant — Identity & Contact
          </h2>
          <div className={grid}>
            <div>
              <label htmlFor="co-first" className={label}>
                First name
              </label>
              <input
                id="co-first"
                {...register('co-first')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="co-last" className={label}>
                Last name
              </label>
              <input id="co-last" {...register('co-last')} className={input} />
            </div>
            <div>
              <label htmlFor="co-dob" className={label}>
                Date of birth
              </label>
              <input
                id="co-dob"
                type="date"
                {...register('co-dob')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="co-sin" className={label}>
                SIN (optional)
              </label>
              <input id="co-sin" {...register('co-sin')} className={input} />
            </div>
            <div>
              <label htmlFor="co-status" className={label}>
                Residency status
              </label>
              <select
                id="co-status"
                {...register('co-status')}
                className={input}
              >
                <option value="">Select…</option>
                <option>Citizen</option>
                <option>Permanent Resident</option>
                <option>Work Permit</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="co-email" className={label}>
                Email
              </label>
              <input
                id="co-email"
                type="email"
                {...register('co-email')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="co-phone" className={label}>
                Mobile phone
              </label>
              <input
                id="co-phone"
                type="tel"
                {...register('co-phone')}
                className={input}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="co-street" className={label}>
                Street address
              </label>
              <input
                id="co-street"
                {...register('co-street')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="co-city" className={label}>
                City
              </label>
              <input id="co-city" {...register('co-city')} className={input} />
            </div>
            <div>
              <label htmlFor="co-province" className={label}>
                Province / State
              </label>
              <input
                id="co-province"
                {...register('co-province')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="co-postal" className={label}>
                Postal / ZIP
              </label>
              <input
                id="co-postal"
                {...register('co-postal')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="co-occupancy" className={label}>
                Own / Rent
              </label>
              <select
                id="co-occupancy"
                {...register('co-occupancy')}
                className={input}
              >
                <option value="">Select…</option>
                <option>Own</option>
                <option>Rent</option>
                <option>With Family</option>
              </select>
            </div>
            <div>
              <label htmlFor="co-housing-payment" className={label}>
                Monthly housing payment ($)
              </label>
              <input
                id="co-housing-payment"
                type="number"
                {...register('co-housing-payment')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="co-tenure" className={label}>
                How long at address? (years)
              </label>
              <input
                id="co-tenure"
                type="number"
                {...register('co-tenure')}
                className={input}
              />
            </div>

            {/* Previous address */}
            <div className="sm:col-span-2">
              <label htmlFor="co-prev-street" className={label}>
                Previous address (if &lt; 2 yrs)
              </label>
              <input
                id="co-prev-street"
                {...register('co-prev-street')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="co-prev-city" className={label}>
                Prev. City
              </label>
              <input
                id="co-prev-city"
                {...register('co-prev-city')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="co-prev-province" className={label}>
                Prev. Province
              </label>
              <input
                id="co-prev-province"
                {...register('co-prev-province')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="co-prev-postal" className={label}>
                Prev. Postal
              </label>
              <input
                id="co-prev-postal"
                {...register('co-prev-postal')}
                className={input}
              />
            </div>
          </div>
        </section>

        {/* Co-Applicant — Employment */}
        <section className={section}>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Co-Applicant — Employment
          </h2>
          <div className={grid}>
            <div className="sm:col-span-2">
              <label htmlFor="co-emp-employer" className={label}>
                Employer name
              </label>
              <input
                id="co-emp-employer"
                {...register('co-emp-employer')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="co-emp-position" className={label}>
                Position / Title
              </label>
              <input
                id="co-emp-position"
                {...register('co-emp-position')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="co-emp-paytype" className={label}>
                Pay type
              </label>
              <select
                id="co-emp-paytype"
                {...register('co-emp-paytype')}
                className={input}
              >
                <option value="">Select…</option>
                <option>Salary</option>
                <option>Hourly</option>
                <option>Commission</option>
                <option>Contract</option>
                <option>Self-employed</option>
              </select>
            </div>
            <div>
              <label htmlFor="co-emp-income" className={label}>
                Annual income ($)
              </label>
              <input
                id="co-emp-income"
                type="number"
                {...register('co-emp-income')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="co-emp-tenure" className={label}>
                Time in role (years)
              </label>
              <input
                id="co-emp-tenure"
                type="number"
                {...register('co-emp-tenure')}
                className={input}
              />
            </div>

            {/* Employer address */}
            <div className="sm:col-span-2">
              <label htmlFor="co-emp-street" className={label}>
                Employer address
              </label>
              <input
                id="co-emp-street"
                {...register('co-emp-street')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="co-emp-city" className={label}>
                City
              </label>
              <input
                id="co-emp-city"
                {...register('co-emp-city')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="co-emp-province" className={label}>
                Province / State
              </label>
              <input
                id="co-emp-province"
                {...register('co-emp-province')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="co-emp-postal" className={label}>
                Postal / ZIP
              </label>
              <input
                id="co-emp-postal"
                {...register('co-emp-postal')}
                className={input}
              />
            </div>

            {/* Previous employer */}
            <div className="sm:col-span-2">
              <label htmlFor="co-emp-prev-employer" className={label}>
                Previous employer (if &lt; 2 yrs)
              </label>
              <input
                id="co-emp-prev-employer"
                {...register('co-emp-prev-employer')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="co-emp-prev-position" className={label}>
                Prev. position
              </label>
              <input
                id="co-emp-prev-position"
                {...register('co-emp-prev-position')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="co-emp-prev-tenure" className={label}>
                Prev. time in role (years)
              </label>
              <input
                id="co-emp-prev-tenure"
                type="number"
                {...register('co-emp-prev-tenure')}
                className={input}
              />
            </div>
          </div>
        </section>

        {/* Assets */}
        <section className={section}>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Assets
          </h2>
          <div className={grid}>
            {/* Bank accounts */}
            <div>
              <label htmlFor="asset-bank-name-1" className={label}>
                Bank account — institution
              </label>
              <input
                id="asset-bank-name-1"
                placeholder="e.g., RBC Chequing"
                {...register('asset-bank-name-1')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="asset-bank-balance-1" className={label}>
                Current balance ($)
              </label>
              <input
                id="asset-bank-balance-1"
                type="number"
                {...register('asset-bank-balance-1')}
                className={input}
              />
            </div>

            {/* Investments */}
            <div>
              <label htmlFor="asset-invest-type-1" className={label}>
                Investment — type
              </label>
              <input
                id="asset-invest-type-1"
                placeholder="RRSP / TFSA / Non-registered"
                {...register('asset-invest-type-1')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="asset-invest-amount-1" className={label}>
                Current amount ($)
              </label>
              <input
                id="asset-invest-amount-1"
                type="number"
                {...register('asset-invest-amount-1')}
                className={input}
              />
            </div>

            {/* Real Estate */}
            <div>
              <label htmlFor="asset-re-type-1" className={label}>
                Real estate — type
              </label>
              <select
                id="asset-re-type-1"
                {...register('asset-re-type-1')}
                className={input}
              >
                <option value="">Select…</option>
                <option>Detached</option>
                <option>Semi</option>
                <option>Townhome</option>
                <option>Condo</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="asset-re-value-1" className={label}>
                Market value ($)
              </label>
              <input
                id="asset-re-value-1"
                type="number"
                {...register('asset-re-value-1')}
                className={input}
              />
            </div>

            {/* Vehicles */}
            <div>
              <label htmlFor="asset-vehicle-status-1" className={label}>
                Vehicle — status
              </label>
              <select
                id="asset-vehicle-status-1"
                {...register('asset-vehicle-status-1')}
                className={input}
              >
                <option value="">Select…</option>
                <option>Owned</option>
                <option>Financed</option>
                <option>Leased</option>
              </select>
            </div>
            <div>
              <label htmlFor="asset-vehicle-value-1" className={label}>
                Estimated value ($)
              </label>
              <input
                id="asset-vehicle-value-1"
                type="number"
                {...register('asset-vehicle-value-1')}
                className={input}
              />
            </div>

            {/* Other assets */}
            <div>
              <label htmlFor="asset-other-desc-1" className={label}>
                Other asset — description
              </label>
              <input
                id="asset-other-desc-1"
                placeholder="e.g., Jewelry, collectibles"
                {...register('asset-other-desc-1')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="asset-other-value-1" className={label}>
                Estimated value ($)
              </label>
              <input
                id="asset-other-value-1"
                type="number"
                {...register('asset-other-value-1')}
                className={input}
              />
            </div>
          </div>
        </section>

        {/* Liabilities */}
        <section className={section}>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Liabilities
          </h2>
          <div className={grid}>
            {/* Credit cards */}
            <div>
              <label htmlFor="debt-cc-desc-1" className={label}>
                Credit card — description
              </label>
              <input
                id="debt-cc-desc-1"
                placeholder="e.g., TD Visa"
                {...register('debt-cc-desc-1')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="debt-cc-balance-1" className={label}>
                Balance ($)
              </label>
              <input
                id="debt-cc-balance-1"
                type="number"
                {...register('debt-cc-balance-1')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="debt-cc-pay-1" className={label}>
                Monthly payment ($)
              </label>
              <input
                id="debt-cc-pay-1"
                type="number"
                {...register('debt-cc-pay-1')}
                className={input}
              />
            </div>

            {/* Loans / LOC / Auto */}
            <div>
              <label htmlFor="debt-loan-desc-1" className={label}>
                Loan / LOC / Auto — description
              </label>
              <input
                id="debt-loan-desc-1"
                placeholder="e.g., RBC LOC"
                {...register('debt-loan-desc-1')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="debt-loan-balance-1" className={label}>
                Balance ($)
              </label>
              <input
                id="debt-loan-balance-1"
                type="number"
                {...register('debt-loan-balance-1')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="debt-loan-pay-1" className={label}>
                Monthly payment ($)
              </label>
              <input
                id="debt-loan-pay-1"
                type="number"
                {...register('debt-loan-pay-1')}
                className={input}
              />
            </div>

            {/* Mortgages */}
            <div>
              <label htmlFor="debt-mortgage-desc-1" className={label}>
                Mortgage — description
              </label>
              <input
                id="debt-mortgage-desc-1"
                placeholder="e.g., Primary residence"
                {...register('debt-mortgage-desc-1')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="debt-mortgage-balance-1" className={label}>
                Balance ($)
              </label>
              <input
                id="debt-mortgage-balance-1"
                type="number"
                {...register('debt-mortgage-balance-1')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="debt-mortgage-pay-1" className={label}>
                Monthly payment ($)
              </label>
              <input
                id="debt-mortgage-pay-1"
                type="number"
                {...register('debt-mortgage-pay-1')}
                className={input}
              />
            </div>

            {/* Other liabilities */}
            <div>
              <label htmlFor="debt-other-desc-1" className={label}>
                Other liability — description
              </label>
              <input
                id="debt-other-desc-1"
                {...register('debt-other-desc-1')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="debt-other-balance-1" className={label}>
                Current balance ($)
              </label>
              <input
                id="debt-other-balance-1"
                type="number"
                {...register('debt-other-balance-1')}
                className={input}
              />
            </div>
          </div>
        </section>

        {/* Net Worth (placeholders) */}
        <section className={section}>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Net Worth (read-only placeholders)
          </h2>
          <div className={grid}>
            <div>
              <label htmlFor="nw-assets" className={label}>
                Total Assets ($)
              </label>
              <input
                id="nw-assets"
                type="number"
                placeholder="Auto-calculated later"
                {...register('nw-assets')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="nw-liabs" className={label}>
                Total Liabilities ($)
              </label>
              <input
                id="nw-liabs"
                type="number"
                placeholder="Auto-calculated later"
                {...register('nw-liabs')}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="nw-net" className={label}>
                Net Worth ($)
              </label>
              <input
                id="nw-net"
                type="number"
                placeholder="Auto-calculated later"
                {...register('nw-net')}
                className={input}
              />
            </div>
          </div>
        </section>

        {/* Declarations */}
        <section className={section}>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Declarations
          </h2>

          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Applicant
            </legend>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                <input
                  type="radio"
                  value="no"
                  {...register('app-bankruptcy')}
                  className="h-4 w-4"
                />
                No bankruptcy / court judgment
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                <input
                  type="radio"
                  value="yes"
                  {...register('app-bankruptcy')}
                  className="h-4 w-4"
                />
                Yes — specify year below
              </label>
            </div>
            <div className="sm:w-56">
              <label htmlFor="app-bankruptcy-year" className={label}>
                Year (if yes)
              </label>
              <input
                id="app-bankruptcy-year"
                type="number"
                {...register('app-bankruptcy-year')}
                className={input}
              />
            </div>
          </fieldset>

          <fieldset className="space-y-2 pt-4">
            <legend className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Co-Applicant
            </legend>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                <input
                  type="radio"
                  value="no"
                  {...register('co-bankruptcy')}
                  className="h-4 w-4"
                />
                No bankruptcy / court judgment
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                <input
                  type="radio"
                  value="yes"
                  {...register('co-bankruptcy')}
                  className="h-4 w-4"
                />
                Yes — specify year below
              </label>
            </div>
            <div className="sm:w-56">
              <label htmlFor="co-bankruptcy-year" className={label}>
                Year (if yes)
              </label>
              <input
                id="co-bankruptcy-year"
                type="number"
                {...register('co-bankruptcy-year')}
                className={input}
              />
            </div>
          </fieldset>
        </section>

        {/* Consent & Signatures */}
        <section className={section}>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Consent & Signatures
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="consent-text" className={label}>
                Consent text
              </label>
              <textarea
                id="consent-text"
                rows={8}
                readOnly
                className={`${input} resize-y`}
                defaultValue={`I/We warrant and confirm that the information given in the mortgage application form is true and correct and understand that it is being used to determine credit responsibility and to evaluate and respond to my/our request for mortgage financing. You are authorized to obtain any information you may require for these purposes from other sources (including, for example, credit bureau) and each source is hereby authorized to provide you with such information. I/We also understand, acknowledge and agree that the information given in the mortgage application form as well as other information you obtain in relation to my/our credit history may be disclosed to potential mortgage financiers, mortgage insurers, other service providers, organizations providing technological or other support services required in relation to this application and any other parties with whom I/We propose to have a financial relationship.

I/We further acknowledge and agree that each potential mortgage financier, mortgage insurer or service provider to whom you provide the mortgage application and/or my/our personal information is permitted to maintain records and to hold, use, communicate and disclose personal information about me/us for the purposes of recording, evaluating and responding to my/our application for mortgage financing or related activities.`}
                {...register('consent-text')}
              />
            </div>

            <div className={grid}>
              <div>
                <label htmlFor="sign-app-name" className={label}>
                  Applicant signature (type name)
                </label>
                <input
                  id="sign-app-name"
                  placeholder="Full legal name"
                  {...register('sign-app-name')}
                  className={input}
                />
              </div>
              <div>
                <label htmlFor="sign-app-date" className={label}>
                  Date
                </label>
                <input
                  id="sign-app-date"
                  type="date"
                  {...register('sign-app-date')}
                  className={input}
                />
              </div>
              <div>
                <label htmlFor="sign-co-name" className={label}>
                  Co-applicant signature (type name)
                </label>
                <input
                  id="sign-co-name"
                  placeholder="Full legal name"
                  {...register('sign-co-name')}
                  className={input}
                />
              </div>
              <div>
                <label htmlFor="sign-co-date" className={label}>
                  Date
                </label>
                <input
                  id="sign-co-date"
                  type="date"
                  {...register('sign-co-date')}
                  className={input}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={fillDemo}
            className="rounded border px-3 py-2 text-sm"
          >
            Fill with sample data
          </button>
          <button
            type="button"
            onClick={() => {
              onCancel();
              clearAll();
            }}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700/40"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 dark:bg-gray-100 dark:text-gray-900"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
