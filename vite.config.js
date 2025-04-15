import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import ViteSVGRPlugin from 'vite-plugin-svgr';

import jsConfig from './jsconfig.json';

const { baseUrl, paths } = jsConfig.compilerOptions;

const aliasMap = Object.fromEntries(
  Object.entries(paths).map(([aliasPath, value]) => [
    aliasPath.replace('/*', ''),
    path.resolve(__dirname, `${baseUrl}/${value[0].replace('/*', '')}/`),
  ]),
);

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/styles/globals.scss";',
      },
    },
  },

  plugins: [react(), ViteSVGRPlugin({ icon: true, include: '**/*.svg' })],

  resolve: {
    alias: aliasMap,
  },
});
