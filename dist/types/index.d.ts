/**
 * Remove is not your console, Supported file types: js ts jsx tsx vue
 * @param options Configure options
 * @param options.include Folders included  --  Default: [ /src/ ]
 * @param options.fileRegex Files that need to be processed -- Default: /\.(?:[tj]sx?|vue)$/
 * @returns
 */
export default function removeConsolePlugin(options?: {
    include?: string[];
    fileRegex?: RegExp;
}): {
    name: string;
    config(_config: any, ctx: {
        mode: string;
    }): Promise<void>;
    load(id: string): Promise<string | undefined>;
};
