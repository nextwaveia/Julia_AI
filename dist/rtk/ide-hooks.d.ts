/**
 * IDE Hooks - Platform-specific output formatting
 * Supports 12 different IDEs with custom formatting
 */
import { IDE } from './rtk-adapter';
export interface IDEHook {
    name: IDE;
    format: (message: string) => string;
    supportsPrefixes: boolean;
    supportsEmojis: boolean;
    maxLineLength: number;
}
export declare class IDEHookManager {
    private hooks;
    constructor();
    private registerDefaultHooks;
    registerHook(hook: IDEHook): void;
    getHook(ide: IDE): IDEHook;
    format(message: string, ide: IDE): string;
    private removeEmojis;
    private truncate;
    getAllIDEs(): IDE[];
    supportsEmojis(ide: IDE): boolean;
    supportsPrefixes(ide: IDE): boolean;
}
//# sourceMappingURL=ide-hooks.d.ts.map