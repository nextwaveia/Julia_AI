"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../core/index");
describe('E2E Scenarios', () => {
    test('Scenario 1: Implementar settings.team', async () => {
        const result = await (0, index_1.orchestrate)('Implementar settings.team');
        expect(result.intent.action).toBe('implement');
        expect(result.intent.target).toBe('settings.team');
        expect(result.dag.tasks.length).toBeGreaterThan(0);
        expect(result.report.status).toBe('success');
        expect(result.report.compression.reductionPercent).toBeGreaterThan(0);
    });
    test('Scenario 2: Refactor auth module', async () => {
        const result = await (0, index_1.orchestrate)('Refactor auth module');
        expect(result.intent.action).toBe('refactor');
        expect(result.intent.target).toBe('auth.module');
        expect(result.dag.parallelismFactor).toBeGreaterThanOrEqual(1);
        expect(result.results.length).toBe(result.dag.tasks.length);
    });
    test('Scenario 3: Audit RBAC settings', async () => {
        const result = await (0, index_1.orchestrate)('Audit RBAC settings');
        expect(result.intent.action).toBe('audit');
        expect(result.ail.pri).toBe('🔵');
        expect(result.report.agents.executed).toBeGreaterThan(0);
    });
    test('Scenario 4: Fix TypeScript errors', async () => {
        const result = await (0, index_1.orchestrate)('Fix TypeScript errors');
        expect(result.intent.action).toBe('fix');
        expect(result.report.validations.typescript).toBe(true);
        expect(result.report.parallelism.estimatedFasterPercent).toBeGreaterThanOrEqual(0);
    });
});
//# sourceMappingURL=e2e.test.js.map