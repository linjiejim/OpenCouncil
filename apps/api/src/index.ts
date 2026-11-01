import { config } from 'dotenv';
config();

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { createDatabase } from '@opencouncil/db';
import { thinkersRoute } from './routes/thinkers.js';
import { worksRoute } from './routes/works.js';
import { passagesRoute } from './routes/passages.js';
import { searchRoute } from './routes/search.js';
import { councilRoute } from './routes/council.js';
import { themesRoute } from './routes/themes.js';
import { agentRoute } from './routes/agent.js';

const DATABASE_URL = process.env.DATABASE_URL ?? 'postgresql://opencouncil:opencouncil@localhost:5432/opencouncil';
const PORT = Number(process.env.API_PORT ?? 3001);

const db = createDatabase(DATABASE_URL);
const app = new Hono();

app.use('*', cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));

// Health check
app.get('/api/health', (c) => c.json({ status: 'ok', time: new Date().toISOString() }));

// Mount routes
app.route('/api/thinkers', thinkersRoute(db));
app.route('/api/works', worksRoute(db));
app.route('/api/passages', passagesRoute(db));
app.route('/api/search', searchRoute(db));
app.route('/api/council', councilRoute(db));
app.route('/api/themes', themesRoute(db));
app.route('/api/agent', agentRoute(db)); // authed (bearer key), rate-limited, cached

// In production the same process also serves the built web SPA (apps/web/dist),
// so one origin answers both `/api/*` (above) and the client app + its routes.
// Harmless in dev (dist may be absent; the Vite server handles the UI on :5173).
const WEB_DIST = process.env.WEB_DIST ?? './apps/web/dist';
app.use('/*', serveStatic({ root: WEB_DIST }));
app.get('/*', serveStatic({ path: `${WEB_DIST}/index.html` }));

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`🏛️  OpenCouncil API running at http://localhost:${info.port}`);
});
