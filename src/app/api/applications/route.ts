// app/api/applications/route.ts
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL as string);

// Map of prefixes -> JSONB column name
const prefixToColumn: Record<string, keyof RowShape> = {
  // Applicant identity & contact
  'app-': 'applicant',
  // Applicant employment
  'emp-': 'applicant',
  // Personal reference
  'ref-': 'reference',
  // Co-applicant identity & contact
  'co-': 'co_applicant',
  // Co-applicant employment
  'co-emp-': 'co_applicant',
  // Assets & Liabilities
  'asset-': 'assets',
  'debt-': 'liabilities',
  // Net worth
  'nw-': 'totals',
  // Declarations
  'app-bankruptcy': 'declarations',
  'co-bankruptcy': 'declarations',
  // Consent & signatures
  'sign-': 'consent',
  'consent-': 'consent',
  // ← NEW: Financing details
  'fin-': 'financing_details',
};

// Shape we’ll build to match your table columns
type RowShape = {
  status?: string | null;
  applicant: Record<string, any>;
  co_applicant?: Record<string, any> | null;
  reference?: Record<string, any> | null;
  declarations?: Record<string, any> | null;
  consent?: Record<string, any> | null;
  assets?: Record<string, any> | null;
  liabilities?: Record<string, any> | null;
  totals?: Record<string, any> | null;
  financing_details?: Record<string, any> | null;
};

// Minimal sanitizer: convert empty strings to null, keep numbers as strings for now.
// (You can tighten this later.)
function normalizeValue(v: FormDataEntryValue): any {
  if (typeof v !== 'string') return v;
  const trimmed = v.trim();
  return trimmed === '' ? null : trimmed;
}

function emptyBuckets(): RowShape {
  return {
    applicant: {},
    co_applicant: null,
    reference: null,
    declarations: null,
    consent: null,
    assets: null,
    liabilities: null,
    totals: null,
    financing_details: null,
  };
}

function ensureObj(val: Record<string, any> | null | undefined) {
  return val ?? {};
}

// Assign a (key, value) pair into the right JSONB bucket using prefix rules.
// function assignKV(buckets: RowShape, key: string, rawVal: any) {
//   const val = normalizeValue(rawVal);

//   // Find the longest matching prefix (so "co-emp-" wins over "co-")
//   const match = Object.keys(prefixToColumn)
//     .filter((p) => key.startsWith(p))
//     .sort((a, b) => b.length - a.length)[0];

//   if (!match) {
//     // If no prefix matched, toss into applicant by default (or ignore)
//     buckets.applicant[key] = val;
//     return;
//   }

//   const column = prefixToColumn[match];

//   if (column === 'applicant') {
//     buckets.applicant[key] = val;
//     return;
//   }

//   // For nullable JSONB columns, ensure object exists before writing
//   if (column === 'co_applicant') {
//     buckets.co_applicant = ensureObj(buckets.co_applicant);
//     buckets.co_applicant![key] = val;
//   } else if (column === 'reference') {
//     buckets.reference = ensureObj(buckets.reference);
//     buckets.reference![key] = val;
//   } else if (column === 'declarations') {
//     buckets.declarations = ensureObj(buckets.declarations);
//     buckets.declarations![key] = val;
//   } else if (column === 'consent') {
//     buckets.consent = ensureObj(buckets.consent);
//     buckets.consent![key] = val;
//   } else if (column === 'assets') {
//     buckets.assets = ensureObj(buckets.assets);
//     buckets.assets![key] = val;
//   } else if (column === 'liabilities') {
//     buckets.liabilities = ensureObj(buckets.liabilities);
//     buckets.liabilities![key] = val;
//   } else if (column === 'totals') {
//     buckets.totals = ensureObj(buckets.totals);
//     buckets.totals![key] = val;
//   }
// }

function assignKV(buckets: RowShape, key: string, rawVal: any) {
  const val = normalizeValue(rawVal);
  const match = Object.keys(prefixToColumn)
    .filter((p) => key.startsWith(p))
    .sort((a, b) => b.length - a.length)[0];

  if (!match) {
    buckets.applicant[key] = val;
    return;
  }

  const column = prefixToColumn[match] as keyof RowShape;

  if (column === 'applicant') {
    buckets.applicant[key] = val;
    return;
  }

  if (column === 'co_applicant') {
    buckets.co_applicant = ensureObj(buckets.co_applicant);
    buckets.co_applicant![key] = val;
    return;
  }

  if (column === 'reference') {
    buckets.reference = ensureObj(buckets.reference);
    buckets.reference![key] = val;
    return;
  }

  if (column === 'declarations') {
    buckets.declarations = ensureObj(buckets.declarations);
    buckets.declarations![key] = val;
    return;
  }

  if (column === 'consent') {
    buckets.consent = ensureObj(buckets.consent);
    buckets.consent![key] = val;
    return;
  }

  if (column === 'assets') {
    buckets.assets = ensureObj(buckets.assets);
    buckets.assets![key] = val;
    return;
  }

  if (column === 'liabilities') {
    buckets.liabilities = ensureObj(buckets.liabilities);
    buckets.liabilities![key] = val;
    return;
  }

  if (column === 'totals') {
    buckets.totals = ensureObj(buckets.totals);
    buckets.totals![key] = val;
    return;
  }

  if (column === 'financing_details') {
    buckets.financing_details = ensureObj(buckets.financing_details);
    buckets.financing_details![key] = val;
    return;
  }
}

// Convert a plain object into buckets
function fromObject(obj: Record<string, any>): RowShape {
  const buckets = emptyBuckets();

  // Optional status passthrough
  if (obj.status != null) {
    buckets.status = String(obj.status);
  }

  for (const [k, v] of Object.entries(obj)) {
    if (k === 'status') continue; // handled above
    assignKV(buckets, k, v);
  }
  return buckets;
}

// Convert FormData into buckets
function fromFormData(fd: FormData): RowShape {
  const buckets = emptyBuckets();

  const status = fd.get('status');
  if (status != null) buckets.status = String(status);

  fd.forEach((v, k) => {
    if (k === 'status') return;
    // If file inputs are included, you can handle File instances here.
    // For now, we’ll skip File blobs or store filenames only.
    if (v instanceof File) {
      if (v && v.name) assignKV(buckets, k, v.name);
      return;
    }
    assignKV(buckets, k, v);
  });

  return buckets;
}

// --- helpers ---
function pruneNulls<T extends Record<string, any>>(
  obj: T | null | undefined
): T | null {
  if (!obj) return null;
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && v !== undefined && v !== '') out[k] = v;
  }
  return Object.keys(out).length ? (out as T) : null;
}

function compactConsent(consent: Record<string, any> | null | undefined) {
  if (!consent) return null;

  const applicant_name = consent['sign-app-name'] ?? null;
  const applicant_date = consent['sign-app-date'] ?? null;
  const coapplicant_name = consent['sign-co-name'] ?? null;
  const coapplicant_date = consent['sign-co-date'] ?? null;

  // If you later add a separate signature field, swap it in here.
  const signature = applicant_name ?? null;

  // Keep only the essentials; drop consent-text, sign-file, etc.
  return pruneNulls({
    applicant_name,
    applicant_date,
    coapplicant_name,
    coapplicant_date,
    signature,
  });
}

// ← NEW: normalize and coerce financing_details
function numOrNull(x: any): number | null {
  const n = typeof x === 'number' ? x : Number(x);
  return Number.isFinite(n) ? n : null;
}
function strOrNull(x: any): string | null {
  if (x == null) return null;
  const s = String(x).trim();
  return s === '' ? null : s;
}
function compactFinancing(fin: Record<string, any> | null | undefined) {
  if (!fin) return null;

  const purchase_price = numOrNull(fin['fin-purchase-price']);
  const down_payment = numOrNull(fin['fin-down-payment']);
  // Recompute finance amount server-side for integrity
  const computedFinance =
    purchase_price != null && down_payment != null
      ? Math.max(purchase_price - down_payment, 0)
      : null;

  const finance_amount =
    computedFinance ?? numOrNull(fin['fin-finance-amount']);

  const closing_date = strOrNull(fin['fin-closing-date']);
  const property_address = strOrNull(fin['fin-property-address']);
  const property_city = strOrNull(fin['fin-property-city']);
  const property_province = strOrNull(fin['fin-property-province']);
  const property_postal_code = strOrNull(fin['fin-property-postal-code']);

  return pruneNulls({
    purchase_price,
    down_payment,
    finance_amount,
    closing_date,
    property_address,
    property_city,
    property_province,
    property_postal_code,
  });
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';

    let row: RowShape;

    if (contentType.includes('application/json')) {
      const body = (await req.json()) as Record<string, any>;
      row = fromObject(body);
    } else if (
      contentType.includes('multipart/form-data') ||
      contentType.includes('application/x-www-form-urlencoded')
    ) {
      const fd = await req.formData();
      row = fromFormData(fd);
    } else {
      return NextResponse.json(
        { error: 'Unsupported Content-Type' },
        { status: 415 }
      );
    }

    // Safety: ensure required not-null jsonb column
    if (!row.applicant || Object.keys(row.applicant).length === 0) {
      return NextResponse.json(
        { error: 'Missing applicant data' },
        { status: 400 }
      );
    }

    row.consent = compactConsent(row.consent);
    row.financing_details = compactFinancing(row.financing_details);

    // Insert
    const inserted = (await sql`
  INSERT INTO applications
    (status, applicant, co_applicant, reference, declarations, consent, assets, liabilities, totals, financing_details)
  VALUES
    (
      ${'submitted'},
      ${row.applicant},
      ${row.co_applicant},
      ${row.reference},
      ${row.declarations},
      ${row.consent},
      ${row.assets},
      ${row.liabilities},
      ${row.totals},
      ${row.financing_details}
    )
  RETURNING id, created_at
`) as { id: string; created_at: string }[];

    const payload = inserted[0];
    return NextResponse.json({
      ok: true,
      id: payload?.id,
      created_at: payload?.created_at,
    });
  } catch (err: any) {
    console.error('Insert failed:', err);
    return NextResponse.json(
      { error: 'Insert failed', detail: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
