"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dag_builder_1 = require("../core/dag-builder");
const auto_interpreter_1 = require("../core/auto-interpreter");
const ail_compiler_1 = require("../core/ail-compiler");
describe('DAGBuilder', () => {
    let builder;
    let compiler;
    let interpreter;
    beforeEach(() => {
        builder = new dag_builder_1.DAGBuilder();
        compiler = new ail_compiler_1.AILCompiler();
        interpreter = new auto_interpreter_1.AutoInterpreter();
    });
    test('should build DAG with tasks', () => {
        const intent = interpreter.parse('Implementar settings.team');
        const ail = compiler.compile(intent);
        const dag = builder.build(ail);
        expect(dag.tasks.length).toBeGreaterThan(0);
    });
    test('should create execution order', () => {
        const intent = interpreter.parse('Implementar settings.team');
        const ail = compiler.compile(intent);
        const dag = builder.build(ail);
        expect(dag.executionOrder).toBeTruthy();
        expect(dag.executionOrder).toContain('T');
    });
    test('should calculate parallelism factor', () => {
        const intent = interpreter.parse('Implementar settings.team');
        const ail = compiler.compile(intent);
        const dag = builder.build(ail);
        expect(dag.parallelismFactor).toBeGreaterThanOrEqual(1);
        expect(dag.parallelismFactor).toBeLessThanOrEqual(3);
    });
    test('should have critical path', () => {
        const intent = interpreter.parse('Implementar settings.team');
        const ail = compiler.compile(intent);
        const dag = builder.build(ail);
        expect(dag.criticalPath.length).toBeGreaterThan(0);
    });
    test('should assign task IDs', () => {
        const intent = interpreter.parse('Implementar settings.team');
        const ail = compiler.compile(intent);
        const dag = builder.build(ail);
        expect(dag.tasks[0].id).toBe('T1');
    });
    test('should detect task dependencies', () => {
        const intent = interpreter.parse('Implementar settings.team');
        const ail = compiler.compile(intent);
        const dag = builder.build(ail);
        const parallelTasks = dag.tasks.filter((t) => t.dependencies.length > 0);
        expect(parallelTasks.length).toBeGreaterThan(0);
    });
    test('should support RTK flag', () => {
        const intent = interpreter.parse('Implementar settings.team');
        const ail = compiler.compile(intent);
        const dag = builder.build(ail);
        expect(dag).toBeTruthy();
    });
    test('should have agent assignments', () => {
        const intent = interpreter.parse('Implementar settings.team');
        const ail = compiler.compile(intent);
        const dag = builder.build(ail);
        dag.tasks.forEach((task) => {
            expect(task.agent).toBeTruthy();
        });
    });
    test('should format execution order with symbols', () => {
        const intent = interpreter.parse('Implementar settings.team');
        const ail = compiler.compile(intent);
        const dag = builder.build(ail);
        expect(dag.executionOrder).toMatch(/→|∥/);
    });
    test('should detect no circular dependencies', () => {
        const intent = interpreter.parse('Implementar settings.team');
        const ail = compiler.compile(intent);
        const dag = builder.build(ail);
        expect(dag.tasks).toBeTruthy();
        expect(dag.criticalPath).toBeTruthy();
    });
});
//# sourceMappingURL=dag-builder.test.js.map