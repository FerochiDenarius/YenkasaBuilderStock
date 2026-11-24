import { resolve } from 'node:path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  main: { plugins: [externalizeDepsPlugin()] },
  preload: { plugins: [externalizeDepsPlugin()] },
  renderer: {
    server: { host: '127.0.0.1' },
    resolve: { alias: { '@': resolve(__dirname, 'src/renderer') } },
    plugins: [react()],
  },
});
