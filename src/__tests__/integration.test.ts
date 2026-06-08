import { orchestrate } from '../core/index';

describe('Integration Tests', () => {
  test('should orchestrate full pipeline', async () => {
    const result = await orchestrate('Implementar settings.team');
    expect(result.intent).toBeTruthy();
    expect(result.ail).toBeTruthy();
    expect(result.dag).toBeTruthy();
    expect(result.results).toBeTruthy();
    expect(result.report).toBeTruthy();
  });

  test('should have valid intent', async () => {
    const result = await orchestrate('Implementar settings.team');
    expect(result.intent.action).toBe('implement');
    expect(result.intent.target).toBe('settings.team');
    expect(result.intent.confidence).toBeGreaterThan(0);
  });

  test('should have compressed AIL', async () => {
    const result = await orchestrate('Implementar settings.team');
    expect(result.ail.act).toBe('impl');
    expect(result.ail.tgt).toBe('settings.team');
    expect(result.ail.tokenCount).toBeGreaterThan(0);
  });

  test('should have valid DAG', async () => {
    const result = await orchestrate('Implementar settings.team');
    expect(result.dag.tasks.length).toBeGreaterThan(0);
    expect(result.dag.executionOrder).toBeTruthy();
    expect(result.dag.parallelismFactor).toBeGreaterThan(0);
  });

  test('should have executed tasks', async () => {
    const result = await orchestrate('Implementar settings.team');
    expect(result.results.length).toBeGreaterThan(0);
    result.results.forEach((r) => {
      expect(r.status).toBe('success');
    });
  });

  test('should have generated report', async () => {
    const result = await orchestrate('Implementar settings.team');
    expect(result.report.action).toBe('implement');
    expect(result.report.target).toBe('settings.team');
    expect(result.report.compression.reductionPercent).toBeGreaterThan(0);
  });

  test('full E2E flow', async () => {
    const result = await orchestrate('Refactor auth module');
    expect(result.intent.action).toBe('refactor');
    expect(result.dag.tasks.length).toBeGreaterThan(0);
    expect(result.results.length).toBe(result.dag.tasks.length);
  });
});
