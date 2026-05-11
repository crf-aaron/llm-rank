import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import './globals.css';
import { SITE } from '@/lib/i18n/labels';

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} · ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.desc,
  keywords: [
    '大模型排行',
    'LLM 排行榜',
    'Claude',
    'GPT',
    'DeepSeek',
    'Qwen',
    '通义千问',
    'Kimi',
    '豆包',
    'OpenRouter',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 min-w-0">
              <span className="text-base font-semibold text-slate-900">{SITE.name}</span>
              <span className="hidden sm:inline text-xs text-slate-400">
                {SITE.tagline}
              </span>
            </Link>
            <nav className="flex items-center gap-4 text-sm text-slate-600">
              <Link href="/" className="hover:text-slate-900">排行</Link>
              <Link href="/apps" className="hover:text-slate-900">应用</Link>
            </nav>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-4">{children}</main>

        <footer className="max-w-5xl mx-auto px-4 py-8 text-xs text-slate-400 space-y-1">
          <p>
            数据抓取自{' '}
            <a
              href="https://openrouter.ai/rankings"
              target="_blank"
              rel="noreferrer noopener"
              className="underline"
            >
              openrouter.ai/rankings
            </a>
            ，每小时刷新。本站为非官方镜像，仅作信息展示参考。
          </p>
          <p>模型用量仅代表通过 OpenRouter 路由的请求，不等同于模型总体市场份额。</p>
        </footer>
      </body>
    </html>
  );
}
