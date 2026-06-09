/**
 * Agent Orchestrator - Real Agent Execution
 * Manages 19 specialized agents and their skill execution
 */
export interface Agent {
    name: string;
    role: string;
    skills: string[];
    experience: number;
    availability: boolean;
}
export interface SkillExecution {
    agent: string;
    skill: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    result?: unknown;
    duration: number;
    tokensUsed: number;
}
export interface AgentPool {
    total: number;
    available: number;
    busy: number;
    agents: Agent[];
}
export declare class AgentOrchestrator {
    private agents;
    private skillExecutions;
    private executionQueue;
    constructor();
    private registerDefaultAgents;
    executeSkill(agent: string, skill: string): Promise<SkillExecution>;
    executeParallel(tasks: Array<{
        agent: string;
        skill: string;
    }>): Promise<SkillExecution[]>;
    getAvailableAgents(): Agent[];
    getAgentPool(): AgentPool;
    getExecutionStats(): {
        totalExecutions: number;
        averageTime: number;
        totalTokens: number;
        successRate: number;
    };
}
//# sourceMappingURL=agent-orchestrator.d.ts.map