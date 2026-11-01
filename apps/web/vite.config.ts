import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  // The API reads API_PORT from the repo-root .env; proxy to the same port.
  const env = loadEnv(mode, fileURLToPath(new URL('../..', import.meta.url)), '');
  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: `http://localhost:${env.API_PORT || 3001}`,
          changeOrigin: true,
        },
      },
    },
  };
});
