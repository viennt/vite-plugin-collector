import fg from 'fast-glob';
import fs, { FSWatcher } from 'fs';
import { normalizePath } from 'vite'
import { join, resolve } from 'path';

import type { ViteDevServer, ResolvedConfig } from 'vite';

import { resolveOptions } from './options';
import { invalidateFilesModule, isMatchPatterns, moduleFileGenerator } from './utils';

import type { ResolvedOptions, UserOptions, ResolvedModuleFile, ModuleFile } from './types';

export class ModuleContext {
    private _server: ViteDevServer | undefined;
    private _moduleFileMap = new Map<string, ModuleFile>();

    private readonly _userOptions: UserOptions;
    private readonly _options: ResolvedOptions;

    constructor(userOptions: UserOptions, viteConfig: ResolvedConfig) {
        this._userOptions = userOptions;
        this._options = resolveOptions(userOptions, viteConfig);
    }

    async searchGlob() {
        for (const pattern of this._options.patterns) {
            const fullPathPattern = normalizePath(resolve(this._options.root, pattern));

            const files: string[] = this.getModuleFiles(fullPathPattern);

            for await (const file of files) {
                const fullFilePath = normalizePath(file);
                const moduleFile = moduleFileGenerator(fullFilePath, this._options.root);
                this._moduleFileMap.set(fullFilePath, moduleFile);
            }
        }
    }

    getModuleFiles(fullPathPattern: string): string[] {
        return fg.sync(normalizePath(join(fullPathPattern)), {
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

    updateAndReload() {
        if (!this._server) {
            return;
        }

        invalidateFilesModule(this._server)

        this._server.ws.send({
            type: 'full-reload',
        });
    }

    setupWatcher(watcher: FSWatcher) {
        watcher.on('add', async(path) => {
            const fullFilePath = normalizePath(path);
            if (!isMatchPatterns(fullFilePath, this._options.patterns)) {
                return
            }

            const moduleFile = moduleFileGenerator(fullFilePath, this._options.root);
            this._moduleFileMap.set(fullFilePath, moduleFile);

            this.updateAndReload()
        })

        watcher.on('change', async (path) => {
            const fullFilePath = normalizePath(path);
            if (!isMatchPatterns(fullFilePath, this._options.patterns)) {
                return
            }

            const file = this._moduleFileMap.get(fullFilePath);
            if (!file) {
                return
            }

            this.updateAndReload()
        });

        watcher.on('unlink', async(path) => {
            const fullFilePath = normalizePath(path);
            if (!isMatchPatterns(fullFilePath, this._options.patterns)) {
                return
            }

            this._moduleFileMap.delete(fullFilePath)

            this.updateAndReload()
        })
    }

    set server(value: ViteDevServer) {
        if (this._server === value) {
            return;
        }

        this._server = value;
        this.setupWatcher(value.watcher);
    }

    get moduleFiles(): ModuleFile[] {
        return Array.from(this._moduleFileMap.values());
    }

    get userOptions(): UserOptions {
        return this._userOptions;
    }
}
