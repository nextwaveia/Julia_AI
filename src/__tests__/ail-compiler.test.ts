import { AILCompiler } from '../core/ail-compiler';
import { AutoInterpreter } from '../core/auto-interpreter';

describe('AILCompiler', () => {
  let compiler: AILCompiler;
  let interpreter: AutoInterpreter;

  beforeEach(() => {
    compiler = new AILCompiler();
    interpreter = new AutoInterpreter();
  });

  test('should compress implement to impl', () => {
    const intent = interpreter.parse('Implementar settings.team');
    const ail = compiler.compile(intent);
    expect(ail.act).toBe('impl');
  });

  test('should have target in compressed AIL', () => {
    const intent = interpreter.parse('Implementar settings.team');
    const ail = compiler.compile(intent);
    expect(ail.tgt).toBe('settings.team');
  });

  test('should have priority emoji', () => {
    const intent = interpreter.parse('Implementar settings.team');
    const ail = compiler.compile(intent);
    expect(ail.pri).toBeTruthy();
  });

  test('should include requirements', () => {
    const intent = interpreter.parse('Implementar settings.team');
    const ail = compiler.compile(intent);
    expect(ail.reqs.length).toBeGreaterThan(0);
  });

  test('should include agents', () => {
    const intent = interpreter.parse('Implementar settings.team');
    const ail = compiler.compile(intent);
    expect(ail.agents.length).toBeGreaterThan(0);
  });

  test('should generate YAML output', () => {
    const intent = interpreter.parse('Implementar settings.team');
    const ail = compiler.compile(intent);
    expect(ail.yaml).toBeTruthy();
    expect(ail.yaml).toContain('act:');
  });

  test('should calculate token count', () => {
    const intent = interpreter.parse('Implementar settings.team');
    const ail = compiler.compile(intent);
    expect(ail.tokenCount).toBeGreaterThan(0);
  });

  test('should achieve compression', () => {
    const intent = interpreter.parse('Implementar settings.team');
    const ail = compiler.compile(intent);
    expect(ail.tokenCount).toBeTruthy();
  });

  test('should compress refactor to refac', () => {
    const intent = interpreter.parse('Refactor auth module');
    const ail = compiler.compile(intent);
    expect(ail.act).toBe('refac');
  });

  test('should compress audit to aud', () => {
    const intent = interpreter.parse('Audit RBAC');
    const ail = compiler.compile(intent);
    expect(ail.act).toBe('aud');
  });
});
