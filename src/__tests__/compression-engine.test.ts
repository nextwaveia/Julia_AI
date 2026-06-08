import { CompressionEngine } from '../rtk/compression-engine';

describe('CompressionEngine', () => {
  let engine: CompressionEngine;
  const longInput = 'a'.repeat(1000);

  beforeEach(() => {
    engine = new CompressionEngine();
  });

  test('should compress with error-only strategy', () => {
    const result = engine.compressErrorOnly(longInput, true);
    expect(result.output).toBe('✅ Done');
    expect(result.ratio).toBeGreaterThan(80);
    expect(result.strategy).toBe('error-only');
  });

  test('should show failure in error-only', () => {
    const result = engine.compressErrorOnly(longInput, false);
    expect(result.output).toBe('❌ Failed');
    expect(result.ratio).toBeGreaterThan(80);
  });

  test('should compress with stats-extraction strategy', () => {
    const result = engine.compressStatsExtraction(longInput, {
      agents: 5,
      files: 10,
      compression: 87,
    });
    expect(result.output).toContain('5 agents');
    expect(result.output).toContain('10 files');
    expect(result.ratio).toBeGreaterThan(70);
  });

  test('should compress with grouping strategy', () => {
    const result = engine.compressGrouping(longInput, {
      Backend: 3,
      Frontend: 2,
      QA: 1,
    });
    expect(result.output).toContain('GROUPED');
    expect(result.output).toContain('Backend');
    expect(result.ratio).toBeGreaterThan(60);
  });

  test('should compress with deduplication strategy', () => {
    const duplicateInput = 'Line1\nLine1\nLine2\nLine2\nLine3';
    const result = engine.compressDeduplication(duplicateInput);
    expect(result.output).not.toContain('Line1\nLine1');
    expect(result.ratio).toBeGreaterThan(0);
  });

  test('should compress with progress-filtering strategy', () => {
    const result = engine.compressProgressFiltering(longInput, 10, 7);
    expect(result.output).toContain('70% complete');
    expect(result.ratio).toBeGreaterThan(50);
  });

  test('should use hybrid compression', () => {
    const result = engine.compressHybrid(longInput, {
      prioritizeSuccess: true,
      deduplicateLines: true,
    });
    expect(result.strategy).toBe('hybrid');
    expect(result.ratio).toBeGreaterThan(50);
  });

  test('should select quality strategy', () => {
    const strategy = engine.selectBestStrategy(longInput, 'quality');
    expect(strategy).toBe('stats-extraction');
  });

  test('should select speed strategy', () => {
    const strategy = engine.selectBestStrategy(longInput, 'speed');
    expect(strategy).toBe('error-only');
  });

  test('should select balance strategy', () => {
    const strategy = engine.selectBestStrategy(longInput, 'balance');
    expect(strategy).toBe('hybrid');
  });

  test('should maintain compression ratio bounds', () => {
    const result = engine.compressErrorOnly(longInput, true);
    expect(result.ratio).toBeLessThanOrEqual(100);
    expect(result.ratio).toBeGreaterThanOrEqual(0);
  });

  test('should calculate optimization score', () => {
    const result = engine.compressErrorOnly(longInput, true);
    expect(result.optimizationScore).toBeGreaterThan(0);
    expect(result.optimizationScore).toBeLessThanOrEqual(100);
  });

  test('should preserve input in result', () => {
    const result = engine.compressErrorOnly(longInput, true);
    expect(result.input).toBe(longInput);
    expect(result.input.length).toBeGreaterThan(result.output.length);
  });
});
