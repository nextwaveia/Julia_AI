/**
 * Code Generator - Full pipeline from intent to code
 */

import { LLMBridge, LLMConfig, CodeGenRequest, CodeGenResult } from './llm-bridge';
import { CodeInjector, InjectionTarget } from '../fileops/code-injector';

export interface GenerationPlan {
  intent: string;
  tasks: Array<{ name: string; description: string; file: string }>;
  language: string;
}

export interface GenerationOutput {
  results: CodeGenResult[];
  injections: Array<{ file: string; success: boolean; lines: number }>;
  totalTime: number;
}

export class CodeGenerator {
  private llmBridge: LLMBridge;
  private injector: CodeInjector;

  constructor(llmConfig: LLMConfig) {
    this.llmBridge = new LLMBridge(llmConfig);
    this.injector = new CodeInjector();
  }

  async generateFromPlan(plan: GenerationPlan): Promise<GenerationOutput> {
    const startTime = Date.now();

    // 1. Generate code for each task
    const requests: CodeGenRequest[] = plan.tasks.map((task) => ({
      intent: `${plan.intent}: ${task.name}`,
      language: plan.language as 'typescript' | 'python' | 'javascript' | 'go' | 'rust' | 'java',
      context: task.description,
    }));

    const results = await this.llmBridge.generateMultiple(requests);

    // 2. Inject code into files
    const injections = await Promise.all(
      results.map((result, i) =>
        this.injector.injectCode(result.code, {
          filepath: plan.tasks[i].file,
          position: 'end',
        })
      )
    );

    return {
      results,
      injections: injections.map((inj) => ({
        file: inj.filepath,
        success: inj.success,
        lines: inj.linesAdded,
      })),
      totalTime: Date.now() - startTime,
    };
  }

  async generateAndInject(
    intent: string,
    language: string,
    outputFile: string
  ): Promise<GenerationOutput> {
    const plan: GenerationPlan = {
      intent,
      language,
      tasks: [{ name: 'main', description: intent, file: outputFile }],
    };

    return this.generateFromPlan(plan);
  }
}
