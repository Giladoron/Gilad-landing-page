import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // Load env vars, but don't fail if .env.local doesn't exist
    const env = loadEnv(mode, '.', '');
    const buildVersion = Date.now().toString();
    
    return {
      base: '/',
      server: {
        port: 3000,
        host: '127.0.0.1',
        open: '/Gilad-landing-page/',
        watch: {
          usePolling: true,
          interval: 300,
        },
      },
      plugins: [
        react(),
        // Inject build version meta tag for cache busting
        {
          name: 'html-transform',
          transformIndexHtml(html) {
            return html.replace(
              '<head>',
              `<head>\n    <meta name="build-version" content="${buildVersion}">`
            );
          },
        },
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
