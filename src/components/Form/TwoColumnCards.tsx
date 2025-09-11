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
  // Section toggles
  const [appIdent, toggleAppIdent] = useAccordion(true);
  const [appEmp, toggleAppEmp] = useAccordion(true);
  const [refSec, toggleRefSec] = useAccordion(true);
  const [coAppIdent, toggleCoAppIdent] = useAccordion(false);
  const [coAppEmp, toggleCoAppEmp] = useAccordion(false);
  const [assets, toggleAssets] = useAccordion(true);
  const [liabs, toggleLiabs] = useAccordion(true);
  const [networth, toggleNetworth] = useAccordion(true);
  const [decls, toggleDecls] = useAccordion(true);
  const [consent, toggleConsent] = useAccordion(true);

  // Co-applicant enable
  const [hasCoApplicant, setHasCoApplicant] = useState(false);
  const [coapplicantAddress, setCoapplicantAddress] = useState(false);

  // Generic submit handler: collapse on save
  function makeOnSubmit(toggle: (next?: boolean) => void) {
    return (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      toggle(false);
    };
  }

  return (
    <div className="min-h-screen divide-y divide-gray-900/10 bg-gray-50 p-10 dark:bg-gray-900">
      {/* Applicant — Identity & Contact */}
      <SectionCard
        title="Applicant — Identity & Contact"
        description="Core details about you and where we can reach you."
        open={appIdent.open}
        onToggle={() => toggleAppIdent()}
        onSubmit={makeOnSubmit(toggleAppIdent)}
      >
        <div className="grid max-w-3xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <PreviewClamp open={appIdent.open} previewCount={2}>
            {/* Name (group first+last together at top) */}
            <div className="sm:col-span-3">
              <label
                htmlFor="app-first"
                className="block text-sm/6 font-medium text-gray-900"
              >
                First name
              </label>
              <div className="mt-2">
                <TextInput id="app-first" autoComplete="given-name" />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="app-last"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Last name
              </label>
              <div className="mt-2">
                <TextInput id="app-last" autoComplete="family-name" />
              </div>
            </div>

            <div className="sm:col-span-2">
              <Field id="app-dob" label="Date of birth">
                <TextInput id="app-dob" type="date" />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field id="app-sin" label="SIN (optional)">
                <TextInput id="app-sin" type="text" placeholder="###-###-###" />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field id="app-status" label="Residency status">
                <Select
                  id="app-status"
                  options={[
                    'Citizen',
                    'Permanent Resident',
                    'Work Permit',
                    'Other',
                  ]}
                />
              </Field>
            </div>

            <div className="sm:col-span-3">
              <Field id="app-email" label="Email">
                <TextInput id="app-email" type="email" autoComplete="email" />
              </Field>
            </div>

            <div className="sm:col-span-3">
              <Field id="app-phone" label="Mobile phone">
                <TextInput id="app-phone" type="tel" autoComplete="tel" />
              </Field>
            </div>

            <Field id="app-street" label="Street address">
              <TextInput id="app-street" autoComplete="street-address" />
            </Field>

            <div className="sm:col-span-2 sm:col-start-1">
              <Field id="app-city" label="City">
                <TextInput id="app-city" autoComplete="address-level2" />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field id="app-province" label="Province / State">
                <TextInput id="app-province" autoComplete="address-level1" />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field id="app-postal" label="Postal / ZIP">
                <TextInput id="app-postal" autoComplete="postal-code" />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field id="app-occupancy" label="Own / Rent">
                <Select
                  id="app-occupancy"
                  options={['Own', 'Rent', 'With Family']}
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field
                id="app-housing-payment"
                label="Monthly housing payment ($)"
              >
                <TextInput id="app-housing-payment" type="number" />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field id="app-tenure" label="How long at address? (years)">
                <TextInput id="app-tenure" type="number" />
              </Field>
            </div>

            {/* Previous address (optional) */}
            <Field id="app-prev-street" label="Previous address (if < 2 yrs)">
              <TextInput id="app-prev-street" />
            </Field>
            <div className="sm:col-span-2 sm:col-start-1">
              <Field id="app-prev-city" label="Prev. City">
                <TextInput id="app-prev-city" />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field id="app-prev-province" label="Prev. Province">
                <TextInput id="app-prev-province" />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field id="app-prev-postal" label="Prev. Postal">
                <TextInput id="app-prev-postal" />
              </Field>
            </div>
          </PreviewClamp>
        </div>
      </SectionCard>

      {/* Applicant — Employment */}
      <SectionCard
        title="Applicant — Employment"
        description="Your current job and income details."
        open={appEmp.open}
        onToggle={() => toggleAppEmp()}
        onSubmit={makeOnSubmit(toggleAppEmp)}
      >
        <div className="grid max-w-3xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <PreviewClamp open={appEmp.open} previewCount={1}>
            <Field id="emp-employer" label="Employer name">
              <TextInput id="emp-employer" />
            </Field>

            <div className="sm:col-span-3">
              <Field id="emp-position" label="Position / Title">
                <TextInput id="emp-position" />
              </Field>
            </div>

            <div className="sm:col-span-3">
              <Field id="emp-paytype" label="Pay type">
                <Select
                  id="emp-paytype"
                  options={[
                    'Salary',
                    'Hourly',
                    'Commission',
                    'Contract',
                    'Self-employed',
                  ]}
                />
              </Field>
            </div>

            <div className="sm:col-span-3">
              <Field id="emp-income" label="Annual income ($)">
                <TextInput id="emp-income" type="number" />
              </Field>
            </div>

            <div className="sm:col-span-3">
              <Field id="emp-tenure" label="Time in role (years)">
                <TextInput id="emp-tenure" type="number" />
              </Field>
            </div>

            <Field id="emp-street" label="Employer address">
              <TextInput id="emp-street" />
            </Field>
            <div className="sm:col-span-2 sm:col-start-1">
              <Field id="emp-city" label="City">
                <TextInput id="emp-city" />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field id="emp-province" label="Province / State">
                <TextInput id="emp-province" />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field id="emp-postal" label="Postal / ZIP">
                <TextInput id="emp-postal" />
              </Field>
            </div>

            {/* Previous employer */}
            <Field
              id="emp-prev-employer"
              label="Previous employer (if < 2 yrs)"
            >
              <TextInput id="emp-prev-employer" />
            </Field>
            <div className="sm:col-span-3">
              <Field id="emp-prev-position" label="Prev. position">
                <TextInput id="emp-prev-position" />
              </Field>
            </div>
            <div className="sm:col-span-3">
              <Field id="emp-prev-tenure" label="Prev. time in role (years)">
                <TextInput id="emp-prev-tenure" type="number" />
              </Field>
            </div>
          </PreviewClamp>
        </div>
      </SectionCard>

      {/* Personal Reference */}
      <SectionCard
        title="Personal Reference"
        description="Contact who does not live with you."
        open={refSec.open}
        onToggle={() => toggleRefSec()}
        onSubmit={makeOnSubmit(toggleRefSec)}
      >
        <div className="grid max-w-3xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <PreviewClamp open={refSec.open} previewCount={1}>
            <div className="sm:col-span-3">
              <Field id="ref-name" label="Reference name">
                <TextInput id="ref-name" />
              </Field>
            </div>
            <div className="sm:col-span-3">
              <Field id="ref-relationship" label="Relationship">
                <TextInput id="ref-relationship" />
              </Field>
            </div>
            <div className="sm:col-span-3">
              <Field id="ref-phone" label="Phone">
                <TextInput id="ref-phone" type="tel" />
              </Field>
            </div>
            <div className="sm:col-span-3">
              <Field id="ref-email" label="Email (optional)">
                <TextInput id="ref-email" type="email" />
              </Field>
            </div>
            <Field id="ref-street" label="Reference address">
              <TextInput id="ref-street" />
            </Field>
            <div className="sm:col-span-2 sm:col-start-1">
              <Field id="ref-city" label="City">
                <TextInput id="ref-city" />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field id="ref-province" label="Province / State">
                <TextInput id="ref-province" />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field id="ref-postal" label="Postal / ZIP">
                <TextInput id="ref-postal" />
              </Field>
            </div>
          </PreviewClamp>
        </div>
      </SectionCard>

      {/* Toggle for Co-Applicant */}
      <div className="mx-auto flex py-6">
        <Checkbox
          id="has-coapp"
          label="Add co-applicant / guarantor"
          description="Include co-applicant sections below"
          defaultChecked={hasCoApplicant}
          clickHandler={() => setHasCoApplicant((v) => !v)}
        />
        {hasCoApplicant && (
          <Checkbox
            id="has-coapp-address"
            label="Same address?"
            clickHandler={() => setCoapplicantAddress((v) => !v)}
          />
        )}
      </div>

      {/* Co-Applicant — Identity & Contact (Conditional) */}
      {hasCoApplicant && (
        <SectionCard
          title="Co-Applicant — Identity & Contact"
          description="Details for the co-applicant or guarantor."
          open={coAppIdent.open}
          onToggle={() => toggleCoAppIdent()}
          onSubmit={makeOnSubmit(toggleCoAppIdent)}
        >
          <div className="grid max-w-3xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <PreviewClamp open={coAppIdent.open} previewCount={2}>
              <div className="sm:col-span-3">
                <Field id="co-first" label="First name">
                  <TextInput id="co-first" />
                </Field>
              </div>
              <div className="sm:col-span-3">
                <Field id="co-last" label="Last name">
                  <TextInput id="co-last" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field id="co-dob" label="Date of birth">
                  <TextInput id="co-dob" type="date" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field id="co-sin" label="SIN (optional)">
                  <TextInput id="co-sin" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field id="co-status" label="Residency status">
                  <Select
                    id="co-status"
                    options={[
                      'Citizen',
                      'Permanent Resident',
                      'Work Permit',
                      'Other',
                    ]}
                  />
                </Field>
              </div>
              <div className="sm:col-span-3">
                <Field id="co-email" label="Email">
                  <TextInput id="co-email" type="email" />
                </Field>
              </div>
              <div className="sm:col-span-3">
                <Field id="co-phone" label="Mobile phone">
                  <TextInput id="co-phone" type="tel" />
                </Field>
              </div>

              <Field id="co-street" label="Street address">
                <TextInput id="co-street" />
              </Field>
              <div className="sm:col-span-2 sm:col-start-1">
                <Field id="co-city" label="City">
                  <TextInput id="co-city" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field id="co-province" label="Province / State">
                  <TextInput id="co-province" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field id="co-postal" label="Postal / ZIP">
                  <TextInput id="co-postal" />
                </Field>
              </div>

              <div className="sm:col-span-2">
                <Field id="co-occupancy" label="Own / Rent">
                  <Select
                    id="co-occupancy"
                    options={['Own', 'Rent', 'With Family']}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field
                  id="co-housing-payment"
                  label="Monthly housing payment ($)"
                >
                  <TextInput id="co-housing-payment" type="number" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field id="co-tenure" label="How long at address? (years)">
                  <TextInput id="co-tenure" type="number" />
                </Field>
              </div>

              {/* Previous address */}
              <Field id="co-prev-street" label="Previous address (if < 2 yrs)">
                <TextInput id="co-prev-street" />
              </Field>
              <div className="sm:col-span-2 sm:col-start-1">
                <Field id="co-prev-city" label="Prev. City">
                  <TextInput id="co-prev-city" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field id="co-prev-province" label="Prev. Province">
                  <TextInput id="co-prev-province" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field id="co-prev-postal" label="Prev. Postal">
                  <TextInput id="co-prev-postal" />
                </Field>
              </div>
            </PreviewClamp>
          </div>
        </SectionCard>
      )}

      {/* Co-Applicant — Employment (Conditional) */}
      {hasCoApplicant && (
        <SectionCard
          title="Co-Applicant — Employment"
          description="Co-applicant job and income details."
          open={coAppEmp.open}
          onToggle={() => toggleCoAppEmp()}
          onSubmit={makeOnSubmit(toggleCoAppEmp)}
        >
          <div className="grid max-w-3xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <PreviewClamp open={coAppEmp.open} previewCount={2}>
              <Field id="co-emp-employer" label="Employer name">
                <TextInput id="co-emp-employer" />
              </Field>
              <div className="sm:col-span-3">
                <Field id="co-emp-position" label="Position / Title">
                  <TextInput id="co-emp-position" />
                </Field>
              </div>
              <div className="sm:col-span-3">
                <Field id="co-emp-paytype" label="Pay type">
                  <Select
                    id="co-emp-paytype"
                    options={[
                      'Salary',
                      'Hourly',
                      'Commission',
                      'Contract',
                      'Self-employed',
                    ]}
                  />
                </Field>
              </div>
              <div className="sm:col-span-3">
                <Field id="co-emp-income" label="Annual income ($)">
                  <TextInput id="co-emp-income" type="number" />
                </Field>
              </div>
              <div className="sm:col-span-3">
                <Field id="co-emp-tenure" label="Time in role (years)">
                  <TextInput id="co-emp-tenure" type="number" />
                </Field>
              </div>

              {/* Employer address */}
              <Field id="co-emp-street" label="Employer address">
                <TextInput id="co-emp-street" />
              </Field>
              <div className="sm:col-span-2 sm:col-start-1">
                <Field id="co-emp-city" label="City">
                  <TextInput id="co-emp-city" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field id="co-emp-province" label="Province / State">
                  <TextInput id="co-emp-province" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field id="co-emp-postal" label="Postal / ZIP">
                  <TextInput id="co-emp-postal" />
                </Field>
              </div>

              {/* Previous employer */}
              <Field
                id="co-emp-prev-employer"
                label="Previous employer (if < 2 yrs)"
              >
                <TextInput id="co-emp-prev-employer" />
              </Field>
              <div className="sm:col-span-3">
                <Field id="co-emp-prev-position" label="Prev. position">
                  <TextInput id="co-emp-prev-position" />
                </Field>
              </div>
              <div className="sm:col-span-3">
                <Field
                  id="co-emp-prev-tenure"
                  label="Prev. time in role (years)"
                >
                  <TextInput id="co-emp-prev-tenure" type="number" />
                </Field>
              </div>
            </PreviewClamp>
          </div>
        </SectionCard>
      )}

      {/* Assets */}
      <SectionCard
        title="Assets"
        description="What you own — balances and values."
        open={assets.open}
        onToggle={() => toggleAssets()}
        onSubmit={makeOnSubmit(toggleAssets)}
      >
        <div className="grid max-w-4xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <PreviewClamp open={assets.open} previewCount={2}>
            {/* Bank accounts */}
            <div className="sm:col-span-3">
              <Field id="asset-bank-name-1" label="Bank account — institution">
                <TextInput
                  id="asset-bank-name-1"
                  placeholder="e.g., RBC Chequing"
                />
              </Field>
            </div>
            <div className="sm:col-span-3">
              <Field id="asset-bank-balance-1" label="Current balance ($)">
                <TextInput id="asset-bank-balance-1" type="number" />
              </Field>
            </div>

            {/* Investments */}
            <div className="sm:col-span-3">
              <Field id="asset-invest-type-1" label="Investment — type">
                <TextInput
                  id="asset-invest-type-1"
                  placeholder="RRSP / TFSA / Non-registered"
                />
              </Field>
            </div>
            <div className="sm:col-span-3">
              <Field id="asset-invest-amount-1" label="Current amount ($)">
                <TextInput id="asset-invest-amount-1" type="number" />
              </Field>
            </div>

            {/* Real Estate */}
            <div className="sm:col-span-3">
              <Field id="asset-re-type-1" label="Real estate — type">
                <Select
                  id="asset-re-type-1"
                  options={['Detached', 'Semi', 'Townhome', 'Condo', 'Other']}
                />
              </Field>
            </div>
            <div className="sm:col-span-3">
              <Field id="asset-re-value-1" label="Market value ($)">
                <TextInput id="asset-re-value-1" type="number" />
              </Field>
            </div>

            {/* Vehicles */}
            <div className="sm:col-span-3">
              <Field id="asset-vehicle-status-1" label="Vehicle — status">
                <Select
                  id="asset-vehicle-status-1"
                  options={['Owned', 'Financed', 'Leased']}
                />
              </Field>
            </div>
            <div className="sm:col-span-3">
              <Field id="asset-vehicle-value-1" label="Estimated value ($)">
                <TextInput id="asset-vehicle-value-1" type="number" />
              </Field>
            </div>

            {/* Other assets */}
            <div className="sm:col-span-3">
              <Field id="asset-other-desc-1" label="Other asset — description">
                <TextInput
                  id="asset-other-desc-1"
                  placeholder="e.g., Jewelry, collectibles"
                />
              </Field>
            </div>
            <div className="sm:col-span-3">
              <Field id="asset-other-value-1" label="Estimated value ($)">
                <TextInput id="asset-other-value-1" type="number" />
              </Field>
            </div>
          </PreviewClamp>
        </div>
      </SectionCard>

      {/* Liabilities */}
      <SectionCard
        title="Liabilities"
        description="What you owe — balances and monthly payments."
        open={liabs.open}
        onToggle={() => toggleLiabs()}
        onSubmit={makeOnSubmit(toggleLiabs)}
      >
        <div className="grid max-w-4xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <PreviewClamp open={liabs.open} previewCount={2}>
            {/* Credit cards */}
            <div className="sm:col-span-3">
              <Field id="debt-cc-desc-1" label="Credit card — description">
                <TextInput id="debt-cc-desc-1" placeholder="e.g., TD Visa" />
              </Field>
            </div>
            <div className="sm:col-span-3">
              <Field id="debt-cc-balance-1" label="Balance ($)">
                <TextInput id="debt-cc-balance-1" type="number" />
              </Field>
            </div>
            <div className="sm:col-span-3">
              <Field id="debt-cc-pay-1" label="Monthly payment ($)">
                <TextInput id="debt-cc-pay-1" type="number" />
              </Field>
            </div>

            {/* Loans / LOC / Auto */}
            <div className="sm:col-span-3">
              <Field
                id="debt-loan-desc-1"
                label="Loan / LOC / Auto — description"
              >
                <TextInput id="debt-loan-desc-1" placeholder="e.g., RBC LOC" />
              </Field>
            </div>
            <div className="sm:col-span-3">
              <Field id="debt-loan-balance-1" label="Balance ($)">
                <TextInput id="debt-loan-balance-1" type="number" />
              </Field>
            </div>
            <div className="sm:col-span-3">
              <Field id="debt-loan-pay-1" label="Monthly payment ($)">
                <TextInput id="debt-loan-pay-1" type="number" />
              </Field>
            </div>

            {/* Mortgages */}
            <div className="sm:col-span-3">
              <Field id="debt-mortgage-desc-1" label="Mortgage — description">
                <TextInput
                  id="debt-mortgage-desc-1"
                  placeholder="e.g., Primary residence"
                />
              </Field>
            </div>
            <div className="sm:col-span-3">
              <Field id="debt-mortgage-balance-1" label="Balance ($)">
                <TextInput id="debt-mortgage-balance-1" type="number" />
              </Field>
            </div>
            <div className="sm:col-span-3">
              <Field id="debt-mortgage-pay-1" label="Monthly payment ($)">
                <TextInput id="debt-mortgage-pay-1" type="number" />
              </Field>
            </div>

            {/* Other liabilities */}
            <div className="sm:col-span-3">
              <Field
                id="debt-other-desc-1"
                label="Other liability — description"
              >
                <TextInput id="debt-other-desc-1" />
              </Field>
            </div>
            <div className="sm:col-span-3">
              <Field id="debt-other-balance-1" label="Current balance ($)">
                <TextInput id="debt-other-balance-1" type="number" />
              </Field>
            </div>
          </PreviewClamp>
        </div>
      </SectionCard>

      {/* Net Worth (read-only placeholder) */}
      <SectionCard
        title="Net Worth"
        description="Calculated values (to be wired later)."
        open={networth.open}
        onToggle={() => toggleNetworth()}
        onSubmit={makeOnSubmit(toggleNetworth)}
      >
        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <PreviewClamp open={networth.open} previewCount={1}>
            <div className="sm:col-span-2">
              <Field id="nw-assets" label="Total Assets ($)">
                <TextInput
                  id="nw-assets"
                  type="number"
                  placeholder="Auto-calculated later"
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field id="nw-liabs" label="Total Liabilities ($)">
                <TextInput
                  id="nw-liabs"
                  type="number"
                  placeholder="Auto-calculated later"
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field id="nw-net" label="Net Worth ($)">
                <TextInput
                  id="nw-net"
                  type="number"
                  placeholder="Auto-calculated later"
                />
              </Field>
            </div>
          </PreviewClamp>
        </div>
      </SectionCard>

      {/* Declarations */}
      <SectionCard
        title="Declarations"
        description="Answer truthfully — this affects eligibility."
        open={decls.open}
        onToggle={() => toggleDecls()}
        onSubmit={makeOnSubmit(toggleDecls)}
      >
        <div className="max-w-2xl space-y-10 md:col-span-2">
          <PreviewClamp open={decls.open} previewCount={1}>
            <fieldset>
              <legend className="text-sm/6 font-semibold text-gray-900">
                Applicant
              </legend>
              <div className="mt-6 space-y-6">
                <Radio
                  id="app-bankruptcy-no"
                  name="app-bankruptcy"
                  label="No bankruptcy / court judgment"
                />
                <Radio
                  id="app-bankruptcy-yes"
                  name="app-bankruptcy"
                  label="Yes — specify year below"
                />
                <div className="mt-2">
                  <TextInput
                    id="app-bankruptcy-year"
                    type="number"
                    placeholder="Year (if yes)"
                  />
                </div>
              </div>
            </fieldset>

            {hasCoApplicant && (
              <fieldset>
                <legend className="text-sm/6 font-semibold text-gray-900">
                  Co-Applicant
                </legend>
                <div className="mt-6 space-y-6">
                  <Radio
                    id="co-bankruptcy-no"
                    name="co-bankruptcy"
                    label="No bankruptcy / court judgment"
                  />
                  <Radio
                    id="co-bankruptcy-yes"
                    name="co-bankruptcy"
                    label="Yes — specify year below"
                  />
                  <div className="mt-2">
                    <TextInput
                      id="co-bankruptcy-year"
                      type="number"
                      placeholder="Year (if yes)"
                    />
                  </div>
                </div>
              </fieldset>
            )}
          </PreviewClamp>
        </div>
      </SectionCard>

      {/* Consent & Signatures */}
      <SectionCard
        title="Consent & Signatures"
        description="Authorization and consent to verify information."
        open={consent.open}
        onToggle={() => toggleConsent()}
        onSubmit={makeOnSubmit(toggleConsent)}
      >
        <div className="grid max-w-3xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <PreviewClamp open={consent.open} previewCount={1}>
            <Field id="consent-text" label="Consent text">
              <div className="text-xs">
                <p className="my-2">
                  {hasCoApplicant ? 'We ' : 'I '} warrant and confirm that the
                  information given in the mortgage application form is true and
                  correct and {hasCoApplicant ? 'we ' : 'I '} understand that it
                  is being used to determine {hasCoApplicant ? 'our ' : 'my '}{' '}
                  credit responsibility and to evaluate and respond to{' '}
                  {hasCoApplicant ? 'our ' : 'my '}
                  request for mortgage financing. You are authorized to obtain
                  any information you may require for these purposes from other
                  sources (including, for example, credit bureau) and each
                  source is hereby authorized to provide you with such
                  information. {hasCoApplicant ? 'We ' : 'I '} also understand,
                  acknowledge and agree that the information given in the
                  mortgage application form as well as other information you
                  obtain in relation to {hasCoApplicant ? 'our ' : 'my '} credit
                  history may be disclosed to potential mortgage financiers,
                  mortgage insurers, other service providers, organizations
                  providing technological or other support services required in
                  relation to this application and any other parties with whom
                  {hasCoApplicant ? 'we ' : 'I '} propose to have a financial
                  relationship.{' '}
                </p>
                <p className="my-2">
                  {hasCoApplicant ? 'We ' : 'I '} further acknowledge and agree
                  that each potential mortgage financier, mortgage insurer or
                  service provider to whom you provide the mortgage application
                  and/or {hasCoApplicant ? 'our ' : 'my '}
                  personal information is permitted to receive such application
                  and information and maintain records relating to{' '}
                  {hasCoApplicant ? 'us ' : 'me '} and
                  {hasCoApplicant ? 'our ' : 'my '} mortgage application and to
                  hold, use, communicate and disclose personal information about
                  {hasCoApplicant ? 'us ' : 'me '}, including{' '}
                  {hasCoApplicant ? 'our ' : 'my '}
                  Social Insurance Number (SIN) if{' '}
                  {hasCoApplicant ? 'we ' : 'I '} provide it, and collect
                  personal information from {hasCoApplicant ? 'us ' : 'me '},
                  you and from third persons, including credit bureau, credit
                  reporting and collection agencies, financial institutions,{' '}
                  {hasCoApplicant ? 'our ' : 'my '} past and present employers,
                  creditors and tenants, {hasCoApplicant ? 'our ' : 'my '}{' '}
                  spouse or any other person who has information about{' '}
                  {hasCoApplicant ? 'us ' : 'me '} for the purposes of
                  recording, evaluating and responding to{' '}
                  {hasCoApplicant ? 'our ' : 'my '} application for mortgage
                  financing or related activities and{' '}
                  {hasCoApplicant ? 'we ' : 'I '} specifically consent to the
                  release and disclosure of personal information by such persons
                  to and among you and each potential mortgage financier,
                  mortgage insurer or other service provider.
                </p>
              </div>
            </Field>

            <div className="sm:col-span-3">
              <Field id="sign-app-name" label="Applicant signature (type name)">
                <TextInput id="sign-app-name" placeholder="Full legal name" />
              </Field>
            </div>
            <div className="sm:col-span-3">
              <Field id="sign-app-date" label="Date">
                <TextInput id="sign-app-date" type="date" />
              </Field>
            </div>

            {hasCoApplicant && (
              <>
                <div className="sm:col-span-3">
                  <Field
                    id="sign-co-name"
                    label="Co-applicant signature (type name)"
                  >
                    <TextInput
                      id="sign-co-name"
                      placeholder="Full legal name"
                    />
                  </Field>
                </div>
                <div className="sm:col-span-3">
                  <Field id="sign-co-date" label="Date">
                    <TextInput id="sign-co-date" type="date" />
                  </Field>
                </div>
              </>
            )}

            {/* Optional: upload signature images */}
            <div className="col-span-full">
              <label className="block text-sm/6 font-medium text-gray-900">
                Upload signature image (optional)
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <UserCircleIcon
                  aria-hidden="true"
                  className="size-12 text-gray-300"
                />
                <FileDrop id="sign-file" />
              </div>
            </div>
          </PreviewClamp>
        </div>
      </SectionCard>
    </div>
  );
}
