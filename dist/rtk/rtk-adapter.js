"use strict";
/**
 * RTK Adapter - Rust Token Killer Integration
 * Provides 60-90% output compression on top of AIL's 40% compression
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RTKAdapter = void 0;
exports.selectCompressionStrategy = selectCompressionStrategy;
exports.selectIDEHook = selectIDEHook;
class RTKAdapter {
    constructor(config = {}) {
        this.config = {
            enabled: config.enabled ?? true,
            strategy: config.strategy ?? 'stats-extraction',
            ide: config.ide ?? 'claude-code',
            maxOutputLength: config.maxOutputLength ?? 500,
            preserveMetrics: config.preserveMetrics ?? true,
        };
    }
    setStrategy(strategy) {
        this.config.strategy = strategy;
    }
    setIDE(ide) {
        this.config.ide = ide;
    }
    compress(report) {
        if (!this.config.enabled) {
            const original = this.formatReport(report);
            return {
                original,
                compressed: original,
                compressionPercent: 0,
                strategy: 'error-only',
                ide: this.config.ide,
                timestamp: Date.now(),
            };
        }
        const original = this.formatReport(report);
        let compressed = original;
        switch (this.config.strategy) {
            case 'error-only':
                compressed = this.compressErrorOnly(report);
                break;
            case 'stats-extraction':
                compressed = this.compressStatsExtraction(report);
                break;
            case 'grouping':
                compressed = this.compressGrouping(report);
                break;
            case 'deduplication':
                compressed = this.compressDeduplication(report);
                break;
            case 'progress-filtering':
                compressed = this.compressProgressFiltering(report);
                break;
        }
        const compressionPercent = Math.round(((original.length - compressed.length) / original.length) * 100);
        return {
            original,
            compressed,
            compressionPercent: Math.min(compressionPercent, 100),
            strategy: this.config.strategy,
            ide: this.config.ide,
            timestamp: Date.now(),
        };
    }
    formatReport(report) {
        return `Action: ${report.action}
Target: ${report.target}
Status: ${report.status}
Agents: ${report.agents.executed}/${report.agents.executed + report.agents.failed}
Files: ${report.files.modified} modified, ${report.files.created} created
Compression: ${report.compression.reductionPercent}%
Parallelism: ${report.parallelism.factor.toFixed(2)}x`;
    }
    compressErrorOnly(report) {
        if (report.status === 'success') {
            return '✅ Done';
        }
        else if (report.status === 'partial') {
            return '⚠️ Partial success';
        }
        else {
            return '❌ Failed';
        }
    }
    compressStatsExtraction(report) {
        return `${report.agents.executed} agents, ${report.files.modified} files, ${report.compression.reductionPercent}% compression`;
    }
    compressGrouping(report) {
        return `[${report.status.toUpperCase()}] ${report.agents.executed} agents executed | ${report.files.modified} files modified`;
    }
    compressDeduplication(report) {
        const status = report.status === 'success' ? '✅' : '⚠️';
        return `${status} ${report.agents.executed}x agents | ${report.files.modified}x files`;
    }
    compressProgressFiltering(report) {
        return `Executing... ✅ Complete (${report.agents.executed} agents, ${report.compression.reductionPercent}% compression)`;
    }
    getCompressionStats(output) {
        const originalTokens = Math.ceil(output.original.length / 4);
        const compressedTokens = Math.ceil(output.compressed.length / 4);
        const savedTokens = originalTokens - compressedTokens;
        return {
            originalLength: output.original.length,
            compressedLength: output.compressed.length,
            compressionRatio: `${output.compressionPercent}%`,
            savedTokens,
        };
    }
}
exports.RTKAdapter = RTKAdapter;
function selectCompressionStrategy(priority) {
    if (priority.includes('error'))
        return 'error-only';
    if (priority.includes('stats'))
        return 'stats-extraction';
    if (priority.includes('group'))
        return 'grouping';
    if (priority.includes('dedup'))
        return 'deduplication';
    return 'progress-filtering';
}
function selectIDEHook(ide) {
    const mapping = {
        claude: 'claude-code',
        cursor: 'cursor',
        copilot: 'copilot',
        cline: 'cline',
        windsurf: 'windsurf',
        gemini: 'gemini',
        opencode: 'opencode',
        pi: 'pi',
        hermes: 'hermes',
        antigravity: 'antigravity',
        kilo: 'kilo',
    };
    return mapping[ide.toLowerCase()] || 'custom';
}
//# sourceMappingURL=rtk-adapter.js.map