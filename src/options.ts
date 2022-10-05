import { slash } from '@antfu/utils';
import { OPTION_PATTERN, OPTION_MODULE_ID } from './constants';

import type { ResolvedConfig } from 'vite';
import type { ModuleFile, ResolvedViteOptions, ViteOptions, ResolvedModuleFile } from './types';

/**
 * Default resolver function
 */
async function defaultResolver(item: ModuleFile, content: string): Promise<ResolvedModuleFile[] | Object[]> {
    return [{ ...item, content }];
}

/**
 * Default transform function
 */
function defaultTransform(_: object | any[], property: string | number | symbol, originalResult: string): string {
    if (property === 'component') {
        return `() => import(${originalResult})`;
    }

    return originalResult;
}

/**
 * Resolve User Options
 */
export function resolveOptions(userOptions: Partial<ViteOptions>, viteConfig: ResolvedConfig): ResolvedViteOptions {
    const root = viteConfig.root || slash(process.cwd());
    const patterns = userOptions.patterns || [OPTION_PATTERN];
    const moduleId = userOptions.moduleId || OPTION_MODULE_ID;

    const resolver = userOptions.resolver || defaultResolver;
    const transform = userOptions.transform || defaultTransform;

    return {
        root,
        patterns,
        moduleId,
        resolver,
        transform
    };
}