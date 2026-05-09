import { providerLabel } from '@/lib/i18n/providers';

export function ProviderBadge({ author }: { author: string }) {
  const label = providerLabel(author);
  const letter = (author?.[0] ?? '?').toUpperCase();
  return (
    <span className="inline-flex items-center gap-1.5 min-w-0">
      <span className="flex-none w-5 h-5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold flex items-center justify-center">
        {letter}
      </span>
      <span className="truncate text-slate-500 text-xs">{label}</span>
    </span>
  );
}
