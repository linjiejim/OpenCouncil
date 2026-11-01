# OpenCouncil — Agent API

A small, authenticated surface that lets other agents consult humanity's great
thinkers — grounded in primary sources, traceable, cross-tradition.

**Design stance:** *perspectives, not verdicts.* Every result is cited to a
primary source you can independently verify; the API never hands down a single
authoritative answer. Use it to **widen** an agent's consideration of a human
question, not to outsource judgment.

The public browser app (`/api/*`) is unchanged and unauthenticated. Only the
`/api/agent/*` namespace requires a key.

## Auth

Send your key as a bearer token:

```
Authorization: Bearer <token>
```

Mint a key (writes a row to `api_keys`, storing only its SHA-256 hash; prints the
token once):

```bash
pnpm agent:mint-key <label> [dailyQuota]          # generate a new token
AGENT_TOKEN=oc_xxx pnpm agent:mint-key <label>    # register a specific token
```

Keys are per-process rate-limited (token bucket, default burst 20 @ 5/s) and have
a daily quota (default 1000 req/day). Responses include
`X-RateLimit-Daily-Remaining`; `429` with `Retry-After` when throttled.

## Endpoints

### `GET /api/agent/health`
Authed liveness ping. Returns `{ ok, key, time }`.

### `GET /api/agent/passages?q=<question>&limit=<1-20>`
Cited, cross-tradition retrieval over the **verified** corpus. No LLM — fast and
cheap. English keywords work best. Responses are cached for 1h (`X-Cache:
HIT|MISS`).

Response:

```jsonc
{
  "query": "how to face death",
  "grounding": { "coverage": "strong", "passagesFound": 3 }, // strong | thin | none
  "passages": [
    {
      "thinker": "Prophet Muhammad",
      "tradition": "islam",
      "era": "570–632 CE",
      "work": "The Quran (Selected Verses)",
      "chapter": "Al-Baqarah (The Cow)",
      "canonicalRef": "Quran 2:156",
      "originalText": "…",
      "englishText": "…",
      "summary": "…",
      "citation": {
        "canonicalRef": "Quran 2:156",
        "sourceUrl": "https://quran.com/2/156",
        "translator": "Marmaduke Pickthall (1930)",
        "license": "public-domain",
        "originalLang": "arabic",
        "verificationStatus": "verified"
      }
    }
  ],
  "disclaimer": "Perspectives grounded in primary sources, offered to widen consideration — not directives. Verify every citation via its sourceUrl."
}
```

**Honesty signal:** always check `grounding.coverage`. `none`/`thin` means the
corpus has little to say on this question — treat it as "insufficient grounding,"
not as a confident answer.

## Errors

| Status | Meaning |
|---|---|
| `400` | Missing `q` |
| `401` | Missing / invalid / disabled key |
| `429` | Rate limit or daily quota exceeded |
| `500` | Retrieval error |

## Roadmap (not yet built)

`POST /api/agent/consult` (LLM synthesis with consensus/tensions), a daily
reflection feed (JSON Feed + Atom), and an MCP server — all reuse this same
auth / rate-limit / cache stack.
