import { runBenchmarks, formatBenchmarkResults } from '../core/benchmarks';

describe('Performance Benchmarks', () => {
  test('should run benchmarks for all scenarios', async () => {
    const results = await runBenchmarks();
    expect(results.length).toBe(5);
  });

  test('should have valid execution times', async () => {
    const results = await runBenchmarks();
    results.forEach((r) => {
      expect(r.executionTime).toBeGreaterThan(0);
    });
  });

  test('should have compression metrics', async () => {
    const results = await runBenchmarks();
    results.forEach((r) => {
      expect(r.tokenCompression).toBeGreaterThanOrEqual(0);
      expect(r.tokenCompression).toBeLessThanOrEqual(100);
    });
  });

  test('should have parallelism factors', async () => {
    const results = await runBenchmarks();
    results.forEach((r) => {
      expect(r.parallelismFactor).toBeGreaterThan(0);
    });
  });

  test('should have task counts', async () => {
    const results = await runBenchmarks();
    results.forEach((r) => {
      expect(r.taskCount).toBeGreaterThan(0);
    });
  });

  test('should have success rates', async () => {
    const results = await runBenchmarks();
    results.forEach((r) => {
      expect(r.successRate).toBeGreaterThan(0);
      expect(r.successRate).toBeLessThanOrEqual(1);
    });
  });

  test('should format results as table', async () => {
    const results = await runBenchmarks();
    const formatted = formatBenchmarkResults(results);
    expect(formatted).toContain('Scenario');
    expect(formatted).toContain('Time');
    expect(formatted).toContain('Compress');
    expect(formatted).toContain('AVERAGE');
  });

  test('should have all required scenarios', async () => {
    const results = await runBenchmarks();
    const scenarios = results.map((r) => r.scenario);
    expect(scenarios).toContain('Implementar settings.team');
    expect(scenarios).toContain('Refactor auth module');
    expect(scenarios).toContain('Audit RBAC settings');
    expect(scenarios).toContain('Fix TypeScript errors');
    expect(scenarios).toContain('Enhance performance');
  });
});
