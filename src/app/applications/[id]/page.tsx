// app/app/[id]/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type ApiOk = {
  id: string;
  status: string | null;
  applicant_name: string | null;
  coapplicant_name: string | null;
};
type ApiErr = { error: string; detail?: string };
type ApiResponse = ApiOk | ApiErr;

export default function ApplicationDetailClientPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [data, setData] = useState<ApiOk | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // const apiUrl = useMemo(() => {
  //   const base = process.env.NEXT_PUBLIC_SITE_URL;
  //   const path = `/api/applications/${id}`;
  //   return base ? `${base}${path}` : path;
  // }, [id]);

  useEffect(() => {
    if (!id) return;

    const apiUrl = `/api/applications/${id}`;

    const ctrl = new AbortController();
    setLoading(true);
    setErrorMsg(null);
    setStatusCode(null);

    (async () => {
      try {
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
          <Link href="/app" className="text-blue-600 underline">
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
          <Link href="/app" className="text-blue-600 underline">
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
      </div>

      <div className="mt-6">
        <Link href="/app" className="text-blue-600 underline">
          Back
        </Link>
      </div>
    </main>
  );
}
