import { join, resolve } from 'path'
import fg from 'fast-glob'
import fs from 'fs'

function slash(str) {
    return str.replace(/\\/g, '/')
}

function toArray(array) {
    array = array || []
    if (Array.isArray(array))
        return array
    return [array]
}

export class ModuleContext {
    _server;
    _moduleMap = new Map();
    root;
    options;

    constructor(userOptions, viteRoot = process.cwd()) {
        this.root = slash(viteRoot)
        this.options = { ...userOptions, root: userOptions.root || viteRoot }
    }

    setupViteServer(server) {
        if (this._server === server)
            return

        this._server = server
        // this.setupWatcher(server.watcher)
    }

    async addPage(paths, moduleDir) {
        for (const p of toArray(paths)) {
            const moduleDirPath = slash(resolve(this.options.root, moduleDir))
            const relativeRootPath = p.split(resolve(this.options.root)).pop()
            const relativeModulePath = p.split(moduleDirPath).pop()
            const moduleName = relativeModulePath.split('/').at(1)
            const fileFullName = relativeModulePath.split('/').at(-1)
            const fileExtension = fileFullName.split('.').pop()
            const fileName = fileFullName.split('.').slice(0, -1).join('.')
            const isPrivate = fileName.startsWith('_')

            this._moduleMap.set(p, {
                module: {
                    moduleName,
                    moduleDir,
                    moduleDirPath,
                },
                file: {
                    fileName,
                    fileExtension,
                    fileFullName,
                    fullFilePath: p,
                    relativeRootPath,
                    relativeModulePath,
                    isPrivate,
                },
            })
        }
    }

    getModuleFiles(path, options) {
        return fg.sync(slash(join(path, `**/${options.filesReg}`)), {
            onlyFiles: true,
        })
    }

    async searchGlob() {
        const modules = this.options.moduleDirs.map((moduleDir) => {
            const moduleDirPath = slash(resolve(this.options.root, moduleDir))
            const files = this.getModuleFiles(moduleDirPath, this.options)

            return {
                moduleDir,
                files: files.map(file => slash(file)),
            }
        })

        for (const mod of modules) {
            await this.addPage(mod.files, mod.moduleDir)
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

    transform(object, property, originalResult) {
        if (property === 'component') {
            return `() => import(${originalResult})`;
        }

        return originalResult;
    }

    async resolver (item, content) {
        return {...item, content}
    }

    async resolveModules() {
        const moduleItems = (await Promise.all(
            [...this._moduleMap.values()].map(async (moduleItem) => {
                const { fullFilePath } = moduleItem.file
                const fileContent = fs.readFileSync(fullFilePath, { encoding: 'utf8' });
                return await (this.options.resolver || this.resolver)(moduleItem, fileContent)
            })
        )).flat()

        const { default: stringifyObject } = await import('stringify-object')
        const resultStrings = moduleItems
            .filter(moduleItem => moduleItem)
            .map((moduleItem) => {
                return stringifyObject(moduleItem, {
                    transform: this.options.transform || this.transform
                })
            })

        return `export default [${resultStrings}]`
    }

    get moduleRouteMap() {
        return [...this._moduleMap.values()]
    }
}
