import { Executor } from '../core/executor';
import { DAGBuilder } from '../core/dag-builder';
import { AutoInterpreter } from '../core/auto-interpreter';
import { AILCompiler } from '../core/ail-compiler';

describe('Executor', () => {
  let executor: Executor;
  let builder: DAGBuilder;
  let compiler: AILCompiler;
  let interpreter: AutoInterpreter;

  beforeEach(() => {
    executor = new Executor();
    builder = new DAGBuilder();
    compiler = new AILCompiler();
    interpreter = new AutoInterpreter();
  });

  test('should execute DAG tasks', async () => {
    const intent = interpreter.parse('Implementar settings.team');
    const ail = compiler.compile(intent);
    const dag = builder.build(ail);
    const results = await executor.execute(dag);
    expect(results.length).toBeGreaterThan(0);
  });

  test('should return task results with status', async () => {
    const intent = interpreter.parse('Implementar settings.team');
    const ail = compiler.compile(intent);
    const dag = builder.build(ail);
    const results = await executor.execute(dag);
    results.forEach((result) => {
      expect(['success', 'pending', 'failed']).toContain(result.status);
    });
  });

  test('should track execution duration', async () => {
    const intent = interpreter.parse('Implementar settings.team');
    const ail = compiler.compile(intent);
    const dag = builder.build(ail);
    const results = await executor.execute(dag);
    results.forEach((result) => {
      expect(result.duration).toBeGreaterThan(0);
    });
  });

  test('should track token compression', async () => {
    const intent = interpreter.parse('Implementar settings.team');
    const ail = compiler.compile(intent);
    const dag = builder.build(ail);
    const results = await executor.execute(dag);
    results.forEach((result) => {
      expect(result.compression).toBeGreaterThanOrEqual(0);
      expect(result.compression).toBeLessThanOrEqual(100);
    });
  });

  test('should track modified files', async () => {
    const intent = interpreter.parse('Implementar settings.team');
    const ail = compiler.compile(intent);
    const dag = builder.build(ail);
    const results = await executor.execute(dag);
    results.forEach((result) => {
      expect(result.filesModified).toBeTruthy();
    });
  });

  test('should execute all tasks', async () => {
    const intent = interpreter.parse('Implementar settings.team');
    const ail = compiler.compile(intent);
    const dag = builder.build(ail);
    const results = await executor.execute(dag);
    expect(results.length).toBe(dag.tasks.length);
  });

  test('should assign task IDs correctly', async () => {
    const intent = interpreter.parse('Implementar settings.team');
    const ail = compiler.compile(intent);
    const dag = builder.build(ail);
    const results = await executor.execute(dag);
    results.forEach((result) => {
      expect(result.taskId).toMatch(/^T\d+$/);
    });
  });

  test('should have input/output tokens', async () => {
    const intent = interpreter.parse('Implementar settings.team');
    const ail = compiler.compile(intent);
    const dag = builder.build(ail);
    const results = await executor.execute(dag);
    results.forEach((result) => {
      expect(result.tokensInput).toBeGreaterThan(0);
      expect(result.tokensOutput).toBeGreaterThan(0);
    });
  });

  test('should track agent assignments', async () => {
    const intent = interpreter.parse('Implementar settings.team');
    const ail = compiler.compile(intent);
    const dag = builder.build(ail);
    const results = await executor.execute(dag);
    results.forEach((result) => {
      expect(result.agent).toBeTruthy();
    });
  });
});
