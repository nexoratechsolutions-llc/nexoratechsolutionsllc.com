import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { apiDevServer } from './vite-plugins/apiDevServer.js'

export default defineConfig(({ mode }) => {
  // The empty prefix loads every key, not just VITE_*, so the dev API handlers
  // can read FORM_TOKEN_SECRET, TURNSTILE_SECRET_KEY, GMAIL_* and the rest.
  // A real environment variable always wins over the file.
  const env = loadEnv(mode, process.cwd(), '')
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) process.env[key] = value
  }

  return {
    plugins: [react(), apiDevServer()],
    server: {
      port: 5173,
      // No /api proxy: apiDevServer runs the functions in-process, so
      // `npm run dev` serves the site and the API together.
    },
    build: {
      target: 'es2020',
      minify: 'terser',
      sourcemap: false,
      terserOptions: {
        compress: { drop_console: true, drop_debugger: true },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
          },
        },
      },
    },
  }
})
