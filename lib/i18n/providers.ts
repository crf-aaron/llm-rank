/**
 * openrouter 的 author 名（slug）到中文显示名的映射。
 * 未命中时返回原 slug（保持英文）。
 */
export const PROVIDER_LABELS: Record<string, string> = {
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  google: 'Google',
  'google-vertex': 'Google Vertex',
  'x-ai': 'xAI',
  meta: 'Meta',
  'meta-llama': 'Meta Llama',
  mistralai: 'Mistral',
  cohere: 'Cohere',
  perplexity: 'Perplexity',
  nvidia: 'NVIDIA',
  microsoft: 'Microsoft',
  amazon: 'Amazon',

  // 国内厂商
  qwen: '通义千问（Qwen）',
  deepseek: 'DeepSeek 深度求索',
  moonshotai: 'Moonshot 月之暗面',
  'z-ai': '智谱 Z.AI',
  zhipu: '智谱 AI',
  tencent: '腾讯混元',
  baidu: '百度文心',
  bytedance: '字节豆包',
  alibaba: '阿里云',
  minimax: 'MiniMax',
  '01-ai': '零一万物',
  stepfun: '阶跃星辰',
  'ai21': 'AI21',
  xunfei: '讯飞星火',
  baichuan: '百川智能',
  skywork: '昆仑天工',
  sensenova: '商汤日日新',
  'inclusion-ai': 'inclusionAI',
  inclusionai: 'inclusionAI',
  'nous-research': 'Nous Research',
  liquid: 'Liquid',
  reka: 'Reka',
  databricks: 'Databricks',
  inflection: 'Inflection',
  openrouter: 'OpenRouter',
};

export function providerLabel(author: string): string {
  if (!author) return '';
  const key = author.toLowerCase();
  return PROVIDER_LABELS[key] ?? author;
}
