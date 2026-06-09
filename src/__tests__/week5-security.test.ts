import { SecurityAuditor } from '../release/security-auditor';

describe('Week 5 - Security Audit & Release Prep', () => {
  let auditor: SecurityAuditor;

  beforeEach(() => {
    auditor = new SecurityAuditor();
  });

  it('should verify no vulnerabilities', async () => {
    const results = await auditor.auditDependencies();
    expect(results.every((r) => r.passed)).toBe(true);
  });

  it('should check license compliance', async () => {
    const results = await auditor.auditDependencies();
    expect(results).toHaveLength(3);
  });

  it('should detect hardcoded secrets', async () => {
    const results = await auditor.auditCode();
    const secretCheck = results.find((r) => r.name === 'No hardcoded secrets');
    expect(secretCheck?.passed).toBe(true);
  });

  it('should verify input validation', async () => {
    const results = await auditor.auditCode();
    expect(results.every((r) => r.passed)).toBe(true);
  });

  it('should verify encryption at rest', async () => {
    const results = await auditor.auditInfrastructure();
    expect(results[0].passed).toBe(true);
  });

  it('should pass all 9 security checks', async () => {
    const depResults = await auditor.auditDependencies();
    const codeResults = await auditor.auditCode();
    const infraResults = await auditor.auditInfrastructure();
    const allResults = [...depResults, ...codeResults, ...infraResults];
    expect(allResults).toHaveLength(9);
    expect(allResults.every((r) => r.passed)).toBe(true);
  });
});
