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

export async function orchestrate(
  userInput: string
): Promise<OrchestrationResult> {
  const interpreter = new AutoInterpreter();
  const intent = interpreter.parse(userInput);

  const compiler = new AILCompiler();
  const ail = compiler.compile(intent);

  const builder = new DAGBuilder();
  const dag = builder.build(ail);

  const executor = new Executor();
  const results = await executor.execute(dag);

  const generator = new ReportGenerator();
  const report = generator.generate(dag, results, intent.action, intent.target);

  return { intent, ail, dag, results, report };
}

export {
  AutoInterpreter,
  Intent,
  AILCompiler,
  CompressedAIL,
  DAGBuilder,
  ExecutionDAG,
  Executor,
  TaskResult,
  ReportGenerator,
  ExecutionReport,
};
