import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { apiDev } from './vite-plugins/api-dev.js'

export default defineConfig(({ command, mode, isSsrBuild }) => {
  // Make every .env key (not just VITE_*) available to the /api functions run
  // by apiDev — GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_TO. These never reach
  // the browser bundle: only VITE_-prefixed keys are exposed to client code.
  // A real environment variable always wins over the file.
  const env = loadEnv(mode, process.cwd(), '')
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) process.env[key] = value
  }

  return {
    plugins: [react(), apiDev()],
    server: { port: 5173 },
    esbuild: command === 'build' ? { drop: ['console', 'debugger'] } : undefined,
    build: {
      target: 'es2020',
      sourcemap: false,
      // The SSR bundle (used only by scripts/prerender.js) keeps React external,
      // so the vendor split applies to the browser build alone.
      rollupOptions: isSsrBuild
        ? {}
        : {
            output: {
              manualChunks: {
                react: ['react', 'react-dom', 'react-router-dom'],
              },
            },
          },
    },
  }
})
