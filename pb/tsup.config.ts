import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/index.ts'],
    splitting: false,
    sourcemap: true,
    format: ['esm'],
    minify: false,
    bundle: false,
    clean: true,
})
