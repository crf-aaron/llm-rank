import { fetchModelMeta, fetchRankings } from '@/lib/openrouter/scrape';
import { RankingTable } from '@/components/RankingTable';
import { formatDate } from '@/lib/format';

export const revalidate = 3600;

export default async function Home() {
  let snapshot;
  let error: string | null = null;
  try {
    snapshot = await fetchRankings();
  } catch (e) {
    error = e instanceof Error ? e.message : '数据获取失败';
  }

  const metaMap = await fetchModelMeta().catch(() => new Map());

  const rows = snapshot?.rankings ?? [];
  const latest = snapshot?.latestDate ?? '';

  return (
    <div className="flex flex-col gap-5">
      <section className="pt-2">
        <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
          今日模型排行
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          按 OpenRouter 路由的真实 token 用量排序
          {latest && (
            <>
              ，数据日期：<span className="tabular-nums">{formatDate(latest)}</span>
            </>
          )}
        </p>
      </section>

      {snapshot && (
        <div className="text-xs text-slate-400">共 {rows.length} 个模型</div>
      )}

      {error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 text-rose-700 text-sm px-4 py-6 text-center">
          数据获取失败：{error}
          <div className="text-xs text-rose-500 mt-2">
            稍候再刷新，或查看源站 openrouter.ai/rankings
          </div>
        </div>
      ) : (
        <RankingTable rows={rows} limit={50} metaMap={metaMap} />
      )}
    </div>
  );
}
