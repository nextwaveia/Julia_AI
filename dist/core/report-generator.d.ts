/**
 * Layer 5: Report Generator
 * Synthesizes results into error-focused, stats-only reports
 */
import { z } from 'zod';
import { ExecutionDAG } from './dag-builder';
import { TaskResult } from './executor';
export declare const ExecutionReportSchema: z.ZodObject<{
    action: z.ZodString;
    target: z.ZodString;
    status: z.ZodEnum<["success", "partial", "failed"]>;
    agents: z.ZodObject<{
        executed: z.ZodNumber;
        failed: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        failed: number;
        executed: number;
    }, {
        failed: number;
        executed: number;
    }>;
    files: z.ZodObject<{
        modified: z.ZodNumber;
        created: z.ZodNumber;
        deleted: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        modified: number;
        created: number;
        deleted: number;
    }, {
        modified: number;
        created: number;
        deleted: number;
    }>;
    validations: z.ZodObject<{
        typescript: z.ZodBoolean;
        i18n: z.ZodBoolean;
        rbac: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        typescript: boolean;
        i18n: boolean;
        rbac: boolean;
    }, {
        typescript: boolean;
        i18n: boolean;
        rbac: boolean;
    }>;
    compression: z.ZodObject<{
        inputTokens: z.ZodNumber;
        outputTokens: z.ZodNumber;
        reductionPercent: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        inputTokens: number;
        outputTokens: number;
        reductionPercent: number;
    }, {
        inputTokens: number;
        outputTokens: number;
        reductionPercent: number;
    }>;
    parallelism: z.ZodObject<{
        factor: z.ZodNumber;
        estimatedFasterPercent: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        factor: number;
        estimatedFasterPercent: number;
    }, {
        factor: number;
        estimatedFasterPercent: number;
    }>;
}, "strip", z.ZodTypeAny, {
    action: string;
    status: "success" | "failed" | "partial";
    target: string;
    agents: {
        failed: number;
        executed: number;
    };
    compression: {
        inputTokens: number;
        outputTokens: number;
        reductionPercent: number;
    };
    files: {
        modified: number;
        created: number;
        deleted: number;
    };
    validations: {
        typescript: boolean;
        i18n: boolean;
        rbac: boolean;
    };
    parallelism: {
        factor: number;
        estimatedFasterPercent: number;
    };
}, {
    action: string;
    status: "success" | "failed" | "partial";
    target: string;
    agents: {
        failed: number;
        executed: number;
    };
    compression: {
        inputTokens: number;
        outputTokens: number;
        reductionPercent: number;
    };
    files: {
        modified: number;
        created: number;
        deleted: number;
    };
    validations: {
        typescript: boolean;
        i18n: boolean;
        rbac: boolean;
    };
    parallelism: {
        factor: number;
        estimatedFasterPercent: number;
    };
}>;
export type ExecutionReport = z.infer<typeof ExecutionReportSchema>;
export declare class ReportGenerator {
    generate(dag: ExecutionDAG, results: TaskResult[], action: string, target: string): ExecutionReport;
    render(report: ExecutionReport): string;
    toJSON(report: ExecutionReport): string;
    toCSV(report: ExecutionReport): string;
}
//# sourceMappingURL=report-generator.d.ts.map