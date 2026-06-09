/**
 * Performance Benchmarks for Julia 3.0
 * Measures execution time, token compression, and parallelism
 */
interface BenchmarkResult {
    scenario: string;
    executionTime: number;
    tokenCompression: number;
    parallelismFactor: number;
    taskCount: number;
    successRate: number;
}
export declare function runBenchmarks(): Promise<BenchmarkResult[]>;
export declare function formatBenchmarkResults(results: BenchmarkResult[]): string;
export {};
//# sourceMappingURL=benchmarks.d.ts.map