/**
 * Layer 2: AIL Compiler
 * Compresses intent into Abstract Intent Language with 40% token reduction
 */
import { z } from 'zod';
import { Intent } from './auto-interpreter';
export declare const CompressedAILSchema: z.ZodObject<{
    act: z.ZodString;
    tgt: z.ZodString;
    pri: z.ZodString;
    reqs: z.ZodArray<z.ZodString, "many">;
    agents: z.ZodArray<z.ZodString, "many">;
    tokenCount: z.ZodNumber;
    yaml: z.ZodString;
}, "strip", z.ZodTypeAny, {
    act: string;
    tgt: string;
    pri: string;
    reqs: string[];
    agents: string[];
    tokenCount: number;
    yaml: string;
}, {
    act: string;
    tgt: string;
    pri: string;
    reqs: string[];
    agents: string[];
    tokenCount: number;
    yaml: string;
}>;
export type CompressedAIL = z.infer<typeof CompressedAILSchema>;
export declare class AILCompiler {
    compile(intent: Intent): CompressedAIL;
}
//# sourceMappingURL=ail-compiler.d.ts.map