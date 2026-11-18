import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-images-dir',
      configureServer(server) {
        server.middlewares.use('/project-images', (req, res, next) => {
          const cleanUrl = req.url.split('?')[0].replace(/^\//, '');
          const filePath = path.join(__dirname, '../Images', decodeURIComponent(cleanUrl));
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            res.setHeader('Content-Type', 'image/png');
            return fs.createReadStream(filePath).pipe(res);
          }
          next();
        });
      }
    }
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            console.error('[Vite Proxy Error]:', err.message);
            if (!res.headersSent) {
              res.writeHead(502, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                error: `Backend server is not reachable on port 3001. Please make sure "node server.js" is running in the backend directory.`
              }));
            }
          });
        }
      },
    },
  },
})
