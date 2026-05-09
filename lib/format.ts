/** 将 token 数格式化为 "1.23B" / "4.5M" / "12.3K"。 */
export function formatTokens(n: number): string {
  if (!n || n <= 0) return '0';
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(n);
}

export function formatCount(n: number): string {
  if (!n || n <= 0) return '0';
  if (n >= 1e8) return `${(n / 1e8).toFixed(2)}亿`;
  if (n >= 1e4) return `${(n / 1e4).toFixed(1)}万`;
  return n.toLocaleString('zh-CN');
}

export function formatShare(share: number): string {
  if (!isFinite(share) || share <= 0) return '—';
  const pct = share * 100;
  if (pct < 0.01) return '<0.01%';
  if (pct < 1) return `${pct.toFixed(2)}%`;
  return `${pct.toFixed(1)}%`;
}

export function formatChange(change: number | null): {
  text: string;
  tone: 'up' | 'down' | 'flat' | 'na';
} {
  if (change === null || !isFinite(change)) return { text: '—', tone: 'na' };
  const pct = change * 100;
  if (Math.abs(pct) < 0.5) return { text: '0%', tone: 'flat' };
  if (pct > 0) return { text: `+${pct.toFixed(1)}%`, tone: 'up' };
  return { text: `${pct.toFixed(1)}%`, tone: 'down' };
}

export function formatDate(d: string): string {
  if (!d) return '';
  const s = d.slice(0, 10);
  return s.replace(/-/g, '/');
}
