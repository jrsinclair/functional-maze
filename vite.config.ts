import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [dts({ include: ['lib'] })],
    build: {
        lib: {
            entry: resolve(__dirname, 'lib/main.ts'),
            name: 'Simple Maze Generator',
            fileName: 'simple-maze-generator',
        },
    },
});
