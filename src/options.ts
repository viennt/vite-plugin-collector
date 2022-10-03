import type { ResolvedConfig } from 'vite';
import { slash } from '@antfu/utils';

import {
    OPTION_MODULE_DIRS,
    OPTION_FILE_REG,
    OPTION_MODULE_ID
} from './constants';

import type { ModuleFile, ResolvedViteOptions, ViteOptions } from './types';

/**
 * Default resolver function
 */
async function defaultResolver(item: ModuleFile, content: string): Promise<object> {
    return { ...item, content };
}

/**
 * Default transform function
 */
function defaultTransform(_, property: string, originalResult: any): any {
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
    const moduleDirs = userOptions.moduleDirs || OPTION_MODULE_DIRS;
    const filesReg = userOptions.filesReg || OPTION_FILE_REG;
    const moduleId = userOptions.moduleId || OPTION_MODULE_ID;

    const resolver = userOptions.resolver || defaultResolver;
    const transform = userOptions.transform || defaultTransform;

    return {
        root,
        moduleDirs,
        filesReg,
        moduleId,
        resolver,
        transform
    };
}