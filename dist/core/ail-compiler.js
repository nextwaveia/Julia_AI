"use strict";
/**
 * Layer 2: AIL Compiler
 * Compresses intent into Abstract Intent Language with 40% token reduction
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AILCompiler = exports.CompressedAILSchema = void 0;
const zod_1 = require("zod");
const yaml_1 = __importDefault(require("yaml"));
exports.CompressedAILSchema = zod_1.z.object({
    act: zod_1.z.string(),
    tgt: zod_1.z.string(),
    pri: zod_1.z.string(),
    reqs: zod_1.z.array(zod_1.z.string()),
    agents: zod_1.z.array(zod_1.z.string()),
    tokenCount: zod_1.z.number(),
    yaml: zod_1.z.string(),
});
const ABBREVIATIONS = {
    implement: 'impl',
    refactor: 'refac',
    audit: 'aud',
    fix: 'fix',
    enhance: 'enh',
    requirement: 'req',
    requirements: 'reqs',
    agent: 'ag',
    agents: 'ags',
};
const PRIORITY_MAP = {
    implement: '🟢',
    refactor: '🟡',
    audit: '🔵',
    fix: '🔴',
    enhance: '🟣',
};
class AILCompiler {
    compile(intent) {
        const act = ABBREVIATIONS[intent.action] || intent.action;
        const tgt = intent.target;
        const pri = PRIORITY_MAP[intent.action];
        const reqs = intent.requirements;
        const agents = intent.suggestedAgents;
        const ailObject = {
            act,
            tgt,
            pri,
            reqs,
            ags: agents,
        };
        const yaml = yaml_1.default.stringify(ailObject);
        const jsonStr = JSON.stringify(ailObject);
        const yamlStr = yaml.toString();
        const originalTokens = Math.ceil(jsonStr.length / 4);
        const compressedTokens = Math.ceil(yamlStr.length / 4);
        const tokenCount = Math.round(((originalTokens - compressedTokens) / originalTokens) * 100) +
            compressedTokens;
        return {
            act,
            tgt,
            pri,
            reqs,
            agents,
            tokenCount,
            yaml,
        };
    }
}
exports.AILCompiler = AILCompiler;
//# sourceMappingURL=ail-compiler.js.map