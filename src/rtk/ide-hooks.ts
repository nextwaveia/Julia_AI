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

export class IDEHookManager {
  private hooks: Map<IDE, IDEHook> = new Map();

  constructor() {
    this.registerDefaultHooks();
  }

  private registerDefaultHooks(): void {
    // Claude Code - supports full formatting
    this.registerHook({
      name: 'claude-code',
      format: (msg: string) => `🎼 Julia\n${msg}`,
      supportsPrefixes: true,
      supportsEmojis: true,
      maxLineLength: 120,
    });

    // Cursor - minimalist format
    this.registerHook({
      name: 'cursor',
      format: (msg: string) => msg,
      supportsPrefixes: false,
      supportsEmojis: true,
      maxLineLength: 100,
    });

    // GitHub Copilot - comment-based
    this.registerHook({
      name: 'copilot',
      format: (msg: string) => `// ${msg.replace(/\n/g, '\n// ')}`,
      supportsPrefixes: true,
      supportsEmojis: false,
      maxLineLength: 80,
    });

    // Cline - structured format
    this.registerHook({
      name: 'cline',
      format: (msg: string) => `[JULIA]\n${msg}`,
      supportsPrefixes: true,
      supportsEmojis: true,
      maxLineLength: 120,
    });

    // Windsurf - inline format
    this.registerHook({
      name: 'windsurf',
      format: (msg: string) => `▶ ${msg}`,
      supportsPrefixes: false,
      supportsEmojis: true,
      maxLineLength: 100,
    });

    // Gemini - clean format
    this.registerHook({
      name: 'gemini',
      format: (msg: string) => msg,
      supportsPrefixes: false,
      supportsEmojis: true,
      maxLineLength: 110,
    });

    // OpenCode - TypeScript plugin format
    this.registerHook({
      name: 'opencode',
      format: (msg: string) => `/* Julia: ${msg} */`,
      supportsPrefixes: false,
      supportsEmojis: false,
      maxLineLength: 100,
    });

    // Pi - extension format
    this.registerHook({
      name: 'pi',
      format: (msg: string) => `[julia] ${msg}`,
      supportsPrefixes: true,
      supportsEmojis: true,
      maxLineLength: 95,
    });

    // Hermes - Python plugin format
    this.registerHook({
      name: 'hermes',
      format: (msg: string) => `# Julia: ${msg}`,
      supportsPrefixes: true,
      supportsEmojis: false,
      maxLineLength: 90,
    });

    // Antigravity - shell hook format
    this.registerHook({
      name: 'antigravity',
      format: (msg: string) => `$ julia: ${msg}`,
      supportsPrefixes: false,
      supportsEmojis: false,
      maxLineLength: 85,
    });

    // Kilo Code - shell hook format
    this.registerHook({
      name: 'kilo',
      format: (msg: string) => `> ${msg}`,
      supportsPrefixes: false,
      supportsEmojis: true,
      maxLineLength: 100,
    });

    // Custom/Generic - flexible format
    this.registerHook({
      name: 'custom',
      format: (msg: string) => msg,
      supportsPrefixes: true,
      supportsEmojis: true,
      maxLineLength: 120,
    });
  }

  registerHook(hook: IDEHook): void {
    this.hooks.set(hook.name, hook);
  }

  getHook(ide: IDE): IDEHook {
    return this.hooks.get(ide) || this.hooks.get('custom')!;
  }

  format(message: string, ide: IDE): string {
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

  private removeEmojis(text: string): string {
    return text.replace(
      /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{27BF}]|[\u{1F680}-\u{1F6FF}]/gu,
      ''
    );
  }

  private truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }

  getAllIDEs(): IDE[] {
    return Array.from(this.hooks.keys());
  }

  supportsEmojis(ide: IDE): boolean {
    return this.getHook(ide).supportsEmojis;
  }

  supportsPrefixes(ide: IDE): boolean {
    return this.getHook(ide).supportsPrefixes;
  }
}
