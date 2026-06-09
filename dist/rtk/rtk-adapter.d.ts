/**
 * RTK Adapter - Rust Token Killer Integration
 * Provides 60-90% output compression on top of AIL's 40% compression
 */
import { ExecutionReport } from '../core/report-generator';
export type CompressionStrategy = 'error-only' | 'stats-extraction' | 'grouping' | 'deduplication' | 'progress-filtering';
export type IDE = 'claude-code' | 'cursor' | 'copilot' | 'cline' | 'windsurf' | 'gemini' | 'opencode' | 'pi' | 'hermes' | 'antigravity' | 'kilo' | 'custom';
export interface RTKConfig {
    enabled: boolean;
    strategy: CompressionStrategy;
    ide: IDE;
    maxOutputLength?: number;
    preserveMetrics?: boolean;
}
export interface CompressedOutput {
    original: string;
    compressed: string;
    compressionPercent: number;
    strategy: CompressionStrategy;
    ide: IDE;
    timestamp: number;
}
export declare class RTKAdapter {
    private config;
    constructor(config?: Partial<RTKConfig>);
    setStrategy(strategy: CompressionStrategy): void;
    setIDE(ide: IDE): void;
    compress(report: ExecutionReport): CompressedOutput;
    private formatReport;
    private compressErrorOnly;
    private compressStatsExtraction;
    private compressGrouping;
    private compressDeduplication;
    private compressProgressFiltering;
    getCompressionStats(output: CompressedOutput): {
        originalLength: number;
        compressedLength: number;
        compressionRatio: string;
        savedTokens: number;
    };
}
export declare function selectCompressionStrategy(priority: string): CompressionStrategy;
export declare function selectIDEHook(ide: string): IDE;
//# sourceMappingURL=rtk-adapter.d.ts.map