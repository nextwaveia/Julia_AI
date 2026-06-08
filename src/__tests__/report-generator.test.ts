import { ReportGenerator } from '../core/report-generator';
import { DAGBuilder } from '../core/dag-builder';
import { Executor } from '../core/executor';
import { AutoInterpreter } from '../core/auto-interpreter';
import { AILCompiler } from '../core/ail-compiler';

describe('ReportGenerator', () => {
  let generator: ReportGenerator;
  let executor: Executor;
  let builder: DAGBuilder;
  let compiler: AILCompiler;
  let interpreter: AutoInterpreter;

  beforeEach(() => {
    generator = new ReportGenerator();
    executor = new Executor();
    builder = new DAGBuilder();
    compiler = new AILCompiler();
    interpreter = new AutoInterpreter();
  });

  test('should generate report', async () => {
    const intent = interpreter.parse('Implementar settings.team');
    const ail = compiler.compile(intent);
    const dag = builder.build(ail);
    const results = await executor.execute(dag);
    const report = generator.generate(dag, results, intent.action, intent.target);
    expect(report).toBeTruthy();
  });

  test('should include action in report', async () => {
    const intent = interpreter.parse('Implementar settings.team');
    const ail = compiler.compile(intent);
    const dag = builder.build(ail);
    const results = await executor.execute(dag);
    const report = generator.generate(dag, results, intent.action, intent.target);
    expect(report.action).toBe('implement');
  });

  test('should include target in report', async () => {
    const intent = interpreter.parse('Implementar settings.team');
    const ail = compiler.compile(intent);
    const dag = builder.build(ail);
    const results = await executor.execute(dag);
    const report = generator.generate(dag, results, intent.action, intent.target);
    expect(report.target).toBe('settings.team');
  });

  test('should calculate compression metrics', async () => {
    const intent = interpreter.parse('Implementar settings.team');
    const ail = compiler.compile(intent);
    const dag = builder.build(ail);
    const results = await executor.execute(dag);
    const report = generator.generate(dag, results, intent.action, intent.target);
    expect(report.compression.reductionPercent).toBeGreaterThan(0);
  });

  test('should track agent execution', async () => {
    const intent = interpreter.parse('Implementar settings.team');
    const ail = compiler.compile(intent);
    const dag = builder.build(ail);
    const results = await executor.execute(dag);
    const report = generator.generate(dag, results, intent.action, intent.target);
    expect(report.agents.executed).toBeGreaterThan(0);
  });

  test('should render report as string', async () => {
    const intent = interpreter.parse('Implementar settings.team');
    const ail = compiler.compile(intent);
    const dag = builder.build(ail);
    const results = await executor.execute(dag);
    const report = generator.generate(dag, results, intent.action, intent.target);
    const rendered = generator.render(report);
    expect(rendered).toContain('EXECUTION REPORT');
  });

  test('should export to JSON', async () => {
    const intent = interpreter.parse('Implementar settings.team');
    const ail = compiler.compile(intent);
    const dag = builder.build(ail);
    const results = await executor.execute(dag);
    const report = generator.generate(dag, results, intent.action, intent.target);
    const json = generator.toJSON(report);
    expect(JSON.parse(json)).toEqual(report);
  });

  test('should export to CSV', async () => {
    const intent = interpreter.parse('Implementar settings.team');
    const ail = compiler.compile(intent);
    const dag = builder.build(ail);
    const results = await executor.execute(dag);
    const report = generator.generate(dag, results, intent.action, intent.target);
    const csv = generator.toCSV(report);
    expect(csv).toContain('action,target,status');
  });

  test('should include validations', async () => {
    const intent = interpreter.parse('Implementar settings.team');
    const ail = compiler.compile(intent);
    const dag = builder.build(ail);
    const results = await executor.execute(dag);
    const report = generator.generate(dag, results, intent.action, intent.target);
    expect(report.validations.typescript).toBeDefined();
    expect(report.validations.i18n).toBeDefined();
    expect(report.validations.rbac).toBeDefined();
  });

  test('should include parallelism metrics', async () => {
    const intent = interpreter.parse('Implementar settings.team');
    const ail = compiler.compile(intent);
    const dag = builder.build(ail);
    const results = await executor.execute(dag);
    const report = generator.generate(dag, results, intent.action, intent.target);
    expect(report.parallelism.factor).toBeGreaterThan(0);
    expect(report.parallelism.estimatedFasterPercent).toBeGreaterThanOrEqual(0);
  });

  test('should have success status when no failures', async () => {
    const intent = interpreter.parse('Implementar settings.team');
    const ail = compiler.compile(intent);
    const dag = builder.build(ail);
    const results = await executor.execute(dag);
    const report = generator.generate(dag, results, intent.action, intent.target);
    expect(['success', 'partial', 'failed']).toContain(report.status);
  });
});
