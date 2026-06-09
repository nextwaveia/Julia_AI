import { LLMBridge, CodeGenRequest } from '../codegen/llm-bridge';
import { CodeGenerator } from '../codegen/code-generator';

describe('Week 7 - Code Generation from LLM', () => {
  let llmBridge: LLMBridge;
  let codeGen: CodeGenerator;

  beforeEach(() => {
    llmBridge = new LLMBridge({
      provider: 'openrouter',
      apiKey: 'test-key',
      model: 'claude-3.5-sonnet',
    });
    codeGen = new CodeGenerator({
      provider: 'openrouter',
      apiKey: 'test-key',
      model: 'claude-3.5-sonnet',
    });
  });

  it('should generate TypeScript code from intent', async () => {
    const request: CodeGenRequest = {
      intent: 'Create a user authentication function',
      language: 'typescript',
      context: 'Production-ready auth',
    };

    const result = await llmBridge.generateCode(request);
    expect(result.code).toBeDefined();
    expect(result.language).toBe('typescript');
    expect(result.filename).toBeDefined();
  });

  it('should generate code for multiple tasks', async () => {
    const requests: CodeGenRequest[] = [
      { intent: 'User service', language: 'typescript' },
      { intent: 'Auth middleware', language: 'typescript' },
      { intent: 'Error handler', language: 'typescript' },
    ];

    const results = await llmBridge.generateMultiple(requests);
    expect(results).toHaveLength(3);
    expect(results.every((r) => r.code)).toBe(true);
  });

  it('should support multiple languages', async () => {
    const languages: Array<'python' | 'javascript' | 'go'> = ['python', 'javascript', 'go'];

    for (const lang of languages) {
      const request: CodeGenRequest = {
        intent: 'Simple function',
        language: lang,
      };
      const result = await llmBridge.generateCode(request);
      expect(result.language).toBe(lang);
    }
  });

  it('should parse LLM response correctly', async () => {
    const request: CodeGenRequest = {
      intent: 'Create validator',
      language: 'typescript',
    };

    const result = await llmBridge.generateCode(request);
    expect(result.code).toBeDefined();
    expect(result.filename).toBeDefined();
    expect(result.explanation).toBeDefined();
  });

  it('should orchestrate code generation from plan', async () => {
    const plan = {
      intent: 'Build API',
      language: 'typescript',
      tasks: [
        { name: 'routes', description: 'API routes', file: 'routes.ts' },
        { name: 'controllers', description: 'Controllers', file: 'controllers.ts' },
      ],
    };

    const output = await codeGen.generateFromPlan(plan);
    expect(output.results).toHaveLength(2);
    expect(output.totalTime).toBeGreaterThan(0);
  });

  it('should generate and inject code', async () => {
    const output = await codeGen.generateAndInject(
      'Create utility function',
      'typescript',
      'utils.ts'
    );

    expect(output.results).toHaveLength(1);
    expect(output.injections).toHaveLength(1);
  });
});
