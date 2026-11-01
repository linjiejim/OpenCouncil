// PM2 process definition (see DEPLOY.md).
// The API process also serves the prebuilt web SPA (apps/web/dist), so one
// process answers both /api/* and the client app. It listens on API_PORT from .env.
module.exports = {
  apps: [
    {
      name: 'opencouncil',
      script: 'apps/api/src/index.ts',
      interpreter: './node_modules/.bin/tsx',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
      },
      error_file: 'logs/error.log',
      out_file: 'logs/out.log',
      merge_logs: true,
      max_restarts: 10,
      restart_delay: 3000,
    },
  ],
};
