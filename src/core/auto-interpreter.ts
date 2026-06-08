/**
 * Layer 1: Auto-Interpreter
 * Parses natural language intent and extracts action, target, and confidence
 */

import { z } from 'zod';

export const IntentSchema = z.object({
  action: z.enum(['implement', 'refactor', 'audit', 'fix', 'enhance']),
  target: z.string(),
  confidence: z.number().min(0).max(1),
  suggestedAgents: z.array(z.string()),
  requirements: z.array(z.string()),
});

export type Intent = z.infer<typeof IntentSchema>;

export class AutoInterpreter {
  private moduleRegistry: Map<
    string,
    { agents: string[]; requirements: string[] }
  > = new Map();

  constructor() {
    this.registerDefaultModules();
  }

  private registerDefaultModules(): void {
    this.moduleRegistry.set('settings.team', {
      agents: ['tech_lead', 'backend_senior', 'frontend_senior', 'qa_engineer'],
      requirements: ['fix-resend-locale', 'impl-team-hub', 'add-rbac'],
    });

    this.moduleRegistry.set('auth.module', {
      agents: ['security_specialist', 'backend_senior'],
      requirements: ['validate-tokens', 'refresh-flow', 'logout-flow'],
    });

    this.moduleRegistry.set('api.endpoints', {
      agents: ['backend_senior', 'devops_engineer'],
      requirements: ['rate-limiting', 'error-handling', 'monitoring'],
    });
  }

  registerModule(
    target: string,
    agents: string[],
    requirements: string[]
  ): void {
    this.moduleRegistry.set(target, { agents, requirements });
  }

  parse(userInput: string): Intent {
    const lowerInput = userInput.toLowerCase();

    let action: Intent['action'] = 'implement';
    if (lowerInput.includes('refactor')) action = 'refactor';
    else if (lowerInput.includes('audit')) action = 'audit';
    else if (lowerInput.includes('fix')) action = 'fix';
    else if (lowerInput.includes('enhance')) action = 'enhance';

    let target = '';
    const moduleNames = Array.from(this.moduleRegistry.keys());
    for (const moduleName of moduleNames) {
      if (lowerInput.includes(moduleName)) {
        target = moduleName;
        break;
      }
    }

    if (!target) {
      const words = userInput.split(/\s+/);
      target = words.slice(1).join('.');
    }

    const moduleInfo = this.moduleRegistry.get(target) || {
      agents: ['general_engineer'],
      requirements: [],
    };

    const confidence = target.length > 0 ? 0.85 : 0.5;

    return {
      action,
      target,
      confidence,
      suggestedAgents: moduleInfo.agents,
      requirements: moduleInfo.requirements,
    };
  }
}
