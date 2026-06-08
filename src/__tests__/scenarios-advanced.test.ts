import { orchestrate } from '../core/index';

describe('Advanced Scenario Tests', () => {
  test('Scenario: Complex multi-team orchestration', async () => {
    const result = await orchestrate('Implementar settings.team');
    expect(result.dag.tasks.length).toBeGreaterThanOrEqual(4);
    expect(result.report.agents.executed).toBeGreaterThan(0);
    expect(result.report.status).toBe('success');
  });

  test('Scenario: Edge case - very short input', async () => {
    const result = await orchestrate('Fix');
    expect(result.intent.action).toBe('fix');
    expect(result.report.status).toBe('success');
  });

  test('Scenario: Edge case - multiple spaces', async () => {
    const result = await orchestrate('Implementar    settings.team');
    expect(result.intent.target).toBeTruthy();
    expect(result.dag.tasks.length).toBeGreaterThan(0);
  });

  test('Scenario: Edge case - mixed case', async () => {
    const result = await orchestrate('IMPLEMENTAR SETTINGS.TEAM');
    expect(result.intent.action).toBe('implement');
  });

  test('Scenario: Refactor with multiple modules', async () => {
    const result = await orchestrate('Refactor auth module and API endpoints');
    expect(result.intent.action).toBe('refactor');
    expect(result.dag.parallelismFactor).toBeGreaterThan(0);
  });

  test('Scenario: Audit with validation', async () => {
    const result = await orchestrate('Audit RBAC settings compliance');
    expect(result.intent.action).toBe('audit');
    expect(result.report.validations.rbac).toBe(true);
  });

  test('Scenario: Performance sensitive task', async () => {
    const start = Date.now();
    const result = await orchestrate('Enhance performance');
    const duration = Date.now() - start;
    expect(result.report.parallelism.factor).toBeGreaterThanOrEqual(1);
    expect(duration).toBeLessThan(15000);
  });

  test('Scenario: Compression validation', async () => {
    const result = await orchestrate('Implementar settings.team');
    const compressionPercent = result.report.compression.reductionPercent;
    expect(compressionPercent).toBeGreaterThan(50);
    expect(compressionPercent).toBeLessThan(100);
  });

  test('Scenario: Task parallelism verification', async () => {
    const result = await orchestrate('Implementar settings.team');
    expect(result.dag.parallelismFactor).toBeGreaterThanOrEqual(1);
    expect(result.dag.parallelismFactor).toBeLessThanOrEqual(3);
  });

  test('Scenario: All agents executed', async () => {
    const result = await orchestrate('Implementar settings.team');
    const executedCount = result.results.filter(
      (r) => r.status === 'success'
    ).length;
    expect(executedCount).toBeGreaterThan(0);
    expect(executedCount).toBeLessThanOrEqual(result.dag.tasks.length);
  });
});

describe('Stress Test Scenarios', () => {
  test('Stress: Multiple sequential scenarios', async () => {
    const scenarios = [
      'Implementar settings.team',
      'Refactor auth module',
      'Audit RBAC settings',
    ];

    for (const scenario of scenarios) {
      const result = await orchestrate(scenario);
      expect(result.report.status).toBe('success');
    }
  });

  test('Stress: Rapid sequential executions', async () => {
    const results = [];
    for (let i = 0; i < 3; i++) {
      const result = await orchestrate('Fix TypeScript errors');
      results.push(result);
    }
    expect(results).toHaveLength(3);
    results.forEach((r) => {
      expect(r.report.status).toBe('success');
    });
  });

  test('Stress: Large input handling', async () => {
    const longTarget = 'implement.' + 'module.'.repeat(50) + 'feature';
    const result = await orchestrate(`Implementar ${longTarget}`);
    expect(result.intent.target).toContain('implement');
  });
});

describe('Error Scenario Handling', () => {
  test('Error: Graceful handling of empty action', async () => {
    const result = await orchestrate('settings.team');
    expect(result.intent.action).toBe('implement');
  });

  test('Error: Unknown action defaults to implement', async () => {
    const result = await orchestrate('Unknown action for settings.team');
    expect(result.intent.action).toBe('implement');
  });

  test('Error: Special characters handling', async () => {
    const result = await orchestrate('Implementar settings-team');
    expect(result.intent).toBeTruthy();
    expect(result.dag.tasks.length).toBeGreaterThan(0);
  });

  test('Error: Numeric input handling', async () => {
    const result = await orchestrate('Implementar 123.456');
    expect(result.intent.target).toBeTruthy();
  });

  test('Error: UTF-8 character handling', async () => {
    const result = await orchestrate('Implementar settings.équipe');
    expect(result.intent).toBeTruthy();
  });
});
