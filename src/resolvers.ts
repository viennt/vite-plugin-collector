import { ModuleFile, ResolvedModuleFile } from './types';

/**
 * Default resolver function
 */
export async function defaultResolver(file: ModuleFile, sourceString: string): Promise<ResolvedModuleFile[]> {
    return [{ file, sourceString }];
}

/**
 * Default resolver function
 */
export async function jsonResolver(file: ModuleFile, sourceString: string): Promise<object[]> {
    return JSON.parse(sourceString);
}