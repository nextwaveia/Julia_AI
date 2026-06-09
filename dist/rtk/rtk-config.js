"use strict";
/**
 * RTK Configuration - System configuration and management
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RTKConfigManager = void 0;
class RTKConfigManager {
    constructor(overrides) {
        this.config = this.getDefaultConfig();
        if (overrides) {
            this.config = { ...this.config, ...overrides };
        }
    }
    getDefaultConfig() {
        return {
            enabled: true,
            defaultStrategy: 'stats-extraction',
            defaultIDE: 'claude-code',
            strategies: {
                'error-only': { enabled: true, maxReduction: 95 },
                'stats-extraction': { enabled: true, maxReduction: 85 },
                grouping: { enabled: true, maxReduction: 75 },
                deduplication: { enabled: true, maxReduction: 70 },
                'progress-filtering': { enabled: true, maxReduction: 60 },
            },
            performance: {
                maxCompressionTime: 100,
                cacheCompressions: true,
            },
            output: {
                preserveMetrics: true,
                showCompressionStats: true,
                includeTimestamp: false,
            },
        };
    }
    getConfig() {
        return { ...this.config };
    }
    updateConfig(updates) {
        this.config = { ...this.config, ...updates };
    }
    setDefaultStrategy(strategy) {
        this.config.defaultStrategy = strategy;
    }
    setDefaultIDE(ide) {
        this.config.defaultIDE = ide;
    }
    enableStrategy(strategy) {
        if (this.config.strategies[strategy]) {
            this.config.strategies[strategy].enabled = true;
        }
    }
    disableStrategy(strategy) {
        if (this.config.strategies[strategy]) {
            this.config.strategies[strategy].enabled = false;
        }
    }
    setMaxReduction(strategy, maxReduction) {
        if (this.config.strategies[strategy]) {
            this.config.strategies[strategy].maxReduction = Math.min(maxReduction, 100);
        }
    }
    isStrategyEnabled(strategy) {
        return this.config.strategies[strategy]?.enabled ?? false;
    }
    getMaxReduction(strategy) {
        return this.config.strategies[strategy]?.maxReduction ?? 80;
    }
    validate() {
        const errors = [];
        if (!this.config.enabled && !Object.values(this.config.strategies).some((s) => s.enabled)) {
            errors.push('At least one strategy must be enabled');
        }
        Object.entries(this.config.strategies).forEach(([strategy, config]) => {
            if (config.maxReduction < 0 || config.maxReduction > 100) {
                errors.push(`Invalid maxReduction for ${strategy}: ${config.maxReduction}`);
            }
        });
        if (this.config.performance.maxCompressionTime < 10) {
            errors.push('maxCompressionTime must be >= 10ms');
        }
        return {
            valid: errors.length === 0,
            errors,
        };
    }
    toJSON() {
        return JSON.stringify(this.config, null, 2);
    }
    static fromJSON(json) {
        try {
            const config = JSON.parse(json);
            return new RTKConfigManager(config);
        }
        catch (error) {
            throw new Error('Invalid RTK configuration JSON');
        }
    }
}
exports.RTKConfigManager = RTKConfigManager;
//# sourceMappingURL=rtk-config.js.map