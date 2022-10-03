import { resolve } from 'path';
import { slash } from '@antfu/utils';

import { FileInformation, ModuleInformation, ModuleFile } from './types';

export function moduleFileGenerator(fullFilePath, moduleDir: string, viteRoot: string): ModuleFile {
    const moduleDirPath = slash(resolve(viteRoot, moduleDir));
    const relativeRootPath = fullFilePath.split(resolve(viteRoot)).pop();
    const relativeModulePath = fullFilePath.split(moduleDirPath).pop();
    const moduleName = relativeModulePath.split('/').at(1);
    const fileFullName = relativeModulePath.split('/').at(-1);
    const fileExtension = fileFullName.split('.').pop();
    const fileName = fileFullName.split('.').slice(0, -1).join('.');
    const isPrivate = fileName.startsWith('_');

    const moduleInfo: ModuleInformation = {
        moduleName,
        moduleDir,
        moduleDirPath,
    };

    const fileInfo: FileInformation = {
        fileName,
        fileExtension,
        fileFullName,
        fullFilePath,
        relativeRootPath,
        relativeModulePath,
        isPrivate,
    };

    return {
        moduleInfo,
        fileInfo,
    };
}