import { defineConfig } from 'vite';
import { readFileSync } from 'fs';

// Lee la versión de package.json
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
const version = pkg.version;

export default defineConfig({
  base: '/ContactosDiarios/', // Cambia esto si tu repo tiene otro nombre
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(version),
  },
  build: {
    rollupOptions: {
      output: {
        // Reemplaza el marcador en index.html por la versión
        manualChunks: undefined,
      },
    },
  },
});
