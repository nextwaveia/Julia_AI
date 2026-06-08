/**
 * Layer 3: DAG Builder
 * Automatically detects task dependencies and parallelizable tasks
 */

import { z } from 'zod';
import { CompressedAIL } from './ail-compiler';

export const TaskSchema = z.object({
  id: z.string(),
  agent: z.string(),
  dependencies: z.array(z.string()),
});

export const ExecutionDAGSchema = z.object({
  tasks: z.array(TaskSchema),
  executionOrder: z.string(),
  parallelismFactor: z.number(),
  criticalPath: z.array(z.string()),
});

export type Task = z.infer<typeof TaskSchema>;
export type ExecutionDAG = z.infer<typeof ExecutionDAGSchema>;

export class DAGBuilder {
  build(ail: CompressedAIL): ExecutionDAG {
    const agents = ail.agents;
    const tasks: Task[] = agents.map((agent, idx) => ({
      id: `T${idx + 1}`,
      agent,
      dependencies: idx === 0 ? [] : [agents[0]],
    }));

    const techLeadIdx = agents.findIndex((a) =>
      a.toLowerCase().includes('tech')
    );
    const backendIdx = agents.findIndex((a) =>
      a.toLowerCase().includes('backend')
    );
    const frontendIdx = agents.findIndex((a) =>
      a.toLowerCase().includes('frontend')
    );
    const qaIdx = agents.findIndex((a) => a.toLowerCase().includes('qa'));

    if (
      techLeadIdx >= 0 &&
      backendIdx >= 0 &&
      frontendIdx >= 0 &&
      qaIdx >= 0
    ) {
      tasks[backendIdx].dependencies = [tasks[techLeadIdx].id];
      tasks[frontendIdx].dependencies = [tasks[techLeadIdx].id];
      tasks[qaIdx].dependencies = [
        tasks[backendIdx].id,
        tasks[frontendIdx].id,
      ];
    }

    const criticalPath = this.computeCriticalPath(tasks);
    const parallelismFactor =
      agents.length / Math.max(criticalPath.length, 1) || 1;

    const executionOrder = this.formatExecutionOrder(tasks);

    return {
      tasks,
      executionOrder,
      parallelismFactor: Math.min(parallelismFactor, 3),
      criticalPath,
    };
  }

  private computeCriticalPath(tasks: Task[]): string[] {
    const processed: Set<string> = new Set();
    const path: string[] = [];

    const findPath = (taskId: string): string[] => {
      if (processed.has(taskId)) return [];
      processed.add(taskId);

      const task = tasks.find((t) => t.id === taskId);
      if (!task || task.dependencies.length === 0) {
        return [taskId];
      }

      const longestDep = task.dependencies
        .map((dep) => findPath(dep))
        .sort((a, b) => b.length - a.length)[0];

      return [...longestDep, taskId];
    };

    tasks.forEach((task) => {
      const currentPath = findPath(task.id);
      if (currentPath.length > path.length) {
        path.length = 0;
        path.push(...currentPath);
      }
    });

    return path;
  }

  private formatExecutionOrder(tasks: Task[]): string {
    const levels: Set<string>[] = [];

    tasks.forEach((task) => {
      let level = 0;
      if (task.dependencies.length > 0) {
        level =
          Math.max(
            ...task.dependencies.map((dep) => {
              const depTask = tasks.find((t) => t.id === dep);
              return depTask
                ? levels.findIndex((l) => l.has(depTask.id))
                : 0;
            })
          ) + 1;
      }

      if (!levels[level]) levels[level] = new Set();
      levels[level].add(task.id);
    });

    return levels
      .map((l) => {
        const taskIds = Array.from(l);
        return taskIds.length > 1 ? `(${taskIds.join(' ∥ ')})` : taskIds[0];
      })
      .join(' → ');
  }
}
