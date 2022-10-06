import type { ViteDevServer, ResolvedConfig } from 'vite';
import type { UserOptions } from './types';

import { ModuleContext } from './context';
import { VIRTUAL_MODULES_RESOLVE_PREFIX } from './constants';

function VitePluginCollector(userOptions: UserOptions) {
    let ctx: ModuleContext;

    return {
        name: 'vite-plugin-collector',
        async configResolved(config: ResolvedConfig) {
            ctx = new ModuleContext(userOptions, config);
            await ctx.searchGlob();
        },
        configureServer(server: ViteDevServer) {
            ctx.server = server;
        },
        resolveId(id: string) {
            return id === userOptions.moduleId ? VIRTUAL_MODULES_RESOLVE_PREFIX + id : undefined;
        },
        load(id: string) {
            if (!id.startsWith(VIRTUAL_MODULES_RESOLVE_PREFIX)) {
                return;
            }

            const moduleId = id.slice(VIRTUAL_MODULES_RESOLVE_PREFIX.length);
            if (ctx.userOptions.moduleId !== moduleId) {
                return;
            }

            return ctx.resolveModules();
        }
    };
}

export * from './types';
export type { UserOptions as Options };
export default VitePluginCollector;
