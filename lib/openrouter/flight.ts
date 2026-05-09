/**
 * 从 openrouter.ai rankings 页面的 HTML 中解析 Next.js React Flight payload。
 *
 * 每段 payload 形如 `self.__next_f.push([1,"<escaped>"])`，连接起来是 React Server
 * Components 的 Flight 流。我们不完整解析 Flight 协议，只从合并后的文本里按 key 搜
 * 并用简单的 bracket matching 切出对应的 JSON 数组/对象。
 */

/** 抽取并合并 HTML 中所有 Flight payload 段。 */
export function extractFlightPayload(html: string): string {
  const marker = 'self.__next_f.push([1,';
  const parts: string[] = [];
  let i = 0;
  while (true) {
    const start = html.indexOf(marker, i);
    if (start === -1) break;
    const quoteStart = html.indexOf('"', start + marker.length);
    if (quoteStart === -1) break;
    let j = quoteStart + 1;
    while (j < html.length) {
      const ch = html.charCodeAt(j);
      if (ch === 92 /* \\ */) {
        j += 2;
        continue;
      }
      if (ch === 34 /* " */) break;
      j += 1;
    }
    const raw = html.slice(quoteStart + 1, j);
    parts.push(unescapeJsString(raw));
    i = j + 1;
  }
  return parts.join('');
}

function unescapeJsString(s: string): string {
  return s.replace(
    /\\(u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|[\\\/"'bfnrt])/g,
    (_, esc: string) => {
      if (esc[0] === 'u') return String.fromCharCode(parseInt(esc.slice(1), 16));
      if (esc[0] === 'x') return String.fromCharCode(parseInt(esc.slice(1), 16));
      switch (esc) {
        case '\\': return '\\';
        case '/': return '/';
        case '"': return '"';
        case "'": return "'";
        case 'b': return '\b';
        case 'f': return '\f';
        case 'n': return '\n';
        case 'r': return '\r';
        case 't': return '\t';
        default: return esc;
      }
    },
  );
}

/**
 * 在 payload 中查找 `"<key>":` 后紧跟的 JSON 值，返回切片文本。
 * 支持 JSON 对象（`{...}`）、数组（`[...]`）；对字符串字面量不在此处理。
 * 若 key 多次出现，返回第一次命中。
 */
function sliceJsonAt(payload: string, key: string): string | null {
  const needle = `"${key}":`;
  const at = payload.indexOf(needle);
  if (at === -1) return null;
  let k = at + needle.length;
  while (k < payload.length && /\s/.test(payload[k])) k++;
  const open = payload[k];
  if (open !== '{' && open !== '[') return null;
  const close = open === '{' ? '}' : ']';
  let depth = 0;
  let inStr = false;
  for (let p = k; p < payload.length; p++) {
    const c = payload[p];
    if (inStr) {
      if (c === '\\') { p++; continue; }
      if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') { inStr = true; continue; }
    if (c === open) depth++;
    else if (c === close) {
      depth--;
      if (depth === 0) return payload.slice(k, p + 1);
    }
  }
  return null;
}

export function extractJsonArrayAt<T = unknown>(payload: string, key: string): T[] | null {
  const slice = sliceJsonAt(payload, key);
  if (!slice || !slice.startsWith('[')) return null;
  try {
    return JSON.parse(slice) as T[];
  } catch {
    return null;
  }
}

export function extractJsonObjectAt<T = unknown>(payload: string, key: string): T | null {
  const slice = sliceJsonAt(payload, key);
  if (!slice || !slice.startsWith('{')) return null;
  try {
    return JSON.parse(slice) as T;
  } catch {
    return null;
  }
}
