/**
 * RTK Configuration - System configuration and management
 */
import { CompressionStrategy, IDE } from './rtk-adapter';
export interface RTKConfigFile {
    enabled: boolean;
    defaultStrategy: CompressionStrategy;
    defaultIDE: IDE;
    strategies: Record<CompressionStrategy, {
        enabled: boolean;
        maxReduction: number;
    }>;
    performance: {
        maxCompressionTime: number;
        cacheCompressions: boolean;
    };
    output: {
        preserveMetrics: boolean;
        showCompressionStats: boolean;
        includeTimestamp: boolean;
    };
}
export declare class RTKConfigManager {
    private config;
    constructor(overrides?: Partial<RTKConfigFile>);
    private getDefaultConfig;
    getConfig(): RTKConfigFile;
    updateConfig(updates: Partial<RTKConfigFile>): void;
    setDefaultStrategy(strategy: CompressionStrategy): void;
    setDefaultIDE(ide: IDE): void;
    enableStrategy(strategy: CompressionStrategy): void;
    disableStrategy(strategy: CompressionStrategy): void;
    setMaxReduction(strategy: CompressionStrategy, maxReduction: number): void;
    isStrategyEnabled(strategy: CompressionStrategy): boolean;
    getMaxReduction(strategy: CompressionStrategy): number;
    validate(): {
        valid: boolean;
        errors: string[];
    };
    toJSON(): string;
    static fromJSON(json: string): RTKConfigManager;
}
//# sourceMappingURL=rtk-config.d.ts.map