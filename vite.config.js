import { defineConfig } from 'vite';
import { readFileSync, writeFileSync } from 'fs';

// Lee la versión de package.json
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
const version = pkg.version;

// Inyecta la versión en el Service Worker antes del build
const swPath = './public/sw.js';
let swContent = readFileSync(swPath, 'utf-8');
swContent = swContent.replace(/__APP_VERSION__/g, version);
writeFileSync(swPath, swContent);

export default defineConfig({
  base: '/ContactosDiarios/', // Cambia esto si tu repo tiene otro nombre
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(version),
    '__APP_VERSION__': JSON.stringify(version),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    // Asegurar que los assets se sirvan con las rutas correctas
    assetsDir: 'assets',
  },
  server: {
    // Para desarrollo local
    headers: {
      'Service-Worker-Allowed': '/',
    },
  },
});
