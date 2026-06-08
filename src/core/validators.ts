/**
 * Input Validation and Safety Checks
 * Validates all inputs before orchestration begins
 */

export interface ValidationRule {
  name: string;
  validate: (input: unknown) => boolean;
  message: string;
}

export class InputValidator {
  private rules: ValidationRule[] = [];

  constructor() {
    this.registerDefaultRules();
  }

  private registerDefaultRules(): void {
    this.addRule({
      name: 'non-empty-input',
      validate: (input: unknown) =>
        typeof input === 'string' && input.trim().length > 0,
      message: 'Input cannot be empty',
    });

    this.addRule({
      name: 'max-length-input',
      validate: (input: unknown) =>
        typeof input === 'string' && input.length <= 1000,
      message: 'Input too long (max 1000 chars)',
    });

    this.addRule({
      name: 'no-sql-injection',
      validate: (input: unknown) => {
        if (typeof input !== 'string') return true;
        return !/(DROP|DELETE|INSERT|UPDATE|SELECT)\s+(TABLE|DATABASE|FROM)/i.test(
          input
        );
      },
      message: 'Potentially malicious input detected',
    });
  }

  addRule(rule: ValidationRule): void {
    this.rules.push(rule);
  }

  validate(input: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const rule of this.rules) {
      try {
        if (!rule.validate(input)) {
          errors.push(`[${rule.name}] ${rule.message}`);
        }
      } catch (error) {
        errors.push(
          `[${rule.name}] Validation error: ${error instanceof Error ? error.message : 'unknown'}`
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export class OutputValidator {
  validateCompressionMetrics(
    inputTokens: number,
    outputTokens: number
  ): boolean {
    return outputTokens < inputTokens && outputTokens > 0;
  }

  validateParallelismFactor(factor: number): boolean {
    return factor >= 1 && factor <= 10;
  }

  validateTaskCount(count: number): boolean {
    return count > 0 && count <= 100;
  }

  validateExecutionStatus(
    status: string
  ): status is 'success' | 'partial' | 'failed' {
    return ['success', 'partial', 'failed'].includes(status);
  }
}
