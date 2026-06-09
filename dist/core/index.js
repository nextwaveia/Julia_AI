"use strict";
/**
 * Julia 3.0 Core Orchestration Engine
 * 5 layers: Auto-Interpreter → AIL → DAG → Executor → Report
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportGenerator = exports.Executor = exports.DAGBuilder = exports.AILCompiler = exports.AutoInterpreter = void 0;
exports.orchestrate = orchestrate;
const auto_interpreter_1 = require("./auto-interpreter");
Object.defineProperty(exports, "AutoInterpreter", { enumerable: true, get: function () { return auto_interpreter_1.AutoInterpreter; } });
const ail_compiler_1 = require("./ail-compiler");
Object.defineProperty(exports, "AILCompiler", { enumerable: true, get: function () { return ail_compiler_1.AILCompiler; } });
const dag_builder_1 = require("./dag-builder");
Object.defineProperty(exports, "DAGBuilder", { enumerable: true, get: function () { return dag_builder_1.DAGBuilder; } });
const executor_1 = require("./executor");
Object.defineProperty(exports, "Executor", { enumerable: true, get: function () { return executor_1.Executor; } });
const report_generator_1 = require("./report-generator");
Object.defineProperty(exports, "ReportGenerator", { enumerable: true, get: function () { return report_generator_1.ReportGenerator; } });
async function orchestrate(userInput) {
    const interpreter = new auto_interpreter_1.AutoInterpreter();
    const intent = interpreter.parse(userInput);
    const compiler = new ail_compiler_1.AILCompiler();
    const ail = compiler.compile(intent);
    const builder = new dag_builder_1.DAGBuilder();
    const dag = builder.build(ail);
    const executor = new executor_1.Executor();
    const results = await executor.execute(dag);
    const generator = new report_generator_1.ReportGenerator();
    const report = generator.generate(dag, results, intent.action, intent.target);
    return { intent, ail, dag, results, report };
}
//# sourceMappingURL=index.js.map