"use strict";
/**
 * IDE Hooks - Platform-specific output formatting
 * Supports 12 different IDEs with custom formatting
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDEHookManager = void 0;
class IDEHookManager {
    constructor() {
        this.hooks = new Map();
        this.registerDefaultHooks();
    }
    registerDefaultHooks() {
        // Claude Code - supports full formatting
        this.registerHook({
            name: 'claude-code',
            format: (msg) => `🎼 Julia\n${msg}`,
            supportsPrefixes: true,
            supportsEmojis: true,
            maxLineLength: 120,
        });
        // Cursor - minimalist format
        this.registerHook({
            name: 'cursor',
            format: (msg) => msg,
            supportsPrefixes: false,
            supportsEmojis: true,
            maxLineLength: 100,
        });
        // GitHub Copilot - comment-based
        this.registerHook({
            name: 'copilot',
            format: (msg) => `// ${msg.replace(/\n/g, '\n// ')}`,
            supportsPrefixes: true,
            supportsEmojis: false,
            maxLineLength: 80,
        });
        // Cline - structured format
        this.registerHook({
            name: 'cline',
            format: (msg) => `[JULIA]\n${msg}`,
            supportsPrefixes: true,
            supportsEmojis: true,
            maxLineLength: 120,
        });
        // Windsurf - inline format
        this.registerHook({
            name: 'windsurf',
            format: (msg) => `▶ ${msg}`,
            supportsPrefixes: false,
            supportsEmojis: true,
            maxLineLength: 100,
        });
        // Gemini - clean format
        this.registerHook({
            name: 'gemini',
            format: (msg) => msg,
            supportsPrefixes: false,
            supportsEmojis: true,
            maxLineLength: 110,
        });
        // OpenCode - TypeScript plugin format
        this.registerHook({
            name: 'opencode',
            format: (msg) => `/* Julia: ${msg} */`,
            supportsPrefixes: false,
            supportsEmojis: false,
            maxLineLength: 100,
        });
        // Pi - extension format
        this.registerHook({
            name: 'pi',
            format: (msg) => `[julia] ${msg}`,
            supportsPrefixes: true,
            supportsEmojis: true,
            maxLineLength: 95,
        });
        // Hermes - Python plugin format
        this.registerHook({
            name: 'hermes',
            format: (msg) => `# Julia: ${msg}`,
            supportsPrefixes: true,
            supportsEmojis: false,
            maxLineLength: 90,
        });
        // Antigravity - shell hook format
        this.registerHook({
            name: 'antigravity',
            format: (msg) => `$ julia: ${msg}`,
            supportsPrefixes: false,
            supportsEmojis: false,
            maxLineLength: 85,
        });
        // Kilo Code - shell hook format
        this.registerHook({
            name: 'kilo',
            format: (msg) => `> ${msg}`,
            supportsPrefixes: false,
            supportsEmojis: true,
            maxLineLength: 100,
        });
        // Custom/Generic - flexible format
        this.registerHook({
            name: 'custom',
            format: (msg) => msg,
            supportsPrefixes: true,
            supportsEmojis: true,
            maxLineLength: 120,
        });
    }
    registerHook(hook) {
        this.hooks.set(hook.name, hook);
    }
    getHook(ide) {
        return this.hooks.get(ide) || this.hooks.get('custom');
    }
    format(message, ide) {
        const hook = this.getHook(ide);
        let formatted = hook.format(message);
        if (!hook.supportsEmojis) {
            formatted = this.removeEmojis(formatted);
        }
        if (formatted.length > hook.maxLineLength) {
            formatted = this.truncate(formatted, hook.maxLineLength);
        }
        return formatted;
    }
    removeEmojis(text) {
        return text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{27BF}]|[\u{1F680}-\u{1F6FF}]/gu, '');
    }
    truncate(text, maxLength) {
        if (text.length <= maxLength)
            return text;
        return text.substring(0, maxLength - 3) + '...';
    }
    getAllIDEs() {
        return Array.from(this.hooks.keys());
    }
    supportsEmojis(ide) {
        return this.getHook(ide).supportsEmojis;
    }
    supportsPrefixes(ide) {
        return this.getHook(ide).supportsPrefixes;
    }
}
exports.IDEHookManager = IDEHookManager;
//# sourceMappingURL=ide-hooks.js.map