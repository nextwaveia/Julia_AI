"use strict";
/**
 * Input Validation and Safety Checks
 * Validates all inputs before orchestration begins
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputValidator = exports.InputValidator = void 0;
class InputValidator {
    constructor() {
        this.rules = [];
        this.registerDefaultRules();
    }
    registerDefaultRules() {
        this.addRule({
            name: 'non-empty-input',
            validate: (input) => typeof input === 'string' && input.trim().length > 0,
            message: 'Input cannot be empty',
        });
        this.addRule({
            name: 'max-length-input',
            validate: (input) => typeof input === 'string' && input.length <= 1000,
            message: 'Input too long (max 1000 chars)',
        });
        this.addRule({
            name: 'no-sql-injection',
            validate: (input) => {
                if (typeof input !== 'string')
                    return true;
                return !/(DROP|DELETE|INSERT|UPDATE|SELECT)\s+(TABLE|DATABASE|FROM)/i.test(input);
            },
            message: 'Potentially malicious input detected',
        });
    }
    addRule(rule) {
        this.rules.push(rule);
    }
    validate(input) {
        const errors = [];
        for (const rule of this.rules) {
            try {
                if (!rule.validate(input)) {
                    errors.push(`[${rule.name}] ${rule.message}`);
                }
            }
            catch (error) {
                errors.push(`[${rule.name}] Validation error: ${error instanceof Error ? error.message : 'unknown'}`);
            }
        }
        return {
            valid: errors.length === 0,
            errors,
        };
    }
}
exports.InputValidator = InputValidator;
class OutputValidator {
    validateCompressionMetrics(inputTokens, outputTokens) {
        return outputTokens < inputTokens && outputTokens > 0;
    }
    validateParallelismFactor(factor) {
        return factor >= 1 && factor <= 10;
    }
    validateTaskCount(count) {
        return count > 0 && count <= 100;
    }
    validateExecutionStatus(status) {
        return ['success', 'partial', 'failed'].includes(status);
    }
}
exports.OutputValidator = OutputValidator;
//# sourceMappingURL=validators.js.map