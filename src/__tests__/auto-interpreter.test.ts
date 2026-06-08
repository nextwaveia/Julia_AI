import { AutoInterpreter } from '../core/auto-interpreter';

describe('AutoInterpreter', () => {
  let interpreter: AutoInterpreter;

  beforeEach(() => {
    interpreter = new AutoInterpreter();
  });

  test('should parse implement action', () => {
    const intent = interpreter.parse('Implementar settings.team');
    expect(intent.action).toBe('implement');
    expect(intent.target).toBe('settings.team');
    expect(intent.confidence).toBeGreaterThan(0.5);
  });

  test('should parse refactor action', () => {
    const intent = interpreter.parse('Refactor auth module');
    expect(intent.action).toBe('refactor');
  });

  test('should parse audit action', () => {
    const intent = interpreter.parse('Audit RBAC settings');
    expect(intent.action).toBe('audit');
  });

  test('should parse fix action', () => {
    const intent = interpreter.parse('Fix TypeScript errors');
    expect(intent.action).toBe('fix');
  });

  test('should suggest agents for known modules', () => {
    const intent = interpreter.parse('Implementar settings.team');
    expect(intent.suggestedAgents).toContain('tech_lead');
    expect(intent.suggestedAgents).toContain('backend_senior');
  });

  test('should have requirements for known modules', () => {
    const intent = interpreter.parse('Implementar settings.team');
    expect(intent.requirements.length).toBeGreaterThan(0);
  });

  test('should register custom modules', () => {
    interpreter.registerModule('my.custom.feature', ['agent1', 'agent2'], [
      'req1',
    ]);
    const intent = interpreter.parse('Implementar my.custom.feature');
    expect(intent.target).toBe('my.custom.feature');
    expect(intent.suggestedAgents).toContain('agent1');
  });

  test('should have high confidence for known modules', () => {
    const intent = interpreter.parse('Implementar settings.team');
    expect(intent.confidence).toBeGreaterThan(0.7);
  });

  test('should extract target from unknown input', () => {
    const intent = interpreter.parse('Implementar some new feature');
    expect(intent.target).toBe('some.new.feature');
  });

  test('should have default agents for unknown targets', () => {
    const intent = interpreter.parse('Implementar unknown.target');
    expect(intent.suggestedAgents.length).toBeGreaterThan(0);
  });

  test('should have lower confidence for unknown modules', () => {
    const intent = interpreter.parse('Implementar completely.unknown.thing');
    expect(intent.confidence).toBeLessThan(1);
  });

  test('should parse enhance action', () => {
    const intent = interpreter.parse('Enhance performance');
    expect(intent.action).toBe('enhance');
  });

  test('should handle case insensitivity', () => {
    const intent1 = interpreter.parse('IMPLEMENTAR settings.team');
    const intent2 = interpreter.parse('Implementar settings.team');
    expect(intent1.action).toBe(intent2.action);
  });

  test('should have confidence between 0 and 1', () => {
    const intent = interpreter.parse('Implementar something');
    expect(intent.confidence).toBeGreaterThanOrEqual(0);
    expect(intent.confidence).toBeLessThanOrEqual(1);
  });

  test('should parse auth module correctly', () => {
    const intent = interpreter.parse('Fix auth.module issues');
    expect(intent.target).toBe('auth.module');
    expect(intent.suggestedAgents).toContain('security_specialist');
  });

  test('should parse API endpoints correctly', () => {
    const intent = interpreter.parse('Refactor api.endpoints');
    expect(intent.target).toBe('api.endpoints');
    expect(intent.action).toBe('refactor');
  });
});
