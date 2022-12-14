import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import vitePluginCollector from '@viennt/vite-plugin-collector'
import type { ModuleFile } from '@viennt/vite-plugin-collector'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),

    vitePluginCollector({
      patterns: ['src/modules/**/navigations.json'],
      moduleId: '~navigations',
      resolver: (item: ModuleFile, sourceString: string) => {
        return JSON.parse(sourceString);
      },
    }),

    vitePluginCollector({
      patterns: ['src/modules/**/routes.json'],
      moduleId: '~routes',
      resolver: (item: ModuleFile, sourceString: string) => {
        const modulePath = item.relativeRootPath.replace(/routes.json/g, '')
        const routes = JSON.parse(sourceString);

        return routes.map(route => {
          if (!route.view) {
            return route
          }

          return {
            ...route,
            component: `${modulePath}views/${route.view}.vue`,
          }
        });
      },
    })]
})
