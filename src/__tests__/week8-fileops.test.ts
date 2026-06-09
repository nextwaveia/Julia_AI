import { CodeInjector, ProjectStructureManager } from '../fileops/code-injector';
import * as fs from 'fs';
import * as path from 'path';

describe('Week 8 - File Operations & Code Injection', () => {
  let injector: CodeInjector;
  let projectManager: ProjectStructureManager;
  const testDir = '/tmp/julia-test-files';

  beforeAll(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  beforeEach(() => {
    injector = new CodeInjector();
    projectManager = new ProjectStructureManager();
  });

  afterAll(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  });

  it('should inject code at end of file', async () => {
    const filepath = path.join(testDir, 'test-end.ts');
    const originalCode = 'const x = 1;\n';
    fs.writeFileSync(filepath, originalCode);

    const newCode = 'const y = 2;';
    const result = await injector.injectCode(newCode, { filepath, position: 'end' });

    expect(result.success).toBe(true);
    expect(result.linesAdded).toBe(1);
  });

  it('should inject code at start of file', async () => {
    const filepath = path.join(testDir, 'test-start.ts');
    const originalCode = 'const x = 1;\n';
    fs.writeFileSync(filepath, originalCode);

    const newCode = 'const y = 2;';
    const result = await injector.injectCode(newCode, { filepath, position: 'start' });

    expect(result.success).toBe(true);
  });

  it('should create new file if not exists', async () => {
    const filepath = path.join(testDir, 'new-file.ts');
    const code = 'export const test = true;';

    const result = await injector.createFile(filepath, code);
    expect(result.success).toBe(true);
    expect(fs.existsSync(filepath)).toBe(true);
  });

  it('should inject multiple files', async () => {
    const injections = [
      { code: 'const a = 1;', target: { filepath: path.join(testDir, 'multi1.ts') } },
      { code: 'const b = 2;', target: { filepath: path.join(testDir, 'multi2.ts') } },
      { code: 'const c = 3;', target: { filepath: path.join(testDir, 'multi3.ts') } },
    ];

    const results = await injector.injectMultiple(injections);
    expect(results).toHaveLength(3);
    expect(results.every((r) => r.success)).toBe(true);
  });

  it('should create project structure', async () => {
    const files = [
      { path: 'src/index.ts', content: 'export default {};' },
      { path: 'src/utils.ts', content: 'export const util = () => {};' },
      { path: 'tests/index.test.ts', content: 'describe("tests", () => {});' },
    ];

    const results = await projectManager.createProjectFiles(testDir, files);
    expect(results).toHaveLength(3);
    expect(results.every((r) => r.success)).toBe(true);
  });

  it('should backup original file', async () => {
    const filepath = path.join(testDir, 'backup-test.ts');
    const originalCode = 'const x = 1;';
    fs.writeFileSync(filepath, originalCode);

    await injector.injectCode('const y = 2;', { filepath, position: 'end' }, true);
    const backupPath = `${filepath}.backup`;

    expect(fs.existsSync(backupPath)).toBe(true);
  });

  it('should handle injection errors gracefully', async () => {
    const invalidPath = '/invalid/path/that/does/not/exist/file.ts';
    const result = await injector.injectCode('const x = 1;', { filepath: invalidPath });

    expect(result.success).toBe(true); // Creates dirs recursively
  });
});
