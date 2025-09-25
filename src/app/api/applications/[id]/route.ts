// app/api/applications/[id]/route.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import {
  Document,
  Packer,
  TextRun,
  Table,
  WidthType,
  AlignmentType,
  TabStopPosition,
  TabStopType,
} from 'docx';
import {
  buildApplicantBlocks,
  fmtDate,
  fmtMoney,
  fullName,
  H2,
  KV,
  P,
  parseFinancing,
} from '@/app/utils';

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

async function buildDocx(row: Row) {
  const fin = parseFinancing(row.financing_details);

  const appName = fullName(row.applicant, 'app') ?? '—';
  const coName = fullName(row.co_applicant, 'co');
  const partiesLine = coName ? `${appName} and ${coName}` : appName;

  const applicantBlocks = buildApplicantBlocks(appName, coName ?? '');

  const propertyLine = fin
    ? [
        fin.property_address,
        [fin.property_city, fin.property_province].filter(Boolean).join(', '),
        fin.property_postal_code,
      ]
        .filter(Boolean)
        .join(', ')
    : '—';

  const doc = new Document({
    creator: 'AYA',
    title: `Term Sheet – ${appName} - ${row.id}`,
    sections: [
      {
        properties: {
          page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } },
        },
        children: [
          P('MOYA FINANCIAL CREDIT UNION LIMITED', {
            alignment: AlignmentType.CENTER,
          }),
          P('725 Browns Line, Etobicoke, ON M8W 3V7', {
            alignment: AlignmentType.CENTER,
          }),
          P('Tel: 416.252.6527  Fax: 416.252.2092', {
            alignment: AlignmentType.CENTER,
          }),
          P('', { spacing: { after: 200 } }),
          P(`${fmtDate(row.created_at)}  (Via e-mail)`),
          P(partiesLine, { spacing: { after: 100 } }),

          // Subject
          P(
            [
              new TextRun({ text: 'Re: ', bold: true }),
              `Residential Mortgage – ${propertyLine}`,
            ],
            { spacing: { after: 200 } }
          ),

          // Opening
          P(
            'We are willing to proceed with a term financing application on the following basis. The term sheet outlined herein is intended to serve as a discussion paper only and is not a formal commitment.',
            { spacing: { after: 200 } }
          ),

          // Parties
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              KV('Client', partiesLine),
              KV('Financier', 'Moya Financial Credit Union Ltd. (“Moya”)'),
            ],
          }),

          H2('Facilities'),
          P('First Position Residential Mortgage'),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              KV('Amount', fmtMoney(fin?.finance_amount ?? null)),
              KV('Purchase Price', fmtMoney(fin?.purchase_price ?? null)),
              KV('Down Payment', fmtMoney(fin?.down_payment ?? null)),
            ],
          }),

          H2('Purpose'),
          P(
            `Purchase of an owner-occupied residential property located at ${propertyLine}.`
          ),

          H2('Closing Date'),
          P(fin ? fmtDate(fin.closing_date) : '—'),

          H2('Payment'),
          P(
            'In monthly installments as per an agreed-upon schedule sufficient to repay the facility in full during the specified amortization.'
          ),

          H2('Prepayment'),
          P(
            'a) On any regular payment date the client may increase up to double the required payment without penalty, not cumulative. Two-week notice required.'
          ),
          P(
            'b) During the term the Client may prepay up to 20% of the then outstanding amount without bonus or penalty, with two-week notice; not within a consecutive 6-month period. Not cumulative year-over-year.'
          ),
          P(
            'c) The Client may prepay the whole of the outstanding amount upon payment of an administrative fee (TBD).'
          ),

          H2('Term / Amortization'),
          P('3-year term; twenty-five-year amortization.'),

          H2('User Fee'),
          P(
            'In consideration for the Client utilizing the Facility and having quiet possession and exclusive use of the Real Property during the Term, the Client shall pay the Financier a user fee (rate subject to due diligence and cost evaluation).'
          ),

          H2('Fees'),
          P(
            'Application Fee: $1,000.00 ($250 payable upon acceptance of this term sheet and non-refundable; the balance deducted from proceeds on closing).'
          ),

          H2('Security'),
          P(
            `First-position mortgage on ${propertyLine} (full municipal address and legal description to be confirmed), plus customary assignments and insurance acknowledgements; all in form satisfactory to the Financier.`
          ),

          H2('Subject To'),
          P(
            'Receipt of appraisal (min. FTV requirements), income/NOA documents, proof of down payment, and any additional items required by the Financier.'
          ),

          H2('General Conditions / Covenants'),
          P(
            'Remain a member in good standing with Moya Financial Credit Union Limited while any portion of the facility remains outstanding or committed.'
          ),

          // Acceptance block
          P('', { spacing: { before: 300 } }),
          P(
            'The above noted terms and conditions are acceptable to us. Please proceed with your formal application.'
          ),
          P('', { spacing: { after: 200 } }),
          P('Accepted by:', { spacing: { after: 120 } }),
          ...applicantBlocks,
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

export async function PATCH(req: Request) {
  try {
    // --- Extract id from URL ---
    const url = new URL(req.url);
    const parts = url.pathname.split('/').filter(Boolean);
    const id = parts[parts.length - 1];

    if (!id) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    // --- Parse body ---
    const contentType = req.headers.get('content-type') ?? '';
    let body: any = {};
    if (contentType.includes('application/json')) {
      body = await req.json();
    } else if (
      contentType.includes('application/x-www-form-urlencoded') ||
      contentType.includes('multipart/form-data')
    ) {
      const fd = await req.formData();
      fd.forEach((v, k) => {
        body[k] = v;
      });
    }

    const newStatus = body?.status;
    if (typeof newStatus !== 'string' || !newStatus.trim()) {
      return NextResponse.json(
        { error: 'Missing or invalid status' },
        { status: 400 }
      );
    }

    // --- Update row ---
    const rows = await sql /*sql*/ `
      UPDATE applications
      SET status = ${newStatus}
      WHERE id = ${id}
      RETURNING id, status, created_at
    `;

    if (!rows.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      id: rows[0].id,
      status: rows[0].status,
      updated_at: rows[0].created_at,
    });
  } catch (err: any) {
    console.error('PATCH /applications/[id] failed:', err);
    return NextResponse.json(
      { error: 'Update failed', detail: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
