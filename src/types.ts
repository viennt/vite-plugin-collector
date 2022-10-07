export interface ModuleFile {
    fileName: string,
    fileExtension: string,
    fileFullName: string,
    fullFilePath: string,
    relativeRootPath: string,
    isPrivate: boolean,
}

export interface ResolvedModuleFile {
    file: ModuleFile,
    sourceString: string
}

/**
 * Plugin options.
 */
export interface UserOptions {
    /**
     * Pattern string to find files in modules.
     * @default []
     */
    patterns: string | string[]
    /**
     * Module id for import
     * @default '~collector'
     */
    moduleId: string
    /**
     * File resolver
     */
    resolver?: (file: ModuleFile, sourceString: string) => Promise<ResolvedModuleFile[]>
    /**
     * Transform object
     */
    transform?: (object: object | any[], property: string | number | symbol, originalResult: string) => string
}

export interface ResolvedOptions extends Required<UserOptions> {
    /**
     * Resolves to the `root` value from Vite config.
     * @default config.root
     */
    root: string
    /**
     * Pattern string to find files in modules.
     * @default []
     */
    patterns: string[]
    /**
     * Module id for import
     * @default '~collector'
     */
    moduleId: string
    /**
     * File resolver
     */
    resolver: (file: ModuleFile, sourceString: string) => Promise<ResolvedModuleFile[]>
    /**
     * Transform object
     */
    transform: (object: object | any[], property: string | number | symbol, originalResult: string) => string
}