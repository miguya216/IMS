import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    https: {
      key: fs.readFileSync('C:/xampp/apache/conf/ssl/server.key'),
      cert: fs.readFileSync('C:/xampp/apache/conf/ssl/server.crt'),
    },
    proxy: {
      '/api': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '/IMS-react/backend/'),
      }
    }
  }
});

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import path from 'path';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: '0.0.0.0', // accessible via local network
//     port: 5173,
//     https: false,
//     allowedHosts: ['92ac6ea57d5a.ngrok-free.app'],
//     proxy: {
//       '/api': {
//         target: 'http://localhost', // Assuming XAMPP backend is here
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api/, '/IMS-react/backend/'),
//       },
//     },
//   },
// });
