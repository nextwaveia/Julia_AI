"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validators_1 = require("../core/validators");
describe('InputValidator', () => {
    let validator;
    beforeEach(() => {
        validator = new validators_1.InputValidator();
    });
    test('should pass valid input', () => {
        const result = validator.validate('Implementar settings.team');
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });
    test('should reject empty input', () => {
        const result = validator.validate('');
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
    });
    test('should reject whitespace only input', () => {
        const result = validator.validate('   ');
        expect(result.valid).toBe(false);
    });
    test('should reject too long input', () => {
        const longInput = 'a'.repeat(1001);
        const result = validator.validate(longInput);
        expect(result.valid).toBe(false);
    });
    test('should accept max length input', () => {
        const maxInput = 'a'.repeat(1000);
        const result = validator.validate(maxInput);
        expect(result.valid).toBe(true);
    });
    test('should detect SQL injection attempts', () => {
        const result = validator.validate('DROP TABLE users; --');
        expect(result.valid).toBe(false);
        expect(result.errors.some((e) => e.includes('malicious'))).toBe(true);
    });
    test('should pass simple valid input', () => {
        const result = validator.validate('Fix TypeScript errors');
        expect(result.valid).toBe(true);
    });
    test('should add custom validation rules', () => {
        validator.addRule({
            name: 'custom-rule',
            validate: (input) => typeof input === 'string' && input.includes('custom'),
            message: 'Input must contain custom',
        });
        const result = validator.validate('Implementar settings.team');
        expect(result.valid).toBe(false);
        expect(result.errors.some((e) => e.includes('custom'))).toBe(true);
    });
    test('should collect multiple validation errors', () => {
        const result = validator.validate('');
        expect(result.errors.length).toBeGreaterThan(0);
    });
    test('should handle injection attempts case-insensitive', () => {
        const result = validator.validate('delete from users');
        expect(result.valid).toBe(false);
    });
    test('should handle SELECT injection with FROM', () => {
        const result = validator.validate('SELECT FROM sensitive_data');
        expect(result.valid).toBe(false);
    });
});
describe('OutputValidator', () => {
    let validator;
    beforeEach(() => {
        validator = new validators_1.OutputValidator();
    });
    test('should validate compression metrics', () => {
        expect(validator.validateCompressionMetrics(1000, 150)).toBe(true);
        expect(validator.validateCompressionMetrics(150, 1000)).toBe(false);
    });
    test('should reject zero output tokens', () => {
        expect(validator.validateCompressionMetrics(1000, 0)).toBe(false);
    });
    test('should validate parallelism factor', () => {
        expect(validator.validateParallelismFactor(1)).toBe(true);
        expect(validator.validateParallelismFactor(3)).toBe(true);
        expect(validator.validateParallelismFactor(0)).toBe(false);
        expect(validator.validateParallelismFactor(11)).toBe(false);
    });
    test('should validate task count', () => {
        expect(validator.validateTaskCount(1)).toBe(true);
        expect(validator.validateTaskCount(50)).toBe(true);
        expect(validator.validateTaskCount(0)).toBe(false);
        expect(validator.validateTaskCount(101)).toBe(false);
    });
    test('should validate execution status', () => {
        expect(validator.validateExecutionStatus('success')).toBe(true);
        expect(validator.validateExecutionStatus('partial')).toBe(true);
        expect(validator.validateExecutionStatus('failed')).toBe(true);
        expect(validator.validateExecutionStatus('unknown')).toBe(false);
    });
});
//# sourceMappingURL=validators.test.js.map