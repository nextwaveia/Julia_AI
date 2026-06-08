import { RTKAdapter, selectCompressionStrategy, selectIDEHook } from '../rtk/rtk-adapter';
import { ExecutionReport } from '../core/report-generator';

const mockReport: ExecutionReport = {
  action: 'implement',
  target: 'settings.team',
  status: 'success',
  agents: { executed: 4, failed: 0 },
  files: { modified: 5, created: 2, deleted: 0 },
  validations: { typescript: true, i18n: true, rbac: true },
  compression: { inputTokens: 1000, outputTokens: 150, reductionPercent: 85 },
  parallelism: { factor: 2.5, estimatedFasterPercent: 60 },
};

describe('RTKAdapter', () => {
  let adapter: RTKAdapter;

  beforeEach(() => {
    adapter = new RTKAdapter({ enabled: true, strategy: 'stats-extraction' });
  });

  test('should compress report with stats-extraction strategy', () => {
    const result = adapter.compress(mockReport);
    expect(result.compressionPercent).toBeGreaterThan(0);
    expect(result.compressed.length).toBeLessThan(result.original.length);
  });

  test('should use error-only strategy', () => {
    adapter.setStrategy('error-only');
    const result = adapter.compress(mockReport);
    expect(result.compressed).toBe('✅ Done');
    expect(result.compressionPercent).toBeGreaterThan(50);
  });

  test('should use grouping strategy', () => {
    adapter.setStrategy('grouping');
    const result = adapter.compress(mockReport);
    expect(result.compressed).toContain('SUCCESS');
    expect(result.compressed).toContain('agents');
  });

  test('should use deduplication strategy', () => {
    adapter.setStrategy('deduplication');
    const result = adapter.compress(mockReport);
    expect(result.compressed).toContain('✅');
    expect(result.compressed).toContain('x');
  });

  test('should use progress-filtering strategy', () => {
    adapter.setStrategy('progress-filtering');
    const result = adapter.compress(mockReport);
    expect(result.compressed).toContain('Executing');
    expect(result.compressed).toContain('Complete');
  });

  test('should switch IDE targets', () => {
    adapter.setIDE('cursor');
    const result = adapter.compress(mockReport);
    expect(result.ide).toBe('cursor');
  });

  test('should calculate compression stats', () => {
    const result = adapter.compress(mockReport);
    const stats = adapter.getCompressionStats(result);
    expect(stats.savedTokens).toBeGreaterThan(0);
    expect(stats.compressionRatio).toContain('%');
  });

  test('should disable compression when disabled', () => {
    const disabledAdapter = new RTKAdapter({ enabled: false });
    const result = disabledAdapter.compress(mockReport);
    expect(result.compressionPercent).toBe(0);
    expect(result.original).toBe(result.compressed);
  });

  test('should handle failed reports', () => {
    const failedReport: ExecutionReport = {
      ...mockReport,
      status: 'failed',
    };
    adapter.setStrategy('error-only');
    const result = adapter.compress(failedReport);
    expect(result.compressed).toBe('❌ Failed');
  });

  test('should handle partial success', () => {
    const partialReport: ExecutionReport = {
      ...mockReport,
      status: 'partial',
    };
    adapter.setStrategy('error-only');
    const result = adapter.compress(partialReport);
    expect(result.compressed).toBe('⚠️ Partial success');
  });

  test('should preserve all compression percentages', () => {
    const result = adapter.compress(mockReport);
    expect(result.compressionPercent).toBeGreaterThanOrEqual(0);
    expect(result.compressionPercent).toBeLessThanOrEqual(100);
  });
});

describe('Strategy Selection', () => {
  test('should select error-only strategy', () => {
    const strategy = selectCompressionStrategy('error');
    expect(strategy).toBe('error-only');
  });

  test('should select stats-extraction strategy', () => {
    const strategy = selectCompressionStrategy('stats');
    expect(strategy).toBe('stats-extraction');
  });

  test('should select grouping strategy', () => {
    const strategy = selectCompressionStrategy('group');
    expect(strategy).toBe('grouping');
  });

  test('should select deduplication strategy', () => {
    const strategy = selectCompressionStrategy('dedup');
    expect(strategy).toBe('deduplication');
  });

  test('should default to progress-filtering', () => {
    const strategy = selectCompressionStrategy('unknown');
    expect(strategy).toBe('progress-filtering');
  });
});

describe('IDE Hook Selection', () => {
  test('should detect Claude Code IDE', () => {
    const ide = selectIDEHook('claude');
    expect(ide).toBe('claude-code');
  });

  test('should detect Cursor IDE', () => {
    const ide = selectIDEHook('cursor');
    expect(ide).toBe('cursor');
  });

  test('should detect GitHub Copilot', () => {
    const ide = selectIDEHook('copilot');
    expect(ide).toBe('copilot');
  });

  test('should detect all 12 IDEs', () => {
    const ides = [
      'claude',
      'cursor',
      'copilot',
      'cline',
      'windsurf',
      'gemini',
      'opencode',
      'pi',
      'hermes',
      'antigravity',
      'kilo',
    ];
    ides.forEach((ide) => {
      const result = selectIDEHook(ide);
      expect(result).not.toBe('custom');
    });
  });

  test('should default to custom for unknown IDE', () => {
    const ide = selectIDEHook('unknown-ide');
    expect(ide).toBe('custom');
  });

  test('should handle case-insensitive IDE names', () => {
    const ide1 = selectIDEHook('CURSOR');
    const ide2 = selectIDEHook('cursor');
    expect(ide1).toBe(ide2);
  });
});
