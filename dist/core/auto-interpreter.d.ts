/**
 * Layer 1: Auto-Interpreter
 * Parses natural language intent and extracts action, target, and confidence
 */
import { z } from 'zod';
export declare const IntentSchema: z.ZodObject<{
    action: z.ZodEnum<["implement", "refactor", "audit", "fix", "enhance"]>;
    target: z.ZodString;
    confidence: z.ZodNumber;
    suggestedAgents: z.ZodArray<z.ZodString, "many">;
    requirements: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    action: "implement" | "refactor" | "audit" | "fix" | "enhance";
    target: string;
    confidence: number;
    suggestedAgents: string[];
    requirements: string[];
}, {
    action: "implement" | "refactor" | "audit" | "fix" | "enhance";
    target: string;
    confidence: number;
    suggestedAgents: string[];
    requirements: string[];
}>;
export type Intent = z.infer<typeof IntentSchema>;
export declare class AutoInterpreter {
    private moduleRegistry;
    constructor();
    private registerDefaultModules;
    registerModule(target: string, agents: string[], requirements: string[]): void;
    parse(userInput: string): Intent;
}
//# sourceMappingURL=auto-interpreter.d.ts.map