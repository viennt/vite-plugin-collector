# @viennt/vite-plugin-collector

`WIP: This plugin is NOT ready for production yet.`

Module collector for Vite

## How to use

### Install

```bash
yarn add @viennt/vite-plugin-collector
# or
pnpm add @viennt/vite-plugin-collector
```

### Usages

```javascript
// vite.config.ts
import collector from '@viennt/vite-plugin-collector';

export default {
    plugins: [
        collector(/* options */),
    ]
}
```

## APIs

### Options

```typescript
export interface UserOptions {
    /**
     * Pattern string to find files in modules.
     * @default []
     */
    patterns: string | string[]
    /**
     * Module id for import
     * @default '~collector'
     */
    moduleId: string
    /**
     * File resolver
     */
    resolver?: (item: ModuleFile, sourceString: string) => Promise<ResolvedModuleFile[]>
    /**
     * Transform object
     */
    transform?: (object: object | any[], property: string | number | symbol, originalResult: string) => string
}
```

### ModuleFile

```typescript
export interface ModuleFile {
    fileName: string,
    fileExtension: string,
    fileFullName: string,
    fullFilePath: string,
    relativeRootPath: string,
    isPrivate: boolean,
}
```

## Examples

### Folder structure

```bash
├── public
└── src
    └── modules
        ├── products
        │   ├── components/*.vue
        │   ├── pages
        │   │   ├── products-index.vue
        │   │   ├── products-create.vue
        │   │   └── products-update.vue
        │   ├── routes.json
        │   └── navigations.json
        │
        ├── users
        │   ├── components/*.vue
        │   ├── pages
        │   │   ├── users-index.vue
        │   │   ├── users-create.vue
        │   │   └── users-update.vue
        │   ├── routes.json
        │   └── navigations.json
        │
        └── ...
```

```js
// src/modules/products/navigations.json
[
    {
        "id": "menu-products",
        "path": "products",
        "label": "Products"
    }
]
```

```javascript
// vite.config.ts
import collector from '@viennt/vite-plugin-collector';

export default {
    plugins: [
        collector({
            patterns: ['src/modules/**/navigations.json'],
            moduleId: '~navigations',
            resolver: (item: ModuleFile, sourceString: string) => {
                return JSON.parse(sourceString);
            },
        }),
    ]
}
```

```javascript
// sidebar.vue
import navigations from '~navigations'

console.log(navigations)
```

The result will be:
```javascript
[
    {
        "id": "menu-customers",
        "path": "customers",
        "label": "Customers"
    },
    {
        "id": "menu-products",
        "path": "products",
        "label": "Products"
    }
]
```

---
## TODO

- Examples
- Built-in resolvers
- Nuxt support
- React support
- Svelte support
