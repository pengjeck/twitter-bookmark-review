import { defineConfig } from 'wxt';
import vue from '@vitejs/plugin-vue';

// See https://wxt.dev/api/config.html
export default defineConfig({
  publicDir: "public",
  entrypointsDir: "entrypoints",
  manifest: {
    host_permissions: ['*://twitter.com/*'],
    permissions: ["storage", "notifications", "webRequest"]
  },
  imports: {
    addons: {
      vueTemplate: true,
    },
  },
  vite: () => ({
    plugins: [vue()],
  }),
});
