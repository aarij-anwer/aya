// app/api/applications/[id]/route.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
} from 'docx';

const sql = neon(process.env.DATABASE_URL as string);

type Row = {
  id: string;
  status: string | null;
  // Neon can return JSON columns already parsed; keep as Record<...>
  applicant: Record<string, any>;
  co_applicant: Record<string, any> | null;
  created_at: string;
  financing_details: string | null;
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

function sectionTitle(text: string) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { after: 120 },
    children: [new TextRun({ text, bold: true })],
  });
}

function kvTable(
  raw: Record<string, any> | null | undefined,
  labelMap?: Record<string, string>
) {
  const obj = raw ?? {};
  const entries = Object.entries(obj);
  if (!entries.length) return [new Paragraph('—')];

  const rows = entries.map(([k, v]) => {
    const key = labelMap?.[k] ?? k;
    const val =
      v === null || v === undefined
        ? ''
        : typeof v === 'object'
          ? JSON.stringify(v)
          : String(v);
    return new TableRow({
      children: [
        new TableCell({
          width: { size: 40, type: WidthType.PERCENTAGE },
          children: [new Paragraph(String(key))],
        }),
        new TableCell({
          width: { size: 60, type: WidthType.PERCENTAGE },
          children: [new Paragraph(val)],
        }),
      ],
    });
  });

  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows,
    }),
  ];
}

async function buildDocx(row: Row) {
  // Optional: prettify keys (add more as you wish)
  const applicantMap: Record<string, string> = {
    'app-first': 'First Name',
    'app-last': 'Last Name',
    'app-email': 'Email',
    'app-phone': 'Phone',
    'app-dob': 'Date of Birth',
    'app-sin': 'SIN',
    'app-street': 'Street',
    'app-city': 'City',
    'app-province': 'Province',
    'app-postal': 'Postal Code',
    'app-status': 'Status',
  };

  const coMap: Record<string, string> = {
    'co-first': 'First Name',
    'co-last': 'Last Name',
    'co-email': 'Email',
    'co-phone': 'Phone',
    'co-dob': 'Date of Birth',
    'co-sin': 'SIN',
    'co-street': 'Street',
    'co-city': 'City',
    'co-province': 'Province',
    'co-postal': 'Postal Code',
    'co-status': 'Status',
  };

  const doc = new Document({
    creator: 'Your App',
    title: `Application ${row.id}`,
    sections: [
      {
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.TITLE,
            spacing: { after: 200 },
            children: [new TextRun(`Mortgage Application`)],
          }),
          new Paragraph({
            spacing: { after: 160 },
            children: [
              new TextRun({ text: `Application ID: ${row.id}`, bold: true }),
              new TextRun({
                text: row.status ? ` • Status: ${row.status}` : '',
              }),
            ],
          }),

          sectionTitle('Applicant'),
          ...kvTable(row.applicant, applicantMap),

          ...(row.co_applicant
            ? [
                sectionTitle('Co-Applicant'),
                ...kvTable(row.co_applicant, coMap),
              ]
            : []),

          new Paragraph({
            spacing: { before: 300 },
            children: [
              new TextRun({
                text: 'Note: This document may contain sensitive personal information. Handle and store securely.',
                italics: true,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
}

export async function GET(request: NextRequest) {
  try {
    // Extract id (works for both /id and trailing slash)
    const url = new URL(request.url);
    const parts = url.pathname.split('/').filter(Boolean);
    const id = parts[parts.length - 1];
    const wantsDocx =
      url.searchParams.get('format') === 'docx' ||
      (request.headers.get('accept') ?? '')
        .toLowerCase()
        .includes(
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        );

    if (!id) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    const rows = (await sql`
      SELECT id, status, applicant, co_applicant, created_at, financing_details
      FROM applications
      WHERE id = ${id}
      LIMIT 1
    `) as Row[];

    if (!rows.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const row = rows[0];

    if (wantsDocx) {
      const nodeBuffer = await buildDocx(row); // Buffer<ArrayBufferLike>
      const uint8 = new Uint8Array(nodeBuffer); // <-- valid BodyInit
      const fileName = `application-${row.id}.docx`;

      return new NextResponse(uint8, {
        status: 200,
        headers: {
          'Content-Type':
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'Cache-Control': 'no-store',
        },
      });
    }

    // Default JSON response (your original behavior)
    return NextResponse.json({
      id: row.id,
      status: row.status ?? null,
      applicant: row.applicant,
      co_applicant: row.co_applicant,
      applicant_name: fullName(row.applicant, 'app'),
      coapplicant_name: fullName(row.co_applicant, 'co'),
      created_at: row.created_at,
      financing_details: row.financing_details ?? null,
    });
  } catch (err: any) {
    console.error('GET /applications/[id] failed:', err);
    return NextResponse.json(
      { error: 'Server error', detail: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
