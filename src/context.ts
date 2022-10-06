import type { ViteDevServer, ResolvedConfig } from 'vite';

import fs, { FSWatcher } from 'fs';
import fg from 'fast-glob';

import { slash } from '@antfu/utils';
import { join, resolve } from 'path';

import { resolveOptions } from './options';
import { moduleFileGenerator } from './utils';

import type { ResolvedViteOptions, ViteOptions, ResolvedModuleFile, ModuleFile } from './types';

export class ModuleContext {
    private _server: ViteDevServer | undefined;
    private _moduleFileMap = new Map<string, ModuleFile>();

    private readonly _userOptions: ViteOptions;
    private readonly _options: ResolvedViteOptions;

    constructor(userOptions: ViteOptions, viteConfig: ResolvedConfig) {
        this._userOptions = userOptions;
        this._options = resolveOptions(userOptions, viteConfig);
    }

    async searchGlob() {
        for (const pattern of this._options.patterns) {
            const fullPathPattern = slash(resolve(this._options.root, pattern));

            const files: string[] = this.getModuleFiles(fullPathPattern);

            for await (const file of files) {
                const fullFilePath = slash(file);
                const moduleFile = moduleFileGenerator(fullFilePath, this._options.root);
                this._moduleFileMap.set(fullFilePath, moduleFile);
            }
        }
    }

    getModuleFiles(fullPathPattern: string): string[] {
        return fg.sync(slash(join(fullPathPattern)), {
            onlyFiles: true,
        });
    }

    async resolveModules() {
        const moduleFiles: Object[] = (await Promise.all(this.moduleFiles.map(this.handleFileContent.bind(this))))
            .filter((resolvedObject: Object[]) => typeof resolvedObject !== 'undefined')
            .flat();

        const { default: stringifyObject } = await import('stringify-object');
        const resultStrings = moduleFiles.map((resolvedObject: Object) => stringifyObject(resolvedObject, {
            transform: this._options?.transform
        }));

        return `export default [${resultStrings}]`;
    }

    async handleFileContent(moduleFile: ModuleFile): Promise<ResolvedModuleFile[]> {
        const { fullFilePath } = moduleFile;
        const sourceString = fs.readFileSync(fullFilePath, { encoding: 'utf8' });
        return this._options?.resolver?.(moduleFile, sourceString);
    }

    // onUpdate() {
    //     if (!this._server) {
    //         return;
    //     }
    //
    //     // invalidatePagesModule(this._server)
    //     this._server.ws.send({
    //         type: 'full-reload',
    //     });
    // }

    setupWatcher(watcher: FSWatcher) {
        // watcher.on('change', async (fullFilePath) => {
        //     fullFilePath = slash(fullFilePath);
        //
        //     const moduleDir = getModuleByFullFilePath(fullFilePath, this._options)
        //     if (!moduleDir) {
        //         return
        //     }
        //
        //     const moduleFile = moduleFileGenerator(fullFilePath, moduleDir, this._options.root);
        //     this._moduleFileMap.set(fullFilePath, moduleFile);
        //     this.onUpdate()
        // });

        // watcher
        //     .on('unlink', async(path) => {
        //         path = slash(path)
        //         if (!isTarget(path, this._options)) {
        //             return
        //         }
        //         this._moduleFileMap.delete(path)
        //         this.onUpdate()
        //     })
        //
        // watcher.on('add', async(path) => {
        //     path = slash(path)
        //     if (!isTarget(path, userOptions)) {
        //         return
        //     }
        // })

    }

    set server(value: ViteDevServer) {
        if (this._server === value) {
            return;
        }

        this._server = value;
        this.setupWatcher(this._server.watcher);
    }

    get moduleFiles(): ModuleFile[] {
        return Array.from(this._moduleFileMap.values());
    }

    get userOptions(): ViteOptions {
        return this._userOptions;
    }
}
