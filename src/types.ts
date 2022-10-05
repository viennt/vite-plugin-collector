export interface FileInformation {
    fileName: string,
    fileExtension: string,
    fileFullName: string,
    fullFilePath: string,
    relativeRootPath: string,
    isPrivate: boolean,
}

export interface ModuleFile {
    fileInfo: FileInformation
}

export interface ResolvedModuleFile extends ModuleFile {
    fileInfo: FileInformation,
    content: string
}

/**
 * Plugin options.
 */
export interface ViteOptions {
    /**
     * Pattern string to find files in modules.
     * @default ['src/modules/*.module.js']
     */
    patterns: string[]
    /**
     * Module id for routes import
     * @default '~collector'
     */
    moduleId: string
    /**
     * File resolver
     */
    resolver?: (item: ModuleFile, content: string) => Promise<ResolvedModuleFile[] | Object[]>
    /**
     * Transform object
     */
    transform?: (object: object | any[], property: string | number | symbol, originalResult: string) => string
}

export interface ResolvedViteOptions extends Required<ViteOptions> {
    /**
     * Resolves to the `root` value from Vite config.
     * @default config.root
     */
    root: string
    /**
     * Pattern string to find files in modules.
     * @default ['src/modules/*.module.js']
     */
    patterns: string[]
    /**
     * Module id for routes import
     * @default '~collector'
     */
    moduleId: string
    /**
     * File resolver
     */
    resolver: (item: ModuleFile, content: string) => Promise<ResolvedModuleFile[] | Object[]>
    /**
     * Transform object
     */
    transform: (object: object | any[], property: string | number | symbol, originalResult: string) => string
}