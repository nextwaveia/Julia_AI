/**
 * Input Validation and Safety Checks
 * Validates all inputs before orchestration begins
 */
export interface ValidationRule {
    name: string;
    validate: (input: unknown) => boolean;
    message: string;
}
export declare class InputValidator {
    private rules;
    constructor();
    private registerDefaultRules;
    addRule(rule: ValidationRule): void;
    validate(input: string): {
        valid: boolean;
        errors: string[];
    };
}
export declare class OutputValidator {
    validateCompressionMetrics(inputTokens: number, outputTokens: number): boolean;
    validateParallelismFactor(factor: number): boolean;
    validateTaskCount(count: number): boolean;
    validateExecutionStatus(status: string): status is 'success' | 'partial' | 'failed';
}
//# sourceMappingURL=validators.d.ts.map