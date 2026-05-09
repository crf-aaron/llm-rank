import type { ModelRanking, RawRankingRow } from './types';

/** 聚合最新一天的 rankingData，按 token 总量排序并计算与前一天的变化。 */
export function aggregateLatestDay(raw: RawRankingRow[]): ModelRanking[] {
  if (!raw.length) return [];

  const dates = Array.from(new Set(raw.map((r) => r.date))).sort();
  const latest = dates[dates.length - 1];
  const prev = dates.length >= 2 ? dates[dates.length - 2] : null;

  interface Bucket {
    modelSlug: string;
    variant: string;
    variantPermaslug: string;
    prompt: number;
    completion: number;
    requests: number;
    prevTokens: number;
  }

  const map = new Map<string, Bucket>();
  for (const r of raw) {
    const key = r.variant_permaslug;
    let b = map.get(key);
    if (!b) {
      b = {
        modelSlug: stripDateSuffix(r.model_permaslug),
        variant: r.variant,
        variantPermaslug: r.variant_permaslug,
        prompt: 0,
        completion: 0,
        requests: 0,
        prevTokens: 0,
      };
      map.set(key, b);
    }
    const tokens = num(r.total_prompt_tokens) + num(r.total_completion_tokens);
    if (r.date === latest) {
      b.prompt += num(r.total_prompt_tokens);
      b.completion += num(r.total_completion_tokens);
      b.requests += num(r.count);
    } else if (r.date === prev) {
      b.prevTokens += tokens;
    }
  }

  const rows = Array.from(map.values())
    .map((b) => ({ ...b, tokens: b.prompt + b.completion }))
    .filter((r) => r.tokens > 0);
  rows.sort((a, b) => b.tokens - a.tokens);

  const totalTokens = rows.reduce((acc, r) => acc + r.tokens, 0) || 1;

  return rows.map((r, idx) => {
    const changePct =
      prev && r.prevTokens > 0 ? (r.tokens - r.prevTokens) / r.prevTokens : null;
    return {
      rank: idx + 1,
      modelSlug: r.modelSlug,
      variant: r.variant,
      variantPermaslug: r.variantPermaslug,
      displayName: r.modelSlug,
      shortName: r.modelSlug.split('/').pop() ?? r.modelSlug,
      author: r.modelSlug.split('/')[0] ?? '',
      tokens: r.tokens,
      promptTokens: r.prompt,
      completionTokens: r.completion,
      requests: r.requests,
      share: r.tokens / totalTokens,
      changePct,
    } satisfies ModelRanking;
  });
}

function num(v: unknown): number {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') return Number(v) || 0;
  return 0;
}

/** openrouter 的 model_permaslug 带日期后缀（如 -20260416），聚合前抹掉便于合并。 */
function stripDateSuffix(slug: string): string {
  return slug.replace(/-\d{8}$/, '');
}
