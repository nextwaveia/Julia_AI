/**
 * Julia 3.0 Core Orchestration Engine
 * 5 layers: Auto-Interpreter → AIL → DAG → Executor → Report
 */
import { AutoInterpreter, Intent } from './auto-interpreter';
import { AILCompiler, CompressedAIL } from './ail-compiler';
import { DAGBuilder, ExecutionDAG } from './dag-builder';
import { Executor, TaskResult } from './executor';
import { ReportGenerator, ExecutionReport } from './report-generator';
export interface OrchestrationResult {
    intent: Intent;
    ail: CompressedAIL;
    dag: ExecutionDAG;
    results: TaskResult[];
    report: ExecutionReport;
}
export declare function orchestrate(userInput: string): Promise<OrchestrationResult>;
export { AutoInterpreter, Intent, AILCompiler, CompressedAIL, DAGBuilder, ExecutionDAG, Executor, TaskResult, ReportGenerator, ExecutionReport, };
//# sourceMappingURL=index.d.ts.map