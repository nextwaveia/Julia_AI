#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const benchmarks_1 = require("../core/benchmarks");
async function main() {
    console.log(chalk_1.default.cyan('\n🏃 JULIA 3.0 PERFORMANCE BENCHMARKS\n'));
    try {
        console.log('Running benchmarks...');
        const results = await (0, benchmarks_1.runBenchmarks)();
        console.log(chalk_1.default.green('\n✅ Benchmark Results:\n'));
        console.log((0, benchmarks_1.formatBenchmarkResults)(results));
        const avgTime = results.reduce((sum, r) => sum + r.executionTime, 0) / results.length;
        const avgCompression = results.reduce((sum, r) => sum + r.tokenCompression, 0) / results.length;
        const avgParallelism = results.reduce((sum, r) => sum + r.parallelismFactor, 0) / results.length;
        console.log(chalk_1.default.blue('\n📊 Summary:\n'));
        console.log(`  Avg Execution Time:    ${avgTime.toFixed(1)}ms`);
        console.log(`  Avg Token Compression: ${avgCompression.toFixed(1)}%`);
        console.log(`  Avg Parallelism:       ${avgParallelism.toFixed(2)}x\n`);
    }
    catch (error) {
        console.error(chalk_1.default.red(`Error: ${error}`));
        process.exit(1);
    }
}
main();
//# sourceMappingURL=benchmark.js.map