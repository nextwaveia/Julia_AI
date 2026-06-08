/**
 * RTK Configuration - System configuration and management
 */

import { CompressionStrategy, IDE } from './rtk-adapter';

export interface RTKConfigFile {
  enabled: boolean;
  defaultStrategy: CompressionStrategy;
  defaultIDE: IDE;
  strategies: Record<CompressionStrategy, { enabled: boolean; maxReduction: number }>;
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

export class RTKConfigManager {
  private config: RTKConfigFile;

  constructor(overrides?: Partial<RTKConfigFile>) {
    this.config = this.getDefaultConfig();
    if (overrides) {
      this.config = { ...this.config, ...overrides };
    }
  }

  private getDefaultConfig(): RTKConfigFile {
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

  getConfig(): RTKConfigFile {
    return { ...this.config };
  }

  updateConfig(updates: Partial<RTKConfigFile>): void {
    this.config = { ...this.config, ...updates };
  }

  setDefaultStrategy(strategy: CompressionStrategy): void {
    this.config.defaultStrategy = strategy;
  }

  setDefaultIDE(ide: IDE): void {
    this.config.defaultIDE = ide;
  }

  enableStrategy(strategy: CompressionStrategy): void {
    if (this.config.strategies[strategy]) {
      this.config.strategies[strategy].enabled = true;
    }
  }

  disableStrategy(strategy: CompressionStrategy): void {
    if (this.config.strategies[strategy]) {
      this.config.strategies[strategy].enabled = false;
    }
  }

  setMaxReduction(strategy: CompressionStrategy, maxReduction: number): void {
    if (this.config.strategies[strategy]) {
      this.config.strategies[strategy].maxReduction = Math.min(maxReduction, 100);
    }
  }

  isStrategyEnabled(strategy: CompressionStrategy): boolean {
    return this.config.strategies[strategy]?.enabled ?? false;
  }

  getMaxReduction(strategy: CompressionStrategy): number {
    return this.config.strategies[strategy]?.maxReduction ?? 80;
  }

  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

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

  toJSON(): string {
    return JSON.stringify(this.config, null, 2);
  }

  static fromJSON(json: string): RTKConfigManager {
    try {
      const config = JSON.parse(json) as RTKConfigFile;
      return new RTKConfigManager(config);
    } catch (error) {
      throw new Error('Invalid RTK configuration JSON');
    }
  }
}
