// app/components/MortgageApplicationForm.tsx
'use client';
import React from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';

import SectionCard from './SectionCard';
import Field from './Field';
import TextInput from './TextInput';
import TextArea from './TextArea';
import Select from './Select';
import Checkbox from './Checkbox';
import Radio from './Radio';
import FileDrop from './FileDrop';
import { UserCircleIcon } from '@heroicons/react/24/solid';

// ---------- Helpers: small RHF field wrappers (keep your existing classNames) ----------
function InputField({
  name,
  label,
  ...rest
}: { name: string; label: string } & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'id' | 'name'
>) {
  const { register } = useFormContext();
  return (
    <div className="col-span-full">
      <label
        htmlFor={name}
        className="block text-sm/6 font-medium text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2">
        <TextInput id={name} {...register(name)} {...rest} />
      </div>
    </div>
  );
}

function TextareaField({
  name,
  label,
  rows = 3,
  ...rest
}: { name: string; label: string; rows?: number } & Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'id' | 'name'
>) {
  const { register } = useFormContext();
  return (
    <div className="col-span-full">
      <label
        htmlFor={name}
        className="block text-sm/6 font-medium text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2">
        <TextArea id={name} rows={rows} {...register(name)} {...rest} />
      </div>
    </div>
  );
}

function SelectField({
  name,
  label,
  options,
  ...rest
}: { name: string; label: string; options: string[] } & Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'id' | 'name'
>) {
  const { register } = useFormContext();
  return (
    <div className="col-span-full">
      <label
        htmlFor={name}
        className="block text-sm/6 font-medium text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2">
        <Select id={name} options={options} {...register(name)} {...rest} />
      </div>
    </div>
  );
}

function CheckboxField({
  name,
  label,
  description,
  ...rest
}: { name: string; label: string; description?: string } & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'id' | 'name' | 'type'
>) {
  const { register } = useFormContext();
  return (
    <div className="col-span-full">
      <Checkbox
        id={name}
        label={label}
        description={description}
        {...register(name)}
        {...rest}
      />
    </div>
  );
}

