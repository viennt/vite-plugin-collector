import { resolve } from 'path';
// import { ensurePrefix, ensureSuffix } from '@antfu/utils';

import type { ModuleFile } from './types';

// export function ensureSlash(str: string) {
//     return ensureSuffix('/', ensurePrefix('/', str));
// }

// export function buildPatternByModuleAndRegex(moduleDir: string, regex: string): string {
//     return `**${ensureSlash(moduleDir)}**${ensurePrefix('/', regex)}`;
// }

// export function getModuleByFullFilePath(fullFilePath: string, options: ResolvedViteOptions): string | undefined {
//     return options.patterns.find(moduleDir => {
//         const pattern = buildPatternByModuleAndRegex(moduleDir, options.pattern);
//         return micromatch.isMatch(fullFilePath, pattern)
//     })
// }

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