import { ChevronDownIcon } from '@heroicons/react/16/solid';

export default function SectionHeader({
  title,
  description,
  open,
  onToggle,
}: {
  title: string;
  description?: string;
  open: boolean;
  onToggle: () => void;
}) {
  const slug = title.replace(/\s+/g, '-').toLowerCase();
  return (
    <div className="px-4 sm:px-0">
      <button
        type="button"
        onClick={onToggle}
        className="group flex w-full items-start gap-3 text-left"
        aria-expanded={open}
        aria-controls={`${slug}-panel`}
      >
        <ChevronDownIcon
          aria-hidden="true"
          className={`size-5 shrink-0 translate-y-1 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
        <div>
          <h2 className="text-base/7 font-semibold text-gray-900">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm/6 text-gray-600">{description}</p>
          ) : null}
        </div>
      </button>
    </div>
  );
}
