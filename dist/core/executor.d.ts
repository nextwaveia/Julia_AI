/**
 * Layer 4: Executor
 * Executes tasks in parallel with RTK config injection
 */
import { z } from 'zod';
import { ExecutionDAG } from './dag-builder';
export declare const TaskResultSchema: z.ZodObject<{
    taskId: z.ZodString;
    agent: z.ZodString;
    status: z.ZodEnum<["success", "pending", "failed"]>;
    output: z.ZodString;
    duration: z.ZodNumber;
    filesModified: z.ZodArray<z.ZodString, "many">;
    tokensInput: z.ZodNumber;
    tokensOutput: z.ZodNumber;
    compression: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    status: "success" | "pending" | "failed";
    agent: string;
    taskId: string;
    output: string;
    duration: number;
    filesModified: string[];
    tokensInput: number;
    tokensOutput: number;
    compression: number;
}, {
    status: "success" | "pending" | "failed";
    agent: string;
    taskId: string;
    output: string;
    duration: number;
    filesModified: string[];
    tokensInput: number;
    tokensOutput: number;
    compression: number;
}>;
export type TaskResult = z.infer<typeof TaskResultSchema>;
export declare class Executor {
    execute(dag: ExecutionDAG): Promise<TaskResult[]>;
    private extractLevels;
}
//# sourceMappingURL=executor.d.ts.map