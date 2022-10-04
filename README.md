# @viennt/vite-plugin-collector

Module collector for Vite

TODO:
- [ ] Build scripts
- [x] Typescript support
- [ ] Examples
- [ ] Built-in resolvers
- [ ] Nuxt support
- [ ] React support
- [ ] Svelte support

## Usages

```javascript
// vite.config.js
...
plugins: [
    vitePluginCollector({
        moduleDirs: ['src/modules/', 'src/static-modules/'],
        filesReg: '*.route.js',
        moduleId: '~/routes',
    })
]
```

```javascript
// src/main.js
import { createApp } from 'vue'
import routes from '~/routes'

const app = createApp(appVue)

app.use(createRouter({
    routes,
}))

router.isReady().then(() => {
    app.mount('#app')
})
```