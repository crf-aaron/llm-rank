import { cache } from 'react';
import { extractFlightPayload, extractJsonArrayAt, extractJsonObjectAt } from './flight';
import { aggregateLatestDay } from './aggregate';
import type { AppRow, ModelMeta, RankingSnapshot, RawRankingRow } from './types';

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

const RANKINGS_URL = 'https://openrouter.ai/rankings';

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      'user-agent': USER_AGENT,
      accept: 'text/html,application/xhtml+xml',
      'accept-language': 'en-US,en;q=0.9',
    },
    next: { revalidate: 3600, tags: ['rankings'] },
  });
  if (!res.ok) {
    throw new Error(`upstream ${res.status} for ${url}`);
  }
  return res.text();
}

function parseSnapshot(html: string): RankingSnapshot {
  const payload = extractFlightPayload(html);
  const raw = extractJsonArrayAt<RawRankingRow>(payload, 'rankingData') ?? [];
  const rankMap = extractJsonObjectAt<{ day: AppRow[] }>(payload, 'rankMap');

  const dates = Array.from(new Set(raw.map((r) => r.date))).sort();
  const latestDate = dates[dates.length - 1] ?? '';

  return {
    fetchedAt: new Date().toISOString(),
    latestDate,
    rankings: aggregateLatestDay(raw),
    apps: rankMap?.day ?? [],
  };
}

/** 抓取今日模型用量快照。同一请求周期内去重；底层通过 Next fetch ISR 缓存 1h。 */
export const fetchRankings = cache(async (): Promise<RankingSnapshot> => {
  const html = await fetchHtml(RANKINGS_URL);
  return parseSnapshot(html);
});

/** 拉取模型元信息（名字、厂商、上下文长度等）。response 大，进程级缓存 6 小时。 */
let modelMetaCache: { at: number; map: Map<string, ModelMeta> } | null = null;
const MODEL_META_TTL_MS = 6 * 60 * 60 * 1000;

export const fetchModelMeta = cache(async (): Promise<Map<string, ModelMeta>> => {
  if (modelMetaCache && Date.now() - modelMetaCache.at < MODEL_META_TTL_MS) {
    return modelMetaCache.map;
  }
  const res = await fetch('https://openrouter.ai/api/frontend/models', {
    headers: { 'user-agent': USER_AGENT },
    cache: 'no-store',
  });
  if (!res.ok) return modelMetaCache?.map ?? new Map();
  const json = (await res.json()) as {
    data: Array<{
      slug: string;
      name: string;
      short_name: string;
      author: string;
      author_display_name?: string;
      description?: string;
      context_length?: number;
      created_at?: string;
    }>;
  };
  const map = new Map<string, ModelMeta>();
  for (const m of json.data ?? []) {
    map.set(m.slug, {
      slug: m.slug,
      name: m.name,
      shortName: m.short_name,
      author: m.author_display_name ?? m.author,
      description: m.description,
      contextLength: m.context_length,
      createdAt: m.created_at,
    });
  }
  modelMetaCache = { at: Date.now(), map };
  return map;
});
