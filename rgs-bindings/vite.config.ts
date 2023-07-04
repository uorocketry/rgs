import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: './lib/index.ts',
      name: 'rgs-bindings',
      fileName: 'rgs-bindings',
    },
    minify: false,
  }
})
