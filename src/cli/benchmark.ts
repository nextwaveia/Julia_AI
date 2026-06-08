#!/usr/bin/env node

import chalk from 'chalk';
import { runBenchmarks, formatBenchmarkResults } from '../core/benchmarks';

async function main() {
  console.log(chalk.cyan('\n🏃 JULIA 3.0 PERFORMANCE BENCHMARKS\n'));

  try {
    console.log('Running benchmarks...');
    const results = await runBenchmarks();

    console.log(chalk.green('\n✅ Benchmark Results:\n'));
    console.log(formatBenchmarkResults(results));

    const avgTime =
      results.reduce((sum, r) => sum + r.executionTime, 0) / results.length;
    const avgCompression =
      results.reduce((sum, r) => sum + r.tokenCompression, 0) / results.length;
    const avgParallelism =
      results.reduce((sum, r) => sum + r.parallelismFactor, 0) / results.length;

    console.log(chalk.blue('\n📊 Summary:\n'));
    console.log(`  Avg Execution Time:    ${avgTime.toFixed(1)}ms`);
    console.log(`  Avg Token Compression: ${avgCompression.toFixed(1)}%`);
    console.log(`  Avg Parallelism:       ${avgParallelism.toFixed(2)}x\n`);
  } catch (error) {
    console.error(chalk.red(`Error: ${error}`));
    process.exit(1);
  }
}

main();
