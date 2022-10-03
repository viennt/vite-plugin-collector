import { join, resolve } from 'path';
import { slash, toArray } from '@antfu/utils';
import fg from 'fast-glob';
import fs from 'fs';

import type { ViteDevServer, ResolvedConfig } from 'vite';
import type { ModuleFile, ResolvedViteOptions, ViteOptions } from './types';
import { resolveOptions } from './options';
import { moduleFileGenerator } from './module';

export class ModuleContext {
    private _server: ViteDevServer | undefined;
    private _moduleFileMap = new Map<string, ModuleFile>();

    public viteConfig: ResolvedConfig;
    public userOptions: ViteOptions;
    public options: ResolvedViteOptions;

    constructor(userOptions, viteConfig: ResolvedConfig) {
        this.viteConfig = viteConfig;
        this.userOptions = userOptions;
        this.options = resolveOptions(userOptions, viteConfig);
    }

    setupViteServer(server: ViteDevServer) {
        if (this._server === server) {
            return;
        }

        this._server = server;
        // this.setupWatcher(server.watcher)
    }

    getModuleFiles(path: string, options: ResolvedViteOptions): string[] {
        return fg.sync(slash(join(path, `**/${options.filesReg}`)), {
            onlyFiles: true,
        });
    }

    async addModuleFiles(paths: string[], moduleDir) {
        for (const fullFilePath of toArray(paths)) {
            const moduleFile = moduleFileGenerator(fullFilePath, moduleDir, this.options.root);
            this._moduleFileMap.set(fullFilePath, moduleFile);
        }
    }

    async searchGlob() {
        const modules = this.options.moduleDirs.map((moduleDir) => {
            const moduleDirPath = slash(resolve(this.options.root, moduleDir));
            const files = this.getModuleFiles(moduleDirPath, this.options);

            return {
                moduleDir,
                files: files.map(file => slash(file)),
            };
        });

        for (const mod of modules) {
            await this.addModuleFiles(mod.files, mod.moduleDir);
        }
    }

    // _server.watcher.on('add', async(path) => {
    //     path = slash(path)
    //     if (!isTarget(path, userOptions)) {
    //         return
    //     }
    // })

    // _server.watcher.on('change', async(path) => {
    //     console.log('++++++++++++++++')
    //     path = slash(path)
    //     if (!isTarget(path, userOptions)) {
    //         return
    //     }
    //     console.log('change', path)
    // })

    async resolveModules() {
        const moduleFiles = (await Promise.all(
            this.moduleFiles.map(async (moduleFile: ModuleFile) => {
                const { fullFilePath } = moduleFile.fileInfo;
                const fileContent = fs.readFileSync(fullFilePath, { encoding: 'utf8' });
                return await this.options?.resolver?.(moduleFile, fileContent);
            })
        )).flat();

        const { default: stringifyObject } = await import('stringify-object');
        const resultStrings = moduleFiles
            .filter((moduleFile: ModuleFile) => !!moduleFile)
            .map((moduleFile: ModuleFile) => stringifyObject(moduleFile, {
                transform: this.options?.transform
            }));

        return `export default [${resultStrings}]`;
    }

    get moduleFiles() {
        return Array.from(this._moduleFileMap.values());
    }
}
