"use strict";
/**
 * Compression Engine - Multiple compression strategies
 * Optimizes output for different use cases
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompressionEngine = void 0;
class CompressionEngine {
    /**
     * Error-Only: Return minimal success/failure indicator
     * Use: When you only care about success/failure
     * Compression: 85-95%
     */
    compressErrorOnly(input, success) {
        const output = success ? '✅ Done' : '❌ Failed';
        const ratio = Math.round(((input.length - output.length) / input.length) * 100);
        return {
            strategy: 'error-only',
            input,
            output,
            ratio: Math.min(ratio, 95),
            optimizationScore: success ? 90 : 85,
        };
    }
    /**
     * Stats-Extraction: Extract key metrics only
     * Use: For executive summaries
     * Compression: 75-85%
     */
    compressStatsExtraction(input, stats) {
        const output = `${stats.agents} agents, ${stats.files} files, ${stats.compression}% compression`;
        const ratio = Math.round(((input.length - output.length) / input.length) * 100);
        return {
            strategy: 'stats-extraction',
            input,
            output,
            ratio: Math.min(ratio, 85),
            optimizationScore: 78,
        };
    }
    /**
     * Grouping: Group results by agent role
     * Use: For team-level views
     * Compression: 65-75%
     */
    compressGrouping(input, groups) {
        const groupStr = Object.entries(groups)
            .map(([group, count]) => `${group} (${count})`)
            .join(', ');
        const output = `[GROUPED] ${groupStr}`;
        const ratio = Math.round(((input.length - output.length) / input.length) * 100);
        return {
            strategy: 'grouping',
            input,
            output,
            ratio: Math.min(ratio, 75),
            optimizationScore: 70,
        };
    }
    /**
     * Deduplication: Remove repeated messages
     * Use: Interactive mode with repetitive output
     * Compression: 60-70%
     */
    compressDeduplication(input) {
        const lines = input.split('\n');
        const unique = Array.from(new Set(lines));
        const output = unique.join('\n');
        const ratio = Math.round(((input.length - output.length) / input.length) * 100);
        return {
            strategy: 'deduplication',
            input,
            output,
            ratio: Math.min(ratio, 70),
            optimizationScore: 65,
        };
    }
    /**
     * Progress-Filtering: Show progress, hide details
     * Use: Long-running operations
     * Compression: 50-60%
     */
    compressProgressFiltering(input, totalSteps, currentStep) {
        const progress = Math.round((currentStep / totalSteps) * 100);
        const output = `Processing... ${progress}% complete`;
        const ratio = Math.round(((input.length - output.length) / input.length) * 100);
        return {
            strategy: 'progress-filtering',
            input,
            output,
            ratio: Math.min(ratio, 60),
            optimizationScore: 55,
        };
    }
    /**
     * Hybrid: Combine multiple strategies
     * Use: Complex scenarios needing balanced compression
     */
    compressHybrid(input, options) {
        let output = input;
        let ratio = 0;
        if (options.prioritizeSuccess) {
            output = output.length < 50 ? '✅ Done' : output;
        }
        if (options.deduplicateLines) {
            const unique = Array.from(new Set(output.split('\n')));
            output = unique.join('\n');
        }
        if (output.length > 200) {
            output = output.substring(0, 200) + '...';
        }
        ratio = Math.round(((input.length - output.length) / input.length) * 100);
        return {
            strategy: 'hybrid',
            input,
            output,
            ratio: Math.min(ratio, 80),
            optimizationScore: 72,
        };
    }
    /**
     * Calculate best strategy based on input
     */
    selectBestStrategy(input, goal) {
        if (goal === 'quality')
            return 'stats-extraction';
        if (goal === 'speed')
            return 'error-only';
        return 'hybrid';
    }
}
exports.CompressionEngine = CompressionEngine;
//# sourceMappingURL=compression-engine.js.map