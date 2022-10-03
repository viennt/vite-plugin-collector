import { ViteOptions } from './types';
import { ModuleContext } from './context';
import { VIRTUAL_MODULES_RESOLVE_PREFIX } from './constants';

function VitePluginCollector(userOptions: ViteOptions) {
    let ctx;

    return {
        name: 'vite-plugin-collector',
        async configResolved(config) {
            ctx = new ModuleContext(userOptions, config);
            await ctx.searchGlob();
        },
        configureServer(server) {
            ctx.setupViteServer(server);
        },
        resolveId(id) {
            return id === userOptions.moduleId ? VIRTUAL_MODULES_RESOLVE_PREFIX + id : undefined;
        },
        load(id) {
            if (!id.startsWith(VIRTUAL_MODULES_RESOLVE_PREFIX)) {
                return;
            }

            const moduleId = id.slice(VIRTUAL_MODULES_RESOLVE_PREFIX.length);
            if (ctx.options.moduleId !== moduleId) {
                return;
            }

            return ctx.resolveModules();
        }
    };
}

export * from './types'
export default VitePluginCollector
export type { ViteOptions as Options }
