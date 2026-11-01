/**
 * Tiny fetch helper with timeout + retry, shared by all source adapters.
 *
 * Source adapters are the ONLY place that pulls original-language text and
 * translations into OpenCouncil. They must always return text *verbatim* from
 * an authoritative, citable source — never paraphrased or model-generated.
 *
 * Transport: tries Node's global fetch first, then falls back to `curl`. In some
 * environments undici's connect times out on flaky IPv6 hosts (e.g. wikisource)
 * while curl succeeds, so the fallback keeps collection reliable.
 */
import { setDefaultResultOrder } from 'node:dns';
import { execFile } from 'node:child_process';

try {
  setDefaultResultOrder('ipv4first');
} catch {
  /* older node — ignore */
}

const UA = 'OpenCouncil/0.1 (content collector; +https://github.com/linjiejim/OpenCouncil)';

function curlText(url: string, timeoutMs: number): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile(
      'curl',
      ['-sSLf', '-4', '--max-time', String(Math.ceil(timeoutMs / 1000)), '-A', UA, url],
      { maxBuffer: 64 * 1024 * 1024 },
      (err, stdout) => {
        if (err) reject(err);
        else if (!stdout) reject(new Error(`curl returned empty for ${url}`));
        else resolve(stdout);
      },
    );
  });
}

async function once(url: string, timeoutMs: number): Promise<string> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, { signal: ctrl.signal, headers: { 'User-Agent': UA } });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return await res.text();
    } finally {
      clearTimeout(t);
    }
  } catch {
    // Fall back to curl, which is more reliable for some hosts in this environment.
    return curlText(url, timeoutMs);
  }
}

export async function fetchText(url: string, timeoutMs = 25_000, retries = 2): Promise<string> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await once(url, timeoutMs);
    } catch (err) {
      lastErr = err;
      if (attempt < retries) await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
    }
  }
  throw new Error(`fetchText failed after ${retries + 1} attempts: ${String(lastErr)}`);
}

export async function fetchJson<T = unknown>(url: string, timeoutMs = 25_000, retries = 2): Promise<T> {
  const body = await fetchText(url, timeoutMs, retries);
  return JSON.parse(body) as T;
}
