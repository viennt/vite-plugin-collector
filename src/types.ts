export interface ModuleInformation {
    moduleName: string,
    moduleDir: string,
    moduleDirPath: string,
}

export interface FileInformation {
    fileName: string,
    fileExtension: string,
    fileFullName: string,
    fullFilePath: string,
    relativeRootPath: string,
    relativeModulePath: string,
    isPrivate: boolean,
}

export interface ModuleFile {
    moduleInfo: ModuleInformation,
    fileInfo: FileInformation
}

/**
 * Plugin options.
 */
export interface ViteOptions {
    /**
     * Paths to the directory to search for modules.
     * @default ['modules/']
     */
    moduleDirs: string[]
    /**
     * Regex string for files in modules.
     * @default '*.module.js'
     * TODO: use subFolders and extensions
     * subFolders: 'locales'
     * extensions: 'json'
     */
    filesReg: string
    /**
     * Module id for routes import
     * @default '~collector'
     */
    moduleId: string
    /**
     * File resolver
     */
    resolver?: (item: ModuleFile, content: string) => Promise<object>
    /**
     * Transform object
     */
    transform?: (object: any, property: string, originalResult: any) => any
}

export interface ResolvedViteOptions extends Required<ViteOptions> {
    /**
     * Resolves to the `root` value from Vite config.
     * @default config.root
     */
    root: string
    /**
     * Paths to the directory to search for modules.
     * @default ['modules/']
     */
    moduleDirs: string[]
    /**
     * Regex string for files in modules.
     * @default '*.module.js'
     */
    filesReg: string
    /**
     * Module id for routes import
     * @default '~collector'
     */
    moduleId: string
    /**
     * File resolver
     */
    resolver: (item: ModuleFile, content: string) => Promise<object>
    /**
     * Transform object
     */
    transform: (object: any, property: string, originalResult: any) => any
}