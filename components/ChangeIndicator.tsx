import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { formatChange } from '@/lib/format';

export function ChangeIndicator({ change }: { change: number | null }) {
  const { text, tone } = formatChange(change);
  if (tone === 'up')
    return (
      <span className="inline-flex items-center gap-0.5 text-emerald-600 text-xs tabular-nums">
        <ArrowUp size={12} /> {text}
      </span>
    );
  if (tone === 'down')
    return (
      <span className="inline-flex items-center gap-0.5 text-rose-600 text-xs tabular-nums">
        <ArrowDown size={12} /> {text}
      </span>
    );
  if (tone === 'flat')
    return (
      <span className="inline-flex items-center gap-0.5 text-slate-400 text-xs tabular-nums">
        <Minus size={12} /> {text}
      </span>
    );
  return <span className="text-slate-400 text-xs">—</span>;
}
