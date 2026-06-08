/**
 * Performance Benchmarks for Julia 3.0
 * Measures execution time, token compression, and parallelism
 */

import { orchestrate } from './index';

interface BenchmarkResult {
  scenario: string;
  executionTime: number;
  tokenCompression: number;
  parallelismFactor: number;
  taskCount: number;
  successRate: number;
}

export async function runBenchmarks(): Promise<BenchmarkResult[]> {
  const scenarios = [
    'Implementar settings.team',
    'Refactor auth module',
    'Audit RBAC settings',
    'Fix TypeScript errors',
    'Enhance performance',
  ];

  const results: BenchmarkResult[] = [];

  for (const scenario of scenarios) {
    const startTime = Date.now();
    const result = await orchestrate(scenario);
    const endTime = Date.now();

    const successRate =
      result.results.filter((r) => r.status === 'success').length /
      result.results.length;

    results.push({
      scenario,
      executionTime: endTime - startTime,
      tokenCompression: result.report.compression.reductionPercent,
      parallelismFactor: result.report.parallelism.factor,
      taskCount: result.dag.tasks.length,
      successRate,
    });
  }

  return results;
}

export function formatBenchmarkResults(results: BenchmarkResult[]): string {
  const tableHeader = `
╔════════════════════════╦═══════════╦═══════════╦══════════╦═════════╦════════════╗
║ Scenario               ║ Time (ms) ║ Compress% ║ Parallel ║ Tasks   ║ Success %  ║
╠════════════════════════╬═══════════╬═══════════╬══════════╬═════════╬════════════╣`;

  const rows = results
    .map(
      (r) =>
        `║ ${r.scenario.padEnd(22)} ║ ${String(r.executionTime).padStart(9)} ║ ${String(r.tokenCompression).padStart(9)} ║ ${r.parallelismFactor.toFixed(2).padStart(8)} ║ ${String(r.taskCount).padStart(7)} ║ ${(r.successRate * 100).toFixed(1).padStart(10)} ║`
    )
    .join('\n');

  const avg = {
    time: results.reduce((sum, r) => sum + r.executionTime, 0) / results.length,
    compression:
      results.reduce((sum, r) => sum + r.tokenCompression, 0) / results.length,
    parallelism:
      results.reduce((sum, r) => sum + r.parallelismFactor, 0) / results.length,
  };

  const footer = `╠════════════════════════╬═══════════╬═══════════╬══════════╬═════════╬════════════╣
║ AVERAGE                ║ ${String(avg.time.toFixed(1)).padStart(9)} ║ ${String(avg.compression.toFixed(1)).padStart(9)} ║ ${avg.parallelism.toFixed(2).padStart(8)} ║ - ║ - ║
╚════════════════════════╩═══════════╩═══════════╩══════════╩═════════╩════════════╝`;

  return tableHeader + '\n' + rows + '\n' + footer;
}