function RadioField({
  name,
  id,
  value,
  label,
  ...rest
}: {
  name: string;
  id: string;
  value: string;
  label: string;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'name' | 'id' | 'value'
>) {
  const { register } = useFormContext();
  return (
    <Radio id={id} label={label} value={value} {...register(name)} {...rest} />
  );
}

// ---------- Main form ----------
type SectionKey =
  | 'applicant'
  | 'employment'
  | 'reference'
  | 'coApplicant'
  | 'coEmployment'
  | 'assets'
  | 'liabilities'
  | 'declarations'
  | 'consent'
  | 'networth';

export default function MortgageApplicationForm() {
  // We’ll keep names as simple strings (matching your original IDs), registered into RHF.
  // This yields an object { [field: string]: any } on submit.
  const methods = useForm<Record<string, any>>({
    defaultValues: {
      // toggles
      'has-coapp': false,
      'has-coapp-address': false,

      // applicant
      'app-first': '',
      'app-last': '',
      'app-dob': '',
      'app-sin': '',
      'app-status': '',
      'app-email': '',
      'app-phone': '',
      'app-street': '',
      'app-city': '',
      'app-province': '',
      'app-postal': '',
      'app-occupancy': '',
      'app-housing-payment': '',
      'app-tenure': '',
      'app-prev-street': '',
      'app-prev-city': '',
      'app-prev-province': '',
      'app-prev-postal': '',

      // employment
      'emp-employer': '',
      'emp-position': '',
      'emp-paytype': '',
      'emp-income': '',
      'emp-tenure': '',
      'emp-street': '',
      'emp-city': '',
      'emp-province': '',
      'emp-postal': '',
      'emp-prev-employer': '',
      'emp-prev-position': '',
      'emp-prev-tenure': '',

      // reference
      'ref-name': '',
      'ref-relationship': '',
      'ref-phone': '',
      'ref-email': '',
      'ref-street': '',
      'ref-city': '',
      'ref-province': '',
      'ref-postal': '',

      // co-applicant
      'co-first': '',
      'co-last': '',
      'co-dob': '',
      'co-sin': '',
      'co-status': '',
      'co-email': '',
      'co-phone': '',
      'co-street': '',
      'co-city': '',
      'co-province': '',
      'co-postal': '',
      'co-occupancy': '',
      'co-housing-payment': '',
      'co-tenure': '',
      'co-prev-street': '',
      'co-prev-city': '',
      'co-prev-province': '',
      'co-prev-postal': '',

      // co-employment
      'co-emp-employer': '',
      'co-emp-position': '',
      'co-emp-paytype': '',
      'co-emp-income': '',
      'co-emp-tenure': '',
      'co-emp-street': '',
      'co-emp-city': '',
      'co-emp-province': '',
      'co-emp-postal': '',
      'co-emp-prev-employer': '',
      'co-emp-prev-position': '',
      'co-emp-prev-tenure': '',

      // assets (first rows)
      'asset-bank-name-1': '',
      'asset-bank-balance-1': '',
      'asset-invest-type-1': '',
      'asset-invest-amount-1': '',
      'asset-re-type-1': '',
      'asset-re-value-1': '',
      'asset-vehicle-status-1': '',
      'asset-vehicle-value-1': '',
      'asset-other-desc-1': '',
      'asset-other-value-1': '',

      // liabilities (first rows)
      'debt-cc-desc-1': '',
      'debt-cc-balance-1': '',
      'debt-cc-pay-1': '',
      'debt-loan-desc-1': '',
      'debt-loan-balance-1': '',
      'debt-loan-pay-1': '',
      'debt-mortgage-desc-1': '',
      'debt-mortgage-balance-1': '',
      'debt-mortgage-pay-1': '',
      'debt-other-desc-1': '',
      'debt-other-balance-1': '',

      // net worth placeholders
      'nw-assets': '',
      'nw-liabs': '',
      'nw-net': '',

      // declarations
      'app-bankruptcy': 'no',
      'app-bankruptcy-year': '',
      'co-bankruptcy': 'no',
      'co-bankruptcy-year': '',

      // consent/signatures
      'sign-app-name': '',
      'sign-app-date': '',
      'sign-co-name': '',
      'sign-co-date': '',
    },
    shouldUnregister: false,
  });

  const {
    handleSubmit,
    getValues,
    setValue,
    resetField,
    watch,
    formState: { isSubmitting },
  } = methods;

  // open/close accordions (presentational)
  const [open, setOpen] = React.useState<Record<SectionKey, boolean>>({
    applicant: true,
    employment: true,
    reference: true,
    coApplicant: false,
    coEmployment: false,
    assets: true,
    liabilities: true,
    networth: true,
    declarations: true,
    consent: true,
  });
  const toggle = (key: SectionKey) =>
    setOpen((o) => ({ ...o, [key]: !o[key] }));

  // Per-section cache (memory)
  const [sectionCache, setSectionCache] = React.useState<
    Partial<Record<SectionKey, Partial<Record<string, any>>>>
  >({});

  // Section field lists (straight from your original form)
  const FIELDS: Record<SectionKey, string[]> = {
    applicant: [
      'app-first',
      'app-last',
      'app-dob',
      'app-sin',
      'app-status',
      'app-email',
      'app-phone',
      'app-street',
      'app-city',
      'app-province',
      'app-postal',
      'app-occupancy',
      'app-housing-payment',
      'app-tenure',
      'app-prev-street',
      'app-prev-city',
      'app-prev-province',
      'app-prev-postal',
    ],
    employment: [
      'emp-employer',
      'emp-position',
      'emp-paytype',
      'emp-income',
      'emp-tenure',
      'emp-street',
      'emp-city',
      'emp-province',
      'emp-postal',
      'emp-prev-employer',
      'emp-prev-position',
      'emp-prev-tenure',
    ],
    reference: [
      'ref-name',
      'ref-relationship',
      'ref-phone',
      'ref-email',
      'ref-street',
      'ref-city',
      'ref-province',
      'ref-postal',
    ],
    coApplicant: [
      'co-first',
      'co-last',
      'co-dob',
      'co-sin',
      'co-status',
      'co-email',
      'co-phone',
      'co-street',
      'co-city',
      'co-province',
      'co-postal',
      'co-occupancy',
      'co-housing-payment',
      'co-tenure',
      'co-prev-street',
      'co-prev-city',
      'co-prev-province',
      'co-prev-postal',
    ],
    coEmployment: [
      'co-emp-employer',
      'co-emp-position',
      'co-emp-paytype',
      'co-emp-income',
      'co-emp-tenure',
      'co-emp-street',
      'co-emp-city',
      'co-emp-province',
      'co-emp-postal',
      'co-emp-prev-employer',
      'co-emp-prev-position',
      'co-emp-prev-tenure',
    ],
    assets: [
      'asset-bank-name-1',
      'asset-bank-balance-1',
      'asset-invest-type-1',
      'asset-invest-amount-1',
      'asset-re-type-1',
      'asset-re-value-1',
      'asset-vehicle-status-1',
      'asset-vehicle-value-1',
      'asset-other-desc-1',
      'asset-other-value-1',
    ],
    liabilities: [
      'debt-cc-desc-1',
      'debt-cc-balance-1',
      'debt-cc-pay-1',
      'debt-loan-desc-1',
      'debt-loan-balance-1',
      'debt-loan-pay-1',
      'debt-mortgage-desc-1',
      'debt-mortgage-balance-1',
      'debt-mortgage-pay-1',
      'debt-other-desc-1',
      'debt-other-balance-1',
    ],
    networth: ['nw-assets', 'nw-liabs', 'nw-net'],
    declarations: [
      'app-bankruptcy',
      'app-bankruptcy-year',
      'co-bankruptcy',
      'co-bankruptcy-year',
    ],
    consent: ['sign-app-name', 'sign-app-date', 'sign-co-name', 'sign-co-date'],
  };

  // Save a section (snapshot)
  const saveSection = (key: SectionKey) => {
    const names = FIELDS[key];
    const snapshot: Record<string, any> = {};
    names.forEach((n) => (snapshot[n] = getValues(n)));
    setSectionCache((m) => ({ ...m, [key]: snapshot }));
  };

  // Cancel a section (restore or clear)
  const emptyFor = (name: string) => ''; // simple rule; adjust per-field if needed
  const cancelSection = (key: SectionKey) => {
    const names = FIELDS[key];
    const cached = sectionCache[key];
    if (cached) {
      names.forEach((n) =>
        setValue(n, cached[n] ?? emptyFor(n), { shouldDirty: false })
      );
    } else {
      names.forEach((n) => resetField(n, { defaultValue: emptyFor(n) as any }));
    }
  };

  // Co-app toggles
  const hasCoApp = watch('has-coapp');
  const coSameAddress = watch('has-coapp-address');

  // When "Same address?" toggled ON, copy address fields from applicant → co-applicant
  React.useEffect(() => {
    if (hasCoApp && coSameAddress) {
      const copy = (from: string, to: string) =>
        setValue(to, getValues(from), { shouldDirty: true });
      copy('app-street', 'co-street');
      copy('app-city', 'co-city');
      copy('app-province', 'co-province');
      copy('app-postal', 'co-postal');
      copy('app-occupancy', 'co-occupancy');
      copy('app-housing-payment', 'co-housing-payment');
      copy('app-tenure', 'co-tenure');
    }
    // if turned OFF, we leave co-app fields as-is (user may have edited them)
  }, [hasCoApp, coSameAddress, getValues, setValue]);

  const onSubmitAll = (values: Record<string, any>) => {
    // Send everything to backend from here
    console.log('SUBMIT ALL:', values);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmitAll)}
        className="min-h-screen divide-y divide-gray-900/10 bg-gray-50 p-10 dark:bg-gray-900"
      >
        {/* Applicant — Identity & Contact */}
        <SectionCard
          title="Applicant — Identity & Contact"
          description="Core details about you and where we can reach you."
          open={open.applicant}
          onToggle={() => toggle('applicant')}
          onSaveClick={() => saveSection('applicant')}
          onCancelClick={() => cancelSection('applicant')}
        >
          <div className="grid max-w-3xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* Name */}
            <div className="sm:col-span-3">
              <InputField
                name="app-first"
                label="First name"
                autoComplete="given-name"
              />
            </div>
            <div className="sm:col-span-3">
              <InputField
                name="app-last"
                label="Last name"
                autoComplete="family-name"
              />
            </div>

            <div className="sm:col-span-2">
              <InputField name="app-dob" label="Date of birth" type="date" />
            </div>
            <div className="sm:col-span-2">
              <InputField
                name="app-sin"
                label="SIN (optional)"
                placeholder="###-###-###"
              />
            </div>
            <div className="sm:col-span-2">
              <SelectField
                name="app-status"
                label="Residency status"
                options={[
                  'Citizen',
                  'Permanent Resident',
                  'Work Permit',
                  'Other',
                ]}
              />
            </div>

            <div className="sm:col-span-3">
              <InputField
                name="app-email"
                label="Email"
                type="email"
                autoComplete="email"
              />
            </div>
            <div className="sm:col-span-3">
              <InputField
                name="app-phone"
                label="Mobile phone"
                type="tel"
                autoComplete="tel"
              />
            </div>

            <Field id="app-street" label="Street address">
              <TextInput
                id="app-street"
                {...methods.register('app-street')}
                autoComplete="street-address"
              />
            </Field>

            <div className="sm:col-span-2 sm:col-start-1">
              <InputField
                name="app-city"
                label="City"
                autoComplete="address-level2"
              />
            </div>
            <div className="sm:col-span-2">
              <InputField
                name="app-province"
                label="Province / State"
                autoComplete="address-level1"
              />
            </div>
            <div className="sm:col-span-2">
              <InputField
                name="app-postal"
                label="Postal / ZIP"
                autoComplete="postal-code"
              />
            </div>

            <div className="sm:col-span-2">
              <SelectField
                name="app-occupancy"
                label="Own / Rent"
                options={['Own', 'Rent', 'With Family']}
              />
            </div>
            <div className="sm:col-span-2">
              <InputField
                name="app-housing-payment"
                label="Monthly housing payment ($)"
                type="number"
              />
            </div>
            <div className="sm:col-span-2">
              <InputField
                name="app-tenure"
                label="How long at address? (years)"
                type="number"
              />
            </div>

            {/* Previous address */}
            <Field
              id="app-prev-street"
              label="Previous address (if &lt; 2 yrs)"
            >
              <TextInput
                id="app-prev-street"
                {...methods.register('app-prev-street')}
              />
            </Field>
            <div className="sm:col-span-2 sm:col-start-1">
              <InputField name="app-prev-city" label="Prev. City" />
            </div>
            <div className="sm:col-span-2">
              <InputField name="app-prev-province" label="Prev. Province" />
            </div>
            <div className="sm:col-span-2">
              <InputField name="app-prev-postal" label="Prev. Postal" />
            </div>
          </div>
        </SectionCard>

        {/* Applicant — Employment */}
        <SectionCard
          title="Applicant — Employment"
          description="Your current job and income details."
          open={open.employment}
          onToggle={() => toggle('employment')}
          onSaveClick={() => saveSection('employment')}
          onCancelClick={() => cancelSection('employment')}
        >
          <div className="grid max-w-3xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <Field id="emp-employer" label="Employer name">
              <TextInput
                id="emp-employer"
                {...methods.register('emp-employer')}
              />
            </Field>

            <div className="sm:col-span-3">
              <InputField name="emp-position" label="Position / Title" />
            </div>
            <div className="sm:col-span-3">
              <SelectField
                name="emp-paytype"
                label="Pay type"
                options={[
                  'Salary',
                  'Hourly',
                  'Commission',
                  'Contract',
                  'Self-employed',
                ]}
              />
            </div>
            <div className="sm:col-span-3">
              <InputField
                name="emp-income"
                label="Annual income ($)"
                type="number"
              />
            </div>
            <div className="sm:col-span-3">
              <InputField
                name="emp-tenure"
                label="Time in role (years)"
                type="number"
              />
            </div>

            <Field id="emp-street" label="Employer address">
              <TextInput id="emp-street" {...methods.register('emp-street')} />
            </Field>
            <div className="sm:col-span-2 sm:col-start-1">
              <InputField name="emp-city" label="City" />
            </div>
            <div className="sm:col-span-2">
              <InputField name="emp-province" label="Province / State" />
            </div>
            <div className="sm:col-span-2">
              <InputField name="emp-postal" label="Postal / ZIP" />
            </div>

            <Field
              id="emp-prev-employer"
              label="Previous employer (if &lt; 2 yrs)"
            >
              <TextInput
                id="emp-prev-employer"
                {...methods.register('emp-prev-employer')}
              />
            </Field>
            <div className="sm:col-span-3">
              <InputField name="emp-prev-position" label="Prev. position" />
            </div>
            <div className="sm:col-span-3">
              <InputField
                name="emp-prev-tenure"
                label="Prev. time in role (years)"
                type="number"
              />
            </div>
          </div>
        </SectionCard>

        {/* Personal Reference */}
        <SectionCard
          title="Personal Reference"
          description="Contact who does not live with you."
          open={open.reference}
          onToggle={() => toggle('reference')}
          onSaveClick={() => saveSection('reference')}
          onCancelClick={() => cancelSection('reference')}
        >
          <div className="grid max-w-3xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <InputField name="ref-name" label="Reference name" />
            </div>
            <div className="sm:col-span-3">
              <InputField name="ref-relationship" label="Relationship" />
            </div>
            <div className="sm:col-span-3">
              <InputField name="ref-phone" label="Phone" type="tel" />
            </div>
            <div className="sm:col-span-3">
              <InputField
                name="ref-email"
                label="Email (optional)"
                type="email"
              />
            </div>
            <Field id="ref-street" label="Reference address">
              <TextInput id="ref-street" {...methods.register('ref-street')} />
            </Field>
            <div className="sm:col-span-2 sm:col-start-1">
              <InputField name="ref-city" label="City" />
            </div>
            <div className="sm:col-span-2">
              <InputField name="ref-province" label="Province / State" />
            </div>
            <div className="sm:col-span-2">
              <InputField name="ref-postal" label="Postal / ZIP" />
            </div>
          </div>
        </SectionCard>

        {/* Co-Applicant toggles */}
        <div className="mx-auto flex py-6">
          <CheckboxField
            name="has-coapp"
            label="Add co-applicant / guarantor"
            description="Include co-applicant sections below"
          />
          {hasCoApp && (
            <div className="ml-6">
              <CheckboxField name="has-coapp-address" label="Same address?" />
            </div>
          )}
        </div>

        {/* Co-Applicant — Identity & Contact */}
        {hasCoApp && (
          <SectionCard
            title="Co-Applicant — Identity & Contact"
            description="Details for the co-applicant or guarantor."
            open={open.coApplicant}
            onToggle={() => toggle('coApplicant')}
            onSaveClick={() => saveSection('coApplicant')}
            onCancelClick={() => cancelSection('coApplicant')}
          >
            <div className="grid max-w-3xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <InputField name="co-first" label="First name" />
              </div>
              <div className="sm:col-span-3">
                <InputField name="co-last" label="Last name" />
              </div>

              <div className="sm:col-span-2">
                <InputField name="co-dob" label="Date of birth" type="date" />
              </div>
              <div className="sm:col-span-2">
                <InputField name="co-sin" label="SIN (optional)" />
              </div>
              <div className="sm:col-span-2">
                <SelectField
                  name="co-status"
                  label="Residency status"
                  options={[
                    'Citizen',
                    'Permanent Resident',
                    'Work Permit',
                    'Other',
                  ]}
                />
              </div>

              <div className="sm:col-span-3">
                <InputField name="co-email" label="Email" type="email" />
              </div>
              <div className="sm:col-span-3">
                <InputField name="co-phone" label="Mobile phone" type="tel" />
              </div>

              <Field id="co-street" label="Street address">
                <TextInput id="co-street" {...methods.register('co-street')} />
              </Field>
              <div className="sm:col-span-2 sm:col-start-1">
                <InputField name="co-city" label="City" />
              </div>
              <div className="sm:col-span-2">
                <InputField name="co-province" label="Province / State" />
              </div>
              <div className="sm:col-span-2">
                <InputField name="co-postal" label="Postal / ZIP" />
              </div>

              <div className="sm:col-span-2">
                <SelectField
                  name="co-occupancy"
                  label="Own / Rent"
                  options={['Own', 'Rent', 'With Family']}
                />
              </div>
              <div className="sm:col-span-2">
                <InputField
                  name="co-housing-payment"
                  label="Monthly housing payment ($)"
                  type="number"
                />
              </div>
              <div className="sm:col-span-2">
                <InputField
                  name="co-tenure"
                  label="How long at address? (years)"
                  type="number"
                />
              </div>

              {/* Previous address */}
              <Field
                id="co-prev-street"
                label="Previous address (if &lt; 2 yrs)"
              >
                <TextInput
                  id="co-prev-street"
                  {...methods.register('co-prev-street')}
                />
              </Field>
              <div className="sm:col-span-2 sm:col-start-1">
                <InputField name="co-prev-city" label="Prev. City" />
              </div>
              <div className="sm:col-span-2">
                <InputField name="co-prev-province" label="Prev. Province" />
              </div>
              <div className="sm:col-span-2">
                <InputField name="co-prev-postal" label="Prev. Postal" />
              </div>
            </div>
          </SectionCard>
        )}

        {/* Co-Applicant — Employment */}
        {hasCoApp && (
          <SectionCard
            title="Co-Applicant — Employment"
            description="Co-applicant job and income details."
            open={open.coEmployment}
            onToggle={() => toggle('coEmployment')}
            onSaveClick={() => saveSection('coEmployment')}
            onCancelClick={() => cancelSection('coEmployment')}
          >
            <div className="grid max-w-3xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <Field id="co-emp-employer" label="Employer name">
                <TextInput
                  id="co-emp-employer"
                  {...methods.register('co-emp-employer')}
                />
              </Field>
              <div className="sm:col-span-3">
                <InputField name="co-emp-position" label="Position / Title" />
              </div>
              <div className="sm:col-span-3">
                <SelectField
                  name="co-emp-paytype"
                  label="Pay type"
                  options={[
                    'Salary',
                    'Hourly',
                    'Commission',
                    'Contract',
                    'Self-employed',
                  ]}
                />
              </div>
              <div className="sm:col-span-3">
                <InputField
                  name="co-emp-income"
                  label="Annual income ($)"
                  type="number"
                />
              </div>
              <div className="sm:col-span-3">
                <InputField
                  name="co-emp-tenure"
                  label="Time in role (years)"
                  type="number"
                />
              </div>

              <Field id="co-emp-street" label="Employer address">
                <TextInput
                  id="co-emp-street"
                  {...methods.register('co-emp-street')}
                />
              </Field>
              <div className="sm:col-span-2 sm:col-start-1">
                <InputField name="co-emp-city" label="City" />
              </div>
              <div className="sm:col-span-2">
                <InputField name="co-emp-province" label="Province / State" />
              </div>
              <div className="sm:col-span-2">
                <InputField name="co-emp-postal" label="Postal / ZIP" />
              </div>

              <Field
                id="co-emp-prev-employer"
                label="Previous employer (if &lt; 2 yrs)"
              >
                <TextInput
                  id="co-emp-prev-employer"
                  {...methods.register('co-emp-prev-employer')}
                />
              </Field>
              <div className="sm:col-span-3">
                <InputField
                  name="co-emp-prev-position"
                  label="Prev. position"
                />
              </div>
              <div className="sm:col-span-3">
                <InputField
                  name="co-emp-prev-tenure"
                  label="Prev. time in role (years)"
                  type="number"
                />
              </div>
            </div>
          </SectionCard>
        )}

        {/* Assets */}
        <SectionCard
          title="Assets"
          description="What you own — balances and values."
          open={open.assets}
          onToggle={() => toggle('assets')}
          onSaveClick={() => saveSection('assets')}
          onCancelClick={() => cancelSection('assets')}
        >
          <div className="grid max-w-4xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <InputField
                name="asset-bank-name-1"
                label="Bank account — institution"
                placeholder="e.g., RBC Chequing"
              />
            </div>
            <div className="sm:col-span-3">
              <InputField
                name="asset-bank-balance-1"
                label="Current balance ($)"
                type="number"
              />
            </div>

            <div className="sm:col-span-3">
              <InputField
                name="asset-invest-type-1"
                label="Investment — type"
                placeholder="RRSP / TFSA / Non-registered"
              />
            </div>
            <div className="sm:col-span-3">
              <InputField
                name="asset-invest-amount-1"
                label="Current amount ($)"
                type="number"
              />
            </div>

            <div className="sm:col-span-3">
              <SelectField
                name="asset-re-type-1"
                label="Real estate — type"
                options={['Detached', 'Semi', 'Townhome', 'Condo', 'Other']}
              />
            </div>
            <div className="sm:col-span-3">
              <InputField
                name="asset-re-value-1"
                label="Market value ($)"
                type="number"
              />
            </div>

            <div className="sm:col-span-3">
              <SelectField
                name="asset-vehicle-status-1"
                label="Vehicle — status"
                options={['Owned', 'Financed', 'Leased']}
              />
            </div>
            <div className="sm:col-span-3">
              <InputField
                name="asset-vehicle-value-1"
                label="Estimated value ($)"
                type="number"
              />
            </div>

            <div className="sm:col-span-3">
              <InputField
                name="asset-other-desc-1"
                label="Other asset — description"
                placeholder="e.g., Jewelry, collectibles"
              />
            </div>
            <div className="sm:col-span-3">
              <InputField
                name="asset-other-value-1"
                label="Estimated value ($)"
                type="number"
              />
            </div>
          </div>
        </SectionCard>

        {/* Liabilities */}
        <SectionCard
          title="Liabilities"
          description="What you owe — balances and monthly payments."
          open={open.liabilities}
          onToggle={() => toggle('liabilities')}
          onSaveClick={() => saveSection('liabilities')}
          onCancelClick={() => cancelSection('liabilities')}
        >
          <div className="grid max-w-4xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <InputField
                name="debt-cc-desc-1"
                label="Credit card — description"
                placeholder="e.g., TD Visa"
              />
            </div>
            <div className="sm:col-span-3">
              <InputField
                name="debt-cc-balance-1"
                label="Balance ($)"
                type="number"
              />
            </div>
            <div className="sm:col-span-3">
              <InputField
                name="debt-cc-pay-1"
                label="Monthly payment ($)"
                type="number"
              />
            </div>

            <div className="sm:col-span-3">
              <InputField
                name="debt-loan-desc-1"
                label="Loan / LOC / Auto — description"
                placeholder="e.g., RBC LOC"
              />
            </div>
            <div className="sm:col-span-3">
              <InputField
                name="debt-loan-balance-1"
                label="Balance ($)"
                type="number"
              />
            </div>
            <div className="sm:col-span-3">
              <InputField
                name="debt-loan-pay-1"
                label="Monthly payment ($)"
                type="number"
              />
            </div>

            <div className="sm:col-span-3">
              <InputField
                name="debt-mortgage-desc-1"
                label="Mortgage — description"
                placeholder="e.g., Primary residence"
              />
            </div>
            <div className="sm:col-span-3">
              <InputField
                name="debt-mortgage-balance-1"
                label="Balance ($)"
                type="number"
              />
            </div>
            <div className="sm:col-span-3">
              <InputField
                name="debt-mortgage-pay-1"
                label="Monthly payment ($)"
                type="number"
              />
            </div>

            <div className="sm:col-span-3">
              <InputField
                name="debt-other-desc-1"
                label="Other liability — description"
              />
            </div>
            <div className="sm:col-span-3">
              <InputField
                name="debt-other-balance-1"
                label="Current balance ($)"
                type="number"
              />
            </div>
          </div>
        </SectionCard>

        {/* Net Worth (read-only placeholder) */}
        <SectionCard
          title="Net Worth"
          description="Calculated values (to be wired later)."
          open={open.networth}
          onToggle={() => toggle('networth')}
          onSaveClick={() => saveSection('networth')}
          onCancelClick={() => cancelSection('networth')}
        >
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <InputField
                name="nw-assets"
                label="Total Assets ($)"
                placeholder="Auto-calculated later"
              />
            </div>
            <div className="sm:col-span-2">
              <InputField
                name="nw-liabs"
                label="Total Liabilities ($)"
                placeholder="Auto-calculated later"
              />
            </div>
            <div className="sm:col-span-2">
              <InputField
                name="nw-net"
                label="Net Worth ($)"
                placeholder="Auto-calculated later"
              />
            </div>
          </div>
        </SectionCard>

        {/* Declarations */}
        <SectionCard
          title="Declarations"
          description="Answer truthfully — this affects eligibility."
          open={open.declarations}
          onToggle={() => toggle('declarations')}
          onSaveClick={() => saveSection('declarations')}
          onCancelClick={() => cancelSection('declarations')}
        >
          <div className="max-w-2xl space-y-10 md:col-span-2">
            <fieldset>
              <legend className="text-sm/6 font-semibold text-gray-900">
                Applicant
              </legend>
              <div className="mt-6 space-y-6">
                <RadioField
                  id="app-bankruptcy-no"
                  name="app-bankruptcy"
                  value="no"
                  label="No bankruptcy / court judgment"
                />
                <RadioField
                  id="app-bankruptcy-yes"
                  name="app-bankruptcy"
                  value="yes"
                  label="Yes — specify year below"
                />
                <div className="mt-2">
                  <TextInput
                    id="app-bankruptcy-year"
                    type="number"
                    placeholder="Year (if yes)"
                    {...methods.register('app-bankruptcy-year')}
                  />
                </div>
              </div>
            </fieldset>

            {hasCoApp && (
              <fieldset>
                <legend className="text-sm/6 font-semibold text-gray-900">
                  Co-Applicant
                </legend>
                <div className="mt-6 space-y-6">
                  <RadioField
                    id="co-bankruptcy-no"
                    name="co-bankruptcy"
                    value="no"
                    label="No bankruptcy / court judgment"
                  />
                  <RadioField
                    id="co-bankruptcy-yes"
                    name="co-bankruptcy"
                    value="yes"
                    label="Yes — specify year below"
                  />
                  <div className="mt-2">
                    <TextInput
                      id="co-bankruptcy-year"
                      type="number"
                      placeholder="Year (if yes)"
                      {...methods.register('co-bankruptcy-year')}
                    />
                  </div>
                </div>
              </fieldset>
            )}
          </div>
        </SectionCard>

        {/* Consent & Signatures */}
        <SectionCard
          title="Consent & Signatures"
          description="Authorization and consent to verify information."
          open={open.consent}
          onToggle={() => toggle('consent')}
          onSaveClick={() => saveSection('consent')}
          onCancelClick={() => cancelSection('consent')}
        >
          <div className="grid max-w-3xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <Field id="consent-text" label="Consent text">
              <div className="text-xs">
                {/* static text (kept from original) */}
                {/* … */}
              </div>
            </Field>

            <div className="sm:col-span-3">
              <InputField
                name="sign-app-name"
                label="Applicant signature (type name)"
                placeholder="Full legal name"
              />
            </div>
            <div className="sm:col-span-3">
              <InputField name="sign-app-date" label="Date" type="date" />
            </div>

            {hasCoApp && (
              <>
                <div className="sm:col-span-3">
                  <InputField
                    name="sign-co-name"
                    label="Co-applicant signature (type name)"
                    placeholder="Full legal name"
                  />
                </div>
                <div className="sm:col-span-3">
                  <InputField name="sign-co-date" label="Date" type="date" />
                </div>
              </>
            )}

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
          </div>
        </SectionCard>

        {/* Submit Entire Form */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          >
            Submit Entire Form
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
