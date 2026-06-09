/**
 * Code Injector - Injects generated code into files
 */

import * as fs from 'fs';
import * as path from 'path';

export interface InjectionTarget {
  filepath: string;
  position?: 'start' | 'end' | 'before' | 'after';
  marker?: string;
}

export interface InjectionResult {
  filepath: string;
  success: boolean;
  linesAdded: number;
  error?: string;
}

export class CodeInjector {
  async injectCode(
    code: string,
    target: InjectionTarget,
    backup: boolean = true
  ): Promise<InjectionResult> {
    try {
      // Create backup if requested
      if (backup) {
        const backupPath = `${target.filepath}.backup`;
        if (fs.existsSync(target.filepath)) {
          fs.copyFileSync(target.filepath, backupPath);
        }
      }

      // Read existing file
      let content = '';
      if (fs.existsSync(target.filepath)) {
        content = fs.readFileSync(target.filepath, 'utf-8');
      }

      // Determine injection point
      const injectedContent = this.injectAtPosition(
        content,
        code,
        target.position || 'end',
        target.marker
      );

      // Write back
      const dir = path.dirname(target.filepath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(target.filepath, injectedContent, 'utf-8');

      const linesAdded = code.split('\n').length;
      return {
        filepath: target.filepath,
        success: true,
        linesAdded,
      };
    } catch (error) {
      return {
        filepath: target.filepath,
        success: false,
        linesAdded: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private injectAtPosition(
    content: string,
    code: string,
    position: string,
    marker?: string
  ): string {
    switch (position) {
      case 'start':
        return `${code}\n\n${content}`;

      case 'end':
        return `${content}\n\n${code}`;

      case 'before':
      case 'after':
        if (!marker) throw new Error('Marker required for before/after injection');
        const lines = content.split('\n');
        const markerIndex = lines.findIndex((line) => line.includes(marker));

        if (markerIndex === -1) {
          throw new Error(`Marker not found: ${marker}`);
        }

        const codeLines = code.split('\n');
        const insertIndex = position === 'before' ? markerIndex : markerIndex + 1;
        lines.splice(insertIndex, 0, ...codeLines);
        return lines.join('\n');

      default:
        throw new Error(`Unknown position: ${position}`);
    }
  }

  async injectMultiple(
    injections: Array<{ code: string; target: InjectionTarget }>
  ): Promise<InjectionResult[]> {
    return Promise.all(injections.map((inj) => this.injectCode(inj.code, inj.target)));
  }

  async createFile(filepath: string, code: string): Promise<InjectionResult> {
    return this.injectCode(code, { filepath, position: 'start' }, false);
  }
}

export class ProjectStructureManager {
  private injector: CodeInjector;

  constructor() {
    this.injector = new CodeInjector();
  }

  async createProjectFiles(
    rootDir: string,
    files: Array<{ path: string; content: string }>
  ): Promise<InjectionResult[]> {
    return Promise.all(
      files.map((file) =>
        this.injector.createFile(path.join(rootDir, file.path), file.content)
      )
    );
  }

  async updateFile(filepath: string, code: string, marker?: string): Promise<InjectionResult> {
    return this.injector.injectCode(code, {
      filepath,
      position: marker ? 'before' : 'end',
      marker,
    });
  }
}
