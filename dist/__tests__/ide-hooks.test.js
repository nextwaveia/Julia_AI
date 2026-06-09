"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ide_hooks_1 = require("../rtk/ide-hooks");
describe('IDEHookManager', () => {
    let manager;
    beforeEach(() => {
        manager = new ide_hooks_1.IDEHookManager();
    });
    test('should format for Claude Code', () => {
        const result = manager.format('Done', 'claude-code');
        expect(result).toContain('Julia');
        expect(result).toContain('Done');
    });
    test('should format for Cursor', () => {
        const result = manager.format('Success', 'cursor');
        expect(result).toBe('Success');
    });
    test('should format for GitHub Copilot', () => {
        const result = manager.format('Complete', 'copilot');
        expect(result).toContain('//');
        expect(result).toContain('Complete');
    });
    test('should format for Cline', () => {
        const result = manager.format('Executed', 'cline');
        expect(result).toContain('[JULIA]');
    });
    test('should format for Windsurf', () => {
        const result = manager.format('Running', 'windsurf');
        expect(result).toContain('▶');
    });
    test('should format for Gemini', () => {
        const result = manager.format('Done', 'gemini');
        expect(result).toBe('Done');
    });
    test('should format for OpenCode', () => {
        const result = manager.format('Finished', 'opencode');
        expect(result).toContain('/*');
        expect(result).toContain('Julia');
        expect(result).toContain('*/');
    });
    test('should format for Pi', () => {
        const result = manager.format('Ready', 'pi');
        expect(result).toContain('[julia]');
    });
    test('should format for Hermes', () => {
        const result = manager.format('Working', 'hermes');
        expect(result).toContain('#');
        expect(result).toContain('Julia');
    });
    test('should format for Antigravity', () => {
        const result = manager.format('Active', 'antigravity');
        expect(result).toContain('$');
        expect(result).toContain('julia');
    });
    test('should format for Kilo Code', () => {
        const result = manager.format('Processing', 'kilo');
        expect(result).toContain('>');
    });
    test('should format for custom IDE', () => {
        const result = manager.format('Default', 'custom');
        expect(result).toBe('Default');
    });
    test('should remove emojis when not supported', () => {
        const result = manager.format('✅ Done', 'copilot');
        expect(result).not.toContain('✅');
    });
    test('should keep emojis when supported', () => {
        const result = manager.format('✅ Success', 'claude-code');
        expect(result).toContain('✅');
    });
    test('should truncate long text', () => {
        const longText = 'a'.repeat(200);
        const result = manager.format(longText, 'copilot');
        expect(result.length).toBeLessThan(longText.length);
        expect(result).toContain('...');
    });
    test('should get all IDEs', () => {
        const ides = manager.getAllIDEs();
        expect(ides.length).toBe(12);
    });
    test('should check emoji support', () => {
        expect(manager.supportsEmojis('claude-code')).toBe(true);
        expect(manager.supportsEmojis('copilot')).toBe(false);
        expect(manager.supportsEmojis('cursor')).toBe(true);
    });
    test('should check prefix support', () => {
        expect(manager.supportsPrefixes('claude-code')).toBe(true);
        expect(manager.supportsPrefixes('cursor')).toBe(false);
    });
    test('should handle multiline messages', () => {
        const multiline = 'Line 1\nLine 2\nLine 3';
        const result = manager.format(multiline, 'copilot');
        expect(result).toContain('//');
        expect(result).toContain('Line 1');
        expect(result).toContain('Line 2');
    });
    test('should default to custom for unknown IDE', () => {
        const result = manager.format('Test', 'custom');
        expect(result).toBe('Test');
    });
});
//# sourceMappingURL=ide-hooks.test.js.map