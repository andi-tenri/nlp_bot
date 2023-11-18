import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';

// ----------------------------------------------------------------------

export default defineConfig({
  plugins: [
    react(),
    // checker({
    //   eslint: {
    //     lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
    //   },
    // }),
  ],
  resolve: {
    alias: [
      {
        find: 'server',
        replacement: path.resolve(__dirname, 'server'),
      },
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1'),
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), 'src/$1'),
      },
    ],
  },
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 3001,
  },
});
