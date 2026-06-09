/**
 * Compression Engine - Multiple compression strategies
 * Optimizes output for different use cases
 */
export interface CompressionResult {
    strategy: string;
    input: string;
    output: string;
    ratio: number;
    optimizationScore: number;
}
export declare class CompressionEngine {
    /**
     * Error-Only: Return minimal success/failure indicator
     * Use: When you only care about success/failure
     * Compression: 85-95%
     */
    compressErrorOnly(input: string, success: boolean): CompressionResult;
    /**
     * Stats-Extraction: Extract key metrics only
     * Use: For executive summaries
     * Compression: 75-85%
     */
    compressStatsExtraction(input: string, stats: {
        agents: number;
        files: number;
        compression: number;
    }): CompressionResult;
    /**
     * Grouping: Group results by agent role
     * Use: For team-level views
     * Compression: 65-75%
     */
    compressGrouping(input: string, groups: Record<string, number>): CompressionResult;
    /**
     * Deduplication: Remove repeated messages
     * Use: Interactive mode with repetitive output
     * Compression: 60-70%
     */
    compressDeduplication(input: string): CompressionResult;
    /**
     * Progress-Filtering: Show progress, hide details
     * Use: Long-running operations
     * Compression: 50-60%
     */
    compressProgressFiltering(input: string, totalSteps: number, currentStep: number): CompressionResult;
    /**
     * Hybrid: Combine multiple strategies
     * Use: Complex scenarios needing balanced compression
     */
    compressHybrid(input: string, options: {
        prioritizeSuccess?: boolean;
        showStats?: boolean;
        groupResults?: boolean;
        deduplicateLines?: boolean;
    }): CompressionResult;
    /**
     * Calculate best strategy based on input
     */
    selectBestStrategy(input: string, goal: 'quality' | 'speed' | 'balance'): string;
}
//# sourceMappingURL=compression-engine.d.ts.map