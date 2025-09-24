// app/app/[id]/page.tsx
import Link from 'next/link';
import { headers } from 'next/headers';

type ApiOk = {
  id: string;
  status: string | null;
  applicant_name: string | null;
  coapplicant_name: string | null;
};
type ApiErr = { error: string; detail?: string };
type ApiResponse = ApiOk | ApiErr;

async function getBaseUrl() {
  // 👇 await headers() (your TS error was from missing this)
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
    process.env.NEXT_PUBLIC_VERCEL_URL /* e.g. myapp.vercel.app */ ??
    'localhost:3000';

  // Prefer explicit site URL if set
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? `${proto}://${host}`;
  return base;
}

async function getApplication(id: string) {
  const base = await getBaseUrl();
  const url = new URL(`/api/applications/${id}`, base);
  const res = await fetch(url.toString(), { cache: 'no-store' });
  return {
    ok: res.ok,
    status: res.status,
    data: (await res.json()) as ApiResponse,
  };
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
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
          <Link href="/app" className="text-blue-600 underline">
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
          <span className="gap-4 text-sm text-gray-500">
            ID (last 4 digits)
          </span>
          <span className="font-mono">
            {app.id.substring(app.id.length - 4)}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-sm text-gray-500">Status</span>
          <span>
            {app.status &&
              app.status?.charAt(0).toUpperCase() +
                app.status?.substring(1).toLowerCase()}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-sm text-gray-500">Applicant</span>
          <span>{app.applicant_name ?? '—'}</span>
        </div>
        <div className="flex justify-between gap-4">
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
