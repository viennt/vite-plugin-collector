import { slash } from '@antfu/utils';
import { OPTION_PATTERNS, OPTION_MODULE_ID } from './constants';

import type { ResolvedConfig } from 'vite';
import type { ResolvedOptions, UserOptions, ResolvedModuleFile, ModuleFile } from './types';

/**
 * Default resolver function
 */
async function defaultResolver(file: ModuleFile, sourceString: string): Promise<ResolvedModuleFile[]> {
    return [{ file, sourceString }];
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
export function resolveOptions(userOptions: Partial<UserOptions>, viteConfig: ResolvedConfig): ResolvedOptions {
    const root = viteConfig.root || slash(process.cwd());
    const patterns = userOptions.patterns || OPTION_PATTERNS;
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