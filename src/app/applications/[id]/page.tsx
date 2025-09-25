// app/app/[id]/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fmtDate, fmtMoney } from '@/app/utils';

type FinancingDetails = {
  purchase_price?: number | null;
  down_payment?: number | null;
  finance_amount?: number | null;
  closing_date?: string | null;
  property_address?: string | null;
  property_city?: string | null;
  property_province?: string | null;
  property_postal_code?: string | null;
} | null;

type ApiOk = {
  id: string;
  status: string | null;
  applicant_name: string | null;
  coapplicant_name: string | null;
  created_at: string; // make sure API returns this
  financing_details: Record<string, any> | null; // ← prefer object, not string
};

type ApiErr = { error: string; detail?: string };
type ApiResponse = ApiOk | ApiErr;

export default function ApplicationDetailClientPage() {
  const { id } = useParams<{ id: string }>();

  const [data, setData] = useState<ApiOk | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Derive financing object and address line from data
  const { finObj, addressLines, addressMultiline } = useMemo(() => {
    const raw = (data?.financing_details ?? null) as unknown;
    const obj: FinancingDetails =
      typeof raw === 'string'
        ? (() => {
            try {
              return JSON.parse(raw) as FinancingDetails;
            } catch {
              return null;
            }
          })()
        : (raw as FinancingDetails);

    const lines = obj
      ? [
          obj.property_address,
          [obj?.property_city, obj?.property_province]
            .filter(Boolean)
            .join(', '),
          obj.property_postal_code?.toUpperCase(),
        ].filter(Boolean)
      : [];

    return {
      finObj: obj,
      addressLines: lines,
      addressMultiline: lines.join('\n'),
    };
  }, [data]);

  useEffect(() => {
    if (!id) return;

    const ctrl = new AbortController();
    const apiUrl = `/api/applications/${id}`;

    (async () => {
      try {
        setLoading(true);
        setErrorMsg(null);
        setStatusCode(null);

        const res = await fetch(apiUrl, {
          cache: 'no-store',
          signal: ctrl.signal,
        });
        setStatusCode(res.status);

        const json = (await res.json()) as ApiResponse;

        if (!res.ok || 'error' in json) {
          setErrorMsg(('error' in json && json.error) || `HTTP ${res.status}`);
          setData(null);
        } else {
          setData(json);
        }
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          setErrorMsg(String(err?.message ?? err));
          setData(null);
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, [id]);

  if (!id) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="text-xl font-semibold">Missing id</h1>
        <div className="mt-6">
          <Link href="/" className="text-blue-600 underline">
            Back
          </Link>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-bold">Application</h1>
        <div className="mt-6 animate-pulse space-y-3 rounded-lg border p-4">
          <div className="h-4 w-1/3 rounded bg-gray-200" />
          <div className="h-4 w-1/4 rounded bg-gray-200" />
          <div className="h-4 w-1/2 rounded bg-gray-200" />
        </div>
      </main>
    );
  }

  if (!data) {
    const message =
      statusCode === 404
        ? 'Application not found'
        : 'Unable to load application';
    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="text-xl font-semibold">{message}</h1>
        <p className="mt-2 text-sm text-gray-600">ID: {id}</p>
        {errorMsg && <p className="mt-2 text-sm text-red-600">{errorMsg}</p>}
        <div className="mt-6">
          <Link href="/" className="text-blue-600 underline">
            Back
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold">Application</h1>

      <div className="mt-6 space-y-3 rounded-lg border p-4">
        <div className="flex justify-between gap-4">
          <span className="text-sm text-gray-500">ID (last 4)</span>
          <span className="font-mono">{data.id.slice(-4)}</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-sm text-gray-500">Status</span>
          <span>
            {data.status
              ? data.status[0].toUpperCase() +
                data.status.slice(1).toLowerCase()
              : '—'}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-sm text-gray-500">Applicant</span>
          <span>{data.applicant_name ?? '—'}</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-sm text-gray-500">Co-Applicant</span>
          <span>{data.coapplicant_name ?? '—'}</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-sm text-gray-500">Date Submitted</span>
          <span>
            {new Intl.DateTimeFormat('en-CA', {
              dateStyle: 'medium',
              timeStyle: 'short',
              timeZone: 'America/Toronto',
            }).format(new Date(data.created_at))}
          </span>
        </div>

        <div className="space-y-2 rounded-lg border p-4">
          <h2>Financing Details</h2>
          <div className="flex justify-between gap-4">
            <span className="text-sm text-gray-500">Purchase Price</span>
            <span>{fmtMoney(finObj?.purchase_price ?? null)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-sm text-gray-500">Down Payment</span>
            <span>{fmtMoney(finObj?.down_payment ?? null)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-sm text-gray-500">Finance Amount</span>
            <span>{fmtMoney(finObj?.finance_amount ?? null)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-sm text-gray-500">Closing Date</span>
            <span>{fmtDate(finObj?.closing_date ?? null)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-sm text-gray-500">Property</span>
            <span className="text-right whitespace-pre-line">
              {addressMultiline || '—'}
            </span>{' '}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Link href="/" className="text-blue-600 underline">
          Back
        </Link>
      </div>
    </main>
  );
}
