"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rtk_config_1 = require("../rtk/rtk-config");
describe('RTKConfigManager', () => {
    let manager;
    beforeEach(() => {
        manager = new rtk_config_1.RTKConfigManager();
    });
    test('should get default configuration', () => {
        const config = manager.getConfig();
        expect(config.enabled).toBe(true);
        expect(config.defaultStrategy).toBe('stats-extraction');
        expect(config.defaultIDE).toBe('claude-code');
    });
    test('should update configuration', () => {
        manager.updateConfig({ defaultStrategy: 'error-only' });
        const config = manager.getConfig();
        expect(config.defaultStrategy).toBe('error-only');
    });
    test('should set default strategy', () => {
        manager.setDefaultStrategy('grouping');
        const config = manager.getConfig();
        expect(config.defaultStrategy).toBe('grouping');
    });
    test('should set default IDE', () => {
        manager.setDefaultIDE('cursor');
        const config = manager.getConfig();
        expect(config.defaultIDE).toBe('cursor');
    });
    test('should enable strategy', () => {
        manager.disableStrategy('error-only');
        manager.enableStrategy('error-only');
        expect(manager.isStrategyEnabled('error-only')).toBe(true);
    });
    test('should disable strategy', () => {
        manager.disableStrategy('error-only');
        expect(manager.isStrategyEnabled('error-only')).toBe(false);
    });
    test('should set max reduction', () => {
        manager.setMaxReduction('error-only', 90);
        expect(manager.getMaxReduction('error-only')).toBe(90);
    });
    test('should cap max reduction at 100', () => {
        manager.setMaxReduction('error-only', 150);
        expect(manager.getMaxReduction('error-only')).toBe(100);
    });
    test('should validate configuration', () => {
        const validation = manager.validate();
        expect(validation.valid).toBe(true);
        expect(validation.errors).toHaveLength(0);
    });
    test('should detect invalid max reduction', () => {
        manager.setMaxReduction('error-only', -10);
        const validation = manager.validate();
        expect(validation.valid).toBe(false);
        expect(validation.errors.length).toBeGreaterThan(0);
    });
    test('should serialize to JSON', () => {
        const json = manager.toJSON();
        expect(json).toContain('enabled');
        expect(json).toContain('defaultStrategy');
        expect(json).toContain('defaultIDE');
    });
    test('should deserialize from JSON', () => {
        const json = manager.toJSON();
        const newManager = rtk_config_1.RTKConfigManager.fromJSON(json);
        const config = newManager.getConfig();
        expect(config.enabled).toBe(true);
        expect(config.defaultStrategy).toBe('stats-extraction');
    });
    test('should throw on invalid JSON', () => {
        expect(() => {
            rtk_config_1.RTKConfigManager.fromJSON('invalid json');
        }).toThrow();
    });
    test('should handle configuration overrides', () => {
        const customManager = new rtk_config_1.RTKConfigManager({
            defaultStrategy: 'error-only',
            defaultIDE: 'cursor',
        });
        const config = customManager.getConfig();
        expect(config.defaultStrategy).toBe('error-only');
        expect(config.defaultIDE).toBe('cursor');
    });
    test('should preserve metrics by default', () => {
        const config = manager.getConfig();
        expect(config.output.preserveMetrics).toBe(true);
    });
    test('should have performance limits', () => {
        const config = manager.getConfig();
        expect(config.performance.maxCompressionTime).toBeGreaterThan(0);
    });
});
//# sourceMappingURL=rtk-config.test.js.map