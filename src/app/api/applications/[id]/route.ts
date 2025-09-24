// app/api/applications/[id]/route.ts
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL as string);

type Row = {
  id: string;
  status: string | null;
  applicant: Record<string, any>;
  co_applicant: Record<string, any> | null;
};

function fullName(
  obj: Record<string, any> | null | undefined,
  prefix: 'app' | 'co'
) {
  if (!obj) return null;
  const first = obj[`${prefix}-first`];
  const last = obj[`${prefix}-last`];
  const name = [first, last].filter(Boolean).join(' ').trim();
  return name || null;
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // (Optional) quick UUID sanity check
    if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    const rows = (await sql`
      SELECT id, status, applicant, co_applicant
      FROM applications
      WHERE id = ${id}
      LIMIT 1
    `) as Row[];

    if (!rows.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const row = rows[0];

    return NextResponse.json({
      id: row.id,
      status: row.status ?? null,
      applicant: row.applicant,
      co_applicant: row.co_applicant,
      applicant_name: fullName(row.applicant, 'app'),
      coapplicant_name: fullName(row.co_applicant, 'co'),
    });
  } catch (err: any) {
    console.error('GET /applications/[id] failed:', err);
    return NextResponse.json(
      { error: 'Server error', detail: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
