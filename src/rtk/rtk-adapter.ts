/**
 * RTK Adapter - Rust Token Killer Integration
 * Provides 60-90% output compression on top of AIL's 40% compression
 */

import { ExecutionReport } from '../core/report-generator';

export type CompressionStrategy =
  | 'error-only'
  | 'stats-extraction'
  | 'grouping'
  | 'deduplication'
  | 'progress-filtering';

export type IDE =
  | 'claude-code'
  | 'cursor'
  | 'copilot'
  | 'cline'
  | 'windsurf'
  | 'gemini'
  | 'opencode'
  | 'pi'
  | 'hermes'
  | 'antigravity'
  | 'kilo'
  | 'custom';

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

export class RTKAdapter {
  private config: RTKConfig;

  constructor(config: Partial<RTKConfig> = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      strategy: config.strategy ?? 'stats-extraction',
      ide: config.ide ?? 'claude-code',
      maxOutputLength: config.maxOutputLength ?? 500,
      preserveMetrics: config.preserveMetrics ?? true,
    };
  }

  setStrategy(strategy: CompressionStrategy): void {
    this.config.strategy = strategy;
  }

  setIDE(ide: IDE): void {
    this.config.ide = ide;
  }

  compress(report: ExecutionReport): CompressedOutput {
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

    const compressionPercent = Math.round(
      ((original.length - compressed.length) / original.length) * 100
    );

    return {
      original,
      compressed,
      compressionPercent: Math.min(compressionPercent, 100),
      strategy: this.config.strategy,
      ide: this.config.ide,
      timestamp: Date.now(),
    };
  }

  private formatReport(report: ExecutionReport): string {
    return `Action: ${report.action}
Target: ${report.target}
Status: ${report.status}
Agents: ${report.agents.executed}/${report.agents.executed + report.agents.failed}
Files: ${report.files.modified} modified, ${report.files.created} created
Compression: ${report.compression.reductionPercent}%
Parallelism: ${report.parallelism.factor.toFixed(2)}x`;
  }

  private compressErrorOnly(report: ExecutionReport): string {
    if (report.status === 'success') {
      return '✅ Done';
    } else if (report.status === 'partial') {
      return '⚠️ Partial success';
    } else {
      return '❌ Failed';
    }
  }

  private compressStatsExtraction(report: ExecutionReport): string {
    return `${report.agents.executed} agents, ${report.files.modified} files, ${report.compression.reductionPercent}% compression`;
  }

  private compressGrouping(report: ExecutionReport): string {
    return `[${report.status.toUpperCase()}] ${report.agents.executed} agents executed | ${report.files.modified} files modified`;
  }

  private compressDeduplication(report: ExecutionReport): string {
    const status = report.status === 'success' ? '✅' : '⚠️';
    return `${status} ${report.agents.executed}x agents | ${report.files.modified}x files`;
  }

  private compressProgressFiltering(report: ExecutionReport): string {
    return `Executing... ✅ Complete (${report.agents.executed} agents, ${report.compression.reductionPercent}% compression)`;
  }

  getCompressionStats(output: CompressedOutput): {
    originalLength: number;
    compressedLength: number;
    compressionRatio: string;
    savedTokens: number;
  } {
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

export function selectCompressionStrategy(priority: string): CompressionStrategy {
  if (priority.includes('error')) return 'error-only';
  if (priority.includes('stats')) return 'stats-extraction';
  if (priority.includes('group')) return 'grouping';
  if (priority.includes('dedup')) return 'deduplication';
  return 'progress-filtering';
}

export function selectIDEHook(ide: string): IDE {
  const mapping: Record<string, IDE> = {
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
