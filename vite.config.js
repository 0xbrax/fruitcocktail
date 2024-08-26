import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import glsl from 'vite-plugin-glsl'

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  plugins:[
    glsl()
  ],
  server: {
    host: true,
  },
});