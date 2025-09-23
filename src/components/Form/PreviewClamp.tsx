import React from 'react';

export default function PreviewClamp({
  open,
  previewCount = 1,
  children,
}: {
  open: boolean;
  previewCount?: number;
  children: React.ReactNode;
}) {
  const items = React.Children.toArray(children);

  // When open, render everything exactly as-is (keeps grid col-spans intact).
  if (open) return <>{items}</>;

  // When closed, render only the first N direct children.
  // Everything after N is wrapped in a hidden div so we don't mutate child props.
  return (
    <>
      {items.map((child, i) => {
        // Use the child's existing key if present; otherwise fall back to index.
        const rawKey =
          React.isValidElement(child) && child.key != null ? child.key : i;
        const key = typeof rawKey === 'string' ? rawKey : String(rawKey);

        if (i < previewCount) {
          return <React.Fragment key={key}>{child}</React.Fragment>;
        }

        return (
          <div key={key} className="hidden" aria-hidden>
            {child}
          </div>
        );
      })}
    </>
  );
}
