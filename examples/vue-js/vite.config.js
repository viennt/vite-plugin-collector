import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import vitePluginCollector, { jsonResolver } from '@viennt/vite-plugin-collector'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      vue(),

      vitePluginCollector({
          patterns: 'src/modules/**/navigations.json',
          moduleId: '~navigations',
          resolver: jsonResolver,
      }),

      vitePluginCollector({
          patterns: 'src/modules/**/routes.json',
          moduleId: '~routes',
          resolver: ({ relativeRootPath }, sourceString) => {
              const modulePath = relativeRootPath.replace(/routes.json/g, '')
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
      })
  ]
})
