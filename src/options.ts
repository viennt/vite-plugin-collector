import { normalizePath } from 'vite'
import type { ResolvedConfig } from 'vite';

import { defaultResolver } from './resolvers';
import { OPTION_PATTERNS, OPTION_MODULE_ID } from './constants';

import type { ResolvedOptions, UserOptions } from './types';

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
 * Check if it's a string then change to array
 */
function ensureArray(value: string | string[]): string[] {
    if (Array.isArray(value)) {
        return value;
    }

    return [value];
}

/**
 * Resolve User Options
 */
export function resolveOptions(userOptions: Partial<UserOptions>, viteConfig: ResolvedConfig): ResolvedOptions {
    const root = viteConfig.root || normalizePath(process.cwd());
    const patterns = ensureArray(userOptions.patterns || OPTION_PATTERNS);
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