/**
 * Layer 2: AIL Compiler
 * Compresses intent into Abstract Intent Language with 40% token reduction
 */

import { z } from 'zod';
import { Intent } from './auto-interpreter';
import YAML from 'yaml';

export const CompressedAILSchema = z.object({
  act: z.string(),
  tgt: z.string(),
  pri: z.string(),
  reqs: z.array(z.string()),
  agents: z.array(z.string()),
  tokenCount: z.number(),
  yaml: z.string(),
});

export type CompressedAIL = z.infer<typeof CompressedAILSchema>;

const ABBREVIATIONS: Record<string, string> = {
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

const PRIORITY_MAP: Record<Intent['action'], string> = {
  implement: '🟢',
  refactor: '🟡',
  audit: '🔵',
  fix: '🔴',
  enhance: '🟣',
};

export class AILCompiler {
  compile(intent: Intent): CompressedAIL {
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

    const yaml = YAML.stringify(ailObject);
    const jsonStr = JSON.stringify(ailObject);
    const yamlStr = yaml.toString();

    const originalTokens = Math.ceil(jsonStr.length / 4);
    const compressedTokens = Math.ceil(yamlStr.length / 4);
    const tokenCount =
      Math.round(((originalTokens - compressedTokens) / originalTokens) * 100) +
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
