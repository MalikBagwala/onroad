import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
// import { compression } from 'vite-plugin-compression2';
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    sentryVitePlugin({
      org: 'malikbagwala',
      project: 'onroad-client',
    }),
  ],

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.mjs',
  },

  server: {
    host: '0.0.0.0',
    port: 5000,
  },

  build: {
    sourcemap: true,
  },
});
