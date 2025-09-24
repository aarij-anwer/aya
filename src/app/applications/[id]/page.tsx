// app/applications/[id]/page.tsx  (or app/app/[id]/page.tsx)
import Link from 'next/link';
import { headers } from 'next/headers';

type SearchParams = Record<string, string | string[] | undefined>;

type ApiOk = {
  id: string;
  status: string | null;
  applicant_name: string | null;
  coapplicant_name: string | null;
};
type ApiErr = { error: string; detail?: string };
type ApiResponse = ApiOk | ApiErr;

async function getBaseUrl() {
  const h = await headers();
  const proto =
    h.get('x-forwarded-proto') ??
    (process.env.NEXT_PUBLIC_SITE_URL
      ? new URL(process.env.NEXT_PUBLIC_SITE_URL).protocol.replace(':', '')
      : null) ??
    'http';
  const host =
    h.get('x-forwarded-host') ??
    h.get('host') ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    'localhost:3000';
  return process.env.NEXT_PUBLIC_SITE_URL ?? `${proto}://${host}`;
}

async function getApplication(id: string) {
  const base = await getBaseUrl();
  const res = await fetch(new URL(`/api/applications/${id}`, base), {
    cache: 'no-store',
  });
  return {
    ok: res.ok,
    status: res.status,
    data: (await res.json()) as ApiResponse,
  };
}

export default async function ApplicationDetailPage({
  params,
  searchParams,
}: {
  // 👇 Promise types match Next’s async props
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { id: routeId } = await params;
  const sp = await searchParams;

  // Prefer dynamic route param (/app/[id]); fall back to ?id=...
  const id = routeId ?? (Array.isArray(sp.id) ? sp.id[0] : sp.id);

  if (!id) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="text-xl font-semibold">Missing id</h1>
      </main>
    );
  }

  const { ok, status, data } = await getApplication(id);

  if (!ok) {
    const message =
      status === 404 ? 'Application not found' : 'Unable to load application';
    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="text-xl font-semibold">{message}</h1>
        <p className="mt-2 text-sm text-gray-600">ID: {id}</p>
        {'error' in data && data.error && (
          <p className="mt-2 text-sm text-red-600">{data.error}</p>
        )}
        <div className="mt-6">
          <Link href="/" className="text-blue-600 underline">
            Back
          </Link>
        </div>
      </main>
    );
  }

  const app = data as ApiOk;

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold">Application</h1>

      <div className="mt-6 space-y-3 rounded-lg border p-4">
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">ID (last 4)</span>
          <span className="font-mono">{app.id.slice(-4)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Status</span>
          <span>
            {app.status
              ? app.status[0].toUpperCase() + app.status.slice(1).toLowerCase()
              : '—'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Applicant</span>
          <span>{app.applicant_name ?? '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Co-Applicant</span>
          <span>{app.coapplicant_name ?? '—'}</span>
        </div>
      </div>

      <div className="mt-6">
        <Link href="/" className="text-blue-600 underline">
          Back
        </Link>
      </div>
    </main>
  );
}
