/**
 * DeepSeek's v4 models think by default, and the reasoning counts against
 * `max_tokens`: with the council's long prompt it can use up the whole budget
 * and return empty content (finish_reason "length"). Every call here wants a
 * direct answer, so thinking is turned off. The OpenAI SDK forwards extra body
 * fields as-is.
 */
export const NO_THINKING: Record<string, unknown> = { thinking: { type: 'disabled' } };
