import type { AppRow } from '@/lib/openrouter/types';
import { formatCount, formatTokens } from '@/lib/format';

export function AppList({ rows, limit = 20 }: { rows: AppRow[]; limit?: number }) {
  const items = rows.slice(0, limit);
  if (!items.length) {
    return <div className="py-10 text-center text-slate-400 text-sm">暂无数据</div>;
  }
  return (
    <ul className="flex flex-col gap-2">
      {items.map((r, i) => {
        const href = r.app?.origin_url || r.app?.main_url || undefined;
        const title = r.app?.title ?? `App #${r.app_id}`;
        const desc = r.app?.description ?? '';
        const tokens = Number(r.total_tokens) || 0;
        return (
          <li
            key={r.app_id}
            className="rounded-xl border border-slate-200 bg-white px-3 py-3 flex items-start gap-3"
          >
            <div className="flex-none w-8 text-center font-semibold text-slate-400 tabular-nums pt-0.5">
              {i + 1}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 min-w-0">
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="truncate text-slate-900 text-sm font-medium hover:underline"
                  >
                    {title}
                  </a>
                ) : (
                  <span className="truncate text-slate-900 text-sm font-medium">{title}</span>
                )}
              </div>
              {desc && (
                <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">{desc}</p>
              )}
            </div>
            <div className="flex-none text-right">
              <div className="text-sm font-semibold text-slate-900 tabular-nums">
                {formatTokens(tokens)}
              </div>
              <div className="text-[11px] text-slate-400 tabular-nums">
                {formatCount(r.total_requests)} 次
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
