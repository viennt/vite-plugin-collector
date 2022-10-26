export interface ModuleFile {
    /**
     * File name without extension
     * @example "navigations"
     */
    fileName: string,
    /**
     * File extension
     * @example "json"
     */
    fileExtension: string,
    /**
     * Full file name with extension
     * @example "navigations.json"
     */
    fileFullName: string,
    /**
     * Absolute path
     * @example "/Users/acme/.../project-acme/src/modules/customers/navigations.json"
     */
    fullFilePath: string,
    /**
     * Path from project root
     * @example "/src/modules/customers/navigations.json"
     */
    relativeRootPath: string,
    /**
     * It's true if the file name starts with "_"
     * @example false
     */
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