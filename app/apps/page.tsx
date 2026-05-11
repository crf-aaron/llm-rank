import { fetchRankings } from '@/lib/openrouter/scrape';
import { AppList } from '@/components/AppList';
import { formatDate } from '@/lib/format';

export const revalidate = 3600;

export const metadata = { title: '热门应用' };

export default async function AppsPage() {
  let snapshot;
  let error: string | null = null;
  try {
    snapshot = await fetchRankings();
  } catch (e) {
    error = e instanceof Error ? e.message : '数据获取失败';
  }

  const rows = snapshot?.apps ?? [];
  const latest = snapshot?.latestDate ?? '';

  return (
    <div className="flex flex-col gap-5">
      <section className="pt-2">
        <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
          热门应用排行
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          调用 OpenRouter 次数最多的第三方应用
          {latest && (
            <>
              ，数据日期：<span className="tabular-nums">{formatDate(latest)}</span>
            </>
          )}
        </p>
      </section>

      {snapshot && (
        <div className="text-xs text-slate-400">共 {rows.length} 个应用</div>
      )}

      {error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 text-rose-700 text-sm px-4 py-6 text-center">
          数据获取失败：{error}
        </div>
      ) : (
        <AppList rows={rows} limit={30} />
      )}
    </div>
  );
}
