import { ModuleContext } from './context'
import { URLSearchParams } from 'url'

const initialOptions = {
    moduleDirs: ['modules/'],
    filesReg: '*.module.js',
    moduleId: '@modules',
}

export default (userOptions = initialOptions) => {
    const MODULE_ID_VIRTUAL = 'virtual:viennt:vite-plugin-collector'
    let ctx;

    return {
        name: 'vite-plugin-collector',
        async configResolved(config) {
            ctx = new ModuleContext(
                { ...initialOptions, ...userOptions },
                config.root
            )
            await ctx.searchGlob()
        },
        configureServer(server) {
            ctx.setupViteServer(server)
        },
        resolveId(id) {
            if (id === userOptions.moduleId) {
                return `${MODULE_ID_VIRTUAL}?id=${id}`
            }
        },
        load(id) {
            const [virtualModuleId, rawQuery] = id.split('?', 2)
            const query = new URLSearchParams(rawQuery)
            const moduleId = query.get('id')

            if (virtualModuleId === MODULE_ID_VIRTUAL && moduleId && ctx.options.moduleId === moduleId) {
                return ctx.resolveModules()
            }

            return null
        }
    }
}
