// PM2 process definition (see DEPLOY.md).
// The API process also serves the prebuilt web SPA (apps/web/dist), so one
// process answers both /api/* and the client app. It listens on API_PORT from .env.
module.exports = {
  apps: [
    {
      name: 'opencouncil',
      script: 'apps/api/src/index.ts',
      // `node --import tsx` instead of the tsx CLI: the CLI spawns a second node process and
      // pm2 only measures the outer one (~3–10 MB), so max_memory_restart would never fire.
      // The host has ~3.6 GB RAM shared by every site (see the jim-server deploy notes).
      interpreter: 'node',
      interpreter_args: '--import tsx',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
      },
      error_file: 'logs/error.log',
      out_file: 'logs/out.log',
      merge_logs: true,
      max_restarts: 10,
      restart_delay: 3000,
      max_memory_restart: '300M',
    },
  ],
};
