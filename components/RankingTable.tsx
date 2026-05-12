import type { ModelMeta, ModelRanking } from '@/lib/openrouter/types';
import { formatCount, formatShare, formatTokens } from '@/lib/format';
import { providerLabel } from '@/lib/i18n/providers';
import { ChangeIndicator } from './ChangeIndicator';
import { ProviderBadge } from './ProviderBadge';

interface Props {
  rows: ModelRanking[];
  limit?: number;
  metaMap?: Map<string, ModelMeta>;
}

function lookupMeta(
  r: ModelRanking,
  metaMap?: Map<string, ModelMeta>,
): ModelMeta | undefined {
  if (!metaMap) return undefined;
  return (
    metaMap.get(r.variantPermaslug) ??
    metaMap.get(r.modelSlug) ??
    metaMap.get(`${r.modelSlug}:${r.variant}`)
  );
}

export function RankingTable({ rows, limit = 50, metaMap }: Props) {
  const items = rows.slice(0, limit);
  const hasChangeData = items.some((r) => r.changePct !== null);

  if (!items.length) {
    return (
      <div className="py-12 text-center text-slate-400 text-sm">
        暂无数据
      </div>
    );
  }

  return (
    <div>
      {/* 移动端：卡片列表 */}
      <ul className="md:hidden flex flex-col gap-2">
        {items.map((r) => {
          const meta = lookupMeta(r, metaMap);
          const display = meta?.shortName ?? r.shortName;
          const author = meta?.author ?? providerLabel(r.author);
          return (
            <li
              key={r.variantPermaslug}
              className="rounded-xl border border-slate-200 bg-white px-3 py-3 flex items-center gap-3"
            >
              <div className="flex-none w-8 text-center font-semibold text-slate-400 tabular-nums">
                {r.rank}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="truncate text-slate-900 text-sm font-medium">
                    {display}
                  </span>
                  {r.variant && r.variant !== 'standard' && (
                    <span className="flex-none text-[10px] px-1 py-0.5 rounded bg-slate-100 text-slate-500">
                      {r.variant}
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-xs text-slate-500 truncate">{author}</div>
              </div>
              <div className="flex-none text-right">
                <div className="text-sm font-semibold text-slate-900 tabular-nums">
                  {formatTokens(r.tokens)}
                </div>
                {hasChangeData && (
                  <div className="text-[11px]">
                    <ChangeIndicator change={r.changePct} />
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* 桌面端：表格 */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-400 text-xs uppercase tracking-wide border-b border-slate-200">
              <th className="text-left font-medium py-2 pl-2 w-14">#</th>
              <th className="text-left font-medium py-2">模型</th>
              <th className="text-left font-medium py-2">厂商</th>
              <th className="text-right font-medium py-2">Tokens</th>
              <th className="text-right font-medium py-2 hidden lg:table-cell">请求数</th>
              <th className="text-right font-medium py-2">占比</th>
              {hasChangeData && (
                <th className="text-right font-medium py-2 pr-2">昨日变化</th>
              )}
            </tr>
          </thead>
          <tbody>
            {items.map((r) => {
              const meta = lookupMeta(r, metaMap);
              const display = meta?.shortName ?? r.shortName;
              return (
                <tr
                  key={r.variantPermaslug}
                  className="border-b border-slate-100 hover:bg-slate-50/60"
                >
                  <td className="py-2.5 pl-2 text-slate-400 tabular-nums">{r.rank}</td>
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="truncate max-w-[32ch] text-slate-900 font-medium">
                        {display}
                      </span>
                      {r.variant && r.variant !== 'standard' && (
                        <span className="flex-none text-[10px] px-1 py-0.5 rounded bg-slate-100 text-slate-500">
                          {r.variant}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 pr-3 min-w-0">
                    <ProviderBadge author={r.author} />
                  </td>
                  <td className="py-2.5 pr-3 text-right tabular-nums font-medium">
                    {formatTokens(r.tokens)}
                  </td>
                  <td className="py-2.5 pr-3 text-right tabular-nums text-slate-500 hidden lg:table-cell">
                    {formatCount(r.requests)}
                  </td>
                  <td className="py-2.5 pr-3 text-right tabular-nums text-slate-500">
                    {formatShare(r.share)}
                  </td>
                  {hasChangeData && (
                    <td className="py-2.5 pr-2 text-right">
                      <ChangeIndicator change={r.changePct} />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
