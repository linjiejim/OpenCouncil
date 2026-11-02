/**
 * The model provider, configured only through environment variables so switching
 * providers (DeepSeek → OpenRouter …) never needs a code change:
 *
 *   LLM_BASE_URL   OpenAI-compatible base URL, e.g. https://openrouter.ai/api/v1
 *   LLM_API_KEY    API key for that provider
 *   LLM_MODEL      model id, e.g. deepseek/deepseek-v4-flash
 *   LLM_EXTRA_BODY optional JSON merged into every request body
 *
 * Unset values fall back to the original DEEPSEEK_API_KEY / DEEPSEEK_BASE_URL and
 * `deepseek-v4-flash`.
 */
import OpenAI from 'openai';

export interface LlmConfig {
  baseURL: string;
  apiKey: string;
  model: string;
  /** Extra request-body fields, spread into every chat completion call. */
  extraBody: Record<string, unknown>;
}

/**
 * DeepSeek's v4 models think by default and the reasoning counts against
 * `max_tokens`: with the council's long prompt it can use up the whole budget and
 * return empty content. Every call here wants a direct answer, so on DeepSeek's own
 * API thinking is turned off. For other providers set LLM_EXTRA_BODY if needed.
 */
function defaultExtraBody(baseURL: string): Record<string, unknown> {
  return /(^|\.)deepseek\.com/.test(new URL(baseURL).host) ? { thinking: { type: 'disabled' } } : {};
}

export function llmConfig(env: NodeJS.ProcessEnv = process.env): LlmConfig {
  const baseURL = env.LLM_BASE_URL || `${env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'}/v1`;
  let extraBody = defaultExtraBody(baseURL);
  if (env.LLM_EXTRA_BODY) {
    try {
      extraBody = JSON.parse(env.LLM_EXTRA_BODY) as Record<string, unknown>;
    } catch {
      console.warn('LLM_EXTRA_BODY is not valid JSON — ignored');
    }
  }
  return {
    baseURL,
    apiKey: env.LLM_API_KEY || env.DEEPSEEK_API_KEY || '',
    model: env.LLM_MODEL || 'deepseek-v4-flash',
    extraBody,
  };
}

/** The slice of the OpenAI client the routes use (so tests can pass a fake). */
export type ChatClient = Pick<OpenAI, 'chat'>;

export interface Llm {
  client: ChatClient;
  model: string;
  extraBody: Record<string, unknown>;
}

export function createLlm(env: NodeJS.ProcessEnv = process.env): Llm {
  const cfg = llmConfig(env);
  return { client: new OpenAI({ apiKey: cfg.apiKey, baseURL: cfg.baseURL }), model: cfg.model, extraBody: cfg.extraBody };
}
