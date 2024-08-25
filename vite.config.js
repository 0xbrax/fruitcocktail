import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl'
//import { fileURLToPath } from 'node:url';

export default defineConfig({
  /*resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url))
    },
  },*/
  plugins:[
    glsl()
  ],
  server: {
    host: true,
  },
});