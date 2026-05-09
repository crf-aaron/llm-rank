export interface RawRankingRow {
  date: string;
  model_permaslug: string;
  variant: string;
  variant_permaslug: string;
  total_completion_tokens: number;
  total_prompt_tokens: number;
  total_native_tokens_reasoning: number;
  count: number;
  num_media_prompt: number;
  num_media_completion: number;
  num_audio_prompt: number;
  total_native_tokens_cached: number;
  total_tool_calls: number;
  requests_with_tool_call_errors: number;
  change: number | null;
}

export interface ModelRanking {
  rank: number;
  modelSlug: string;
  variant: string;
  variantPermaslug: string;
  displayName: string;
  shortName: string;
  author: string;
  tokens: number;
  promptTokens: number;
  completionTokens: number;
  requests: number;
  share: number;
  changePct: number | null;
}

export interface AppRow {
  app_id: number;
  total_tokens: string;
  total_requests: number;
  rank: number;
  app: {
    id: number;
    title: string;
    description?: string;
    slug?: string;
    origin_url?: string | null;
    main_url?: string | null;
  };
}

export interface RankingSnapshot {
  fetchedAt: string;
  latestDate: string;
  rankings: ModelRanking[];
  apps: AppRow[];
}

export interface ModelMeta {
  slug: string;
  name: string;
  shortName: string;
  author: string;
  description?: string;
  contextLength?: number;
  createdAt?: string;
}
