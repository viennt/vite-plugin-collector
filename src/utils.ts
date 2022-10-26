import { resolve } from 'path';
import micromatch from 'micromatch';
import { ensurePrefix } from '@antfu/utils';

import type { ModuleFile } from './types';
import type { ModuleNode, ViteDevServer } from 'vite';

import { VIRTUAL_MODULES_RESOLVE_PREFIX } from './constants';

/**
 * Check if the file path is match patterns
 */
export function isMatchPatterns(fullFilePath: string, patterns: string[]): boolean {
    return patterns.every(pattern => {
        return micromatch.isMatch(fullFilePath, `**${ensurePrefix('/', pattern)}`)
    })
}

/**
 * Generate module object
 */
export function moduleFileGenerator(fullFilePath: string, viteRoot: string): ModuleFile {
    const relativeRootPath = fullFilePath.split(resolve(viteRoot)).pop();
    if (!relativeRootPath) {
        throw Error('Empty "relativeRootPath"')
    }

    const fileFullName = fullFilePath.split('/').at(-1);
    if (!fileFullName) {
        throw Error('Empty "fileFullName"')
    }

    const fileExtension = fileFullName.split('.').pop();
    if (!fileExtension) {
        throw Error('Empty "fileExtension"')
    }

    const fileName = fileFullName.split('.').slice(0, -1).join('.');
    const isPrivate = fileName.startsWith('_');

    return {
        fileName,
        fileExtension,
        fileFullName,
        fullFilePath,
        relativeRootPath,
        isPrivate,
    };
}

/**
 * Invalidate files in module
 */
export function invalidateFilesModule(server: ViteDevServer) {
    const { moduleGraph } = server
    const mods = moduleGraph.getModulesByFile(VIRTUAL_MODULES_RESOLVE_PREFIX)
    if (mods) {
        const seen = new Set<ModuleNode>()
        mods.forEach((mod) => {
            moduleGraph.invalidateModule(mod, seen)
        })
    }
}