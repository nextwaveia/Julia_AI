/**
 * Layer 3: DAG Builder
 * Automatically detects task dependencies and parallelizable tasks
 */
import { z } from 'zod';
import { CompressedAIL } from './ail-compiler';
export declare const TaskSchema: z.ZodObject<{
    id: z.ZodString;
    agent: z.ZodString;
    dependencies: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    agent: string;
    id: string;
    dependencies: string[];
}, {
    agent: string;
    id: string;
    dependencies: string[];
}>;
export declare const ExecutionDAGSchema: z.ZodObject<{
    tasks: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        agent: z.ZodString;
        dependencies: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        agent: string;
        id: string;
        dependencies: string[];
    }, {
        agent: string;
        id: string;
        dependencies: string[];
    }>, "many">;
    executionOrder: z.ZodString;
    parallelismFactor: z.ZodNumber;
    criticalPath: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    tasks: {
        agent: string;
        id: string;
        dependencies: string[];
    }[];
    executionOrder: string;
    parallelismFactor: number;
    criticalPath: string[];
}, {
    tasks: {
        agent: string;
        id: string;
        dependencies: string[];
    }[];
    executionOrder: string;
    parallelismFactor: number;
    criticalPath: string[];
}>;
export type Task = z.infer<typeof TaskSchema>;
export type ExecutionDAG = z.infer<typeof ExecutionDAGSchema>;
export declare class DAGBuilder {
    build(ail: CompressedAIL): ExecutionDAG;
    private computeCriticalPath;
    private formatExecutionOrder;
}
//# sourceMappingURL=dag-builder.d.ts.map