// app/api/comments/route.ts
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  // Disable caching so the client always gets fresh data
  console.log(sql);
  const rows = await sql`
    SELECT comment
    FROM comments
    LIMIT 50
  `;
  return NextResponse.json(rows, {
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function POST(req: Request) {
  const { comment } = await req.json().catch(() => ({}));
  if (typeof comment !== 'string' || !comment.trim()) {
    return NextResponse.json({ error: 'Invalid comment' }, { status: 400 });
  }

  const [inserted] = (await sql`
  INSERT INTO comments (comment)
  VALUES (${comment})
  RETURNING comment
`) as { comment: string }[];

  return NextResponse.json(inserted, { status: 201 });
}
