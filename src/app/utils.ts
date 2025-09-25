import {
  TextRun,
  Paragraph,
  HeadingLevel,
  TableRow,
  TableCell,
  WidthType,
  IParagraphOptions,
  TabStopPosition,
  TabStopType,
} from 'docx';

export const fmtMoney = (n?: number | null) =>
  typeof n === 'number'
    ? new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
        maximumFractionDigits: 0,
      }).format(n)
    : '—';

export const fmtDate = (iso?: string | null) =>
  iso
    ? new Intl.DateTimeFormat('en-CA', {
        dateStyle: 'long',
        timeZone: 'America/Toronto',
      }).format(new Date(iso))
    : '—';

export function parseFinancing(raw: any) {
  const obj =
    typeof raw === 'string'
      ? (() => {
          try {
            return JSON.parse(raw) as Record<string, any>;
          } catch {
            return null;
          }
        })()
      : (raw as Record<string, any> | null);

  if (!obj) return null;

  const n = (x: any) => (Number.isFinite(Number(x)) ? Number(x) : null);
  const s = (x: any) => (x == null ? null : String(x).trim() || null);

  const purchase_price = n(obj.purchase_price);
  const down_payment = n(obj.down_payment);
  const finance_amount = n(
    obj.finance_amount ??
      (purchase_price != null && down_payment != null
        ? Math.max(purchase_price - down_payment, 0)
        : null)
  );
  const closing_date = s(obj.closing_date);
  const property_address = s(obj.property_address);
  const property_city = s(obj.property_city);
  const property_province = s(obj.property_province);
  const property_postal_code = s(obj.property_postal_code);

  return {
    purchase_price,
    down_payment,
    finance_amount,
    closing_date,
    property_address,
    property_city,
    property_province,
    property_postal_code,
  };
}

export function fullName(
  obj: Record<string, any> | null | undefined,
  prefix: 'app' | 'co'
) {
  if (!obj) return null;
  const first = obj[`${prefix}-first`];
  const last = obj[`${prefix}-last`];
  const name = [first, last].filter(Boolean).join(' ').trim();
  return name || null;
}

type ParaOpts = Omit<IParagraphOptions, 'children'>;

export const P = (text: string | (string | TextRun)[], opts: any = {}) => {
  const children = Array.isArray(text)
    ? text.map((t) => (typeof t === 'string' ? new TextRun(t) : t))
    : [new TextRun(text)];

  return new Paragraph({
    ...opts,
    children,
  });
};

export const H2 = (text: string, opts: ParaOpts = {}) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 120 },
    children: [new TextRun({ text, bold: true })],
    ...opts,
  });

// Two-column table row
export const KV = (label: string, value: string) =>
  new TableRow({
    children: [
      new TableCell({
        width: { size: 40, type: WidthType.PERCENTAGE },
        children: [P(label)],
      }),
      new TableCell({
        width: { size: 60, type: WidthType.PERCENTAGE },
        children: [P(value)],
      }),
    ],
  });

export const signatureLine = (name: string) =>
  P(['______________________________', '\t', name], {
    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
    spacing: { after: 120 },
  });

export function buildApplicantBlocks(
  applicantName?: string,
  coApplicantName?: string
) {
  const line = '______________________________   ';

  const blocks: Paragraph[] = [
    P(applicantName || 'Client 1', {
      tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
      spacing: { after: 120 },
      children: [new TextRun(line), new TextRun(applicantName || 'Client 1')],
    }),
  ];

  if (coApplicantName) {
    blocks.push(
      P(coApplicantName, {
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { after: 120 },
        children: [new TextRun(line), new TextRun(coApplicantName)],
      })
    );
  }

  blocks.push(
    P('Signature', {
      spacing: { before: 200, after: 100 },
      children: [new TextRun(line), new TextRun('Signature')],
    })
  );

  return blocks;
}

export function getRandomFutureDate(daysAhead = 365) {
  const today = new Date();
  const randomDays = Math.floor(Math.random() * daysAhead) + 1; // 1 to daysAhead
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + randomDays);
  return futureDate.toISOString().split('T')[0]; // YYYY-MM-DD
}
