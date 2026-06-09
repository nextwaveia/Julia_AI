/**
 * LLM Executor - Real LLM Model Integration
 * Supports 6+ language models for agent execution
 */
export type LLMModel = 'claude-3.5-sonnet' | 'claude-3-opus' | 'gpt-4-turbo' | 'gemini-2' | 'llama-3.1' | 'mistral-large';
export interface LLMExecutionRequest {
    model: LLMModel;
    prompt: string;
    maxTokens?: number;
    temperature?: number;
    topP?: number;
}
export interface LLMExecutionResult {
    model: LLMModel;
    output: string;
    tokensUsed: number;
    executionTime: number;
    stopReason: 'end_turn' | 'max_tokens' | 'stop_sequence';
}
export interface ModelCapabilities {
    name: LLMModel;
    provider: string;
    maxTokens: number;
    speed: 'fast' | 'balanced' | 'quality';
    costPer1KTokens: number;
}
export declare class LLMExecutor {
    private models;
    private tokenCounts;
    private executionHistory;
    constructor();
    private registerModels;
    execute(request: LLMExecutionRequest): Promise<LLMExecutionResult>;
    selectBestModel(goal: 'speed' | 'quality' | 'cost'): LLMModel;
    executeWithFallback(request: LLMExecutionRequest, fallbackModels: LLMModel[]): Promise<LLMExecutionResult>;
    getTotalTokensUsed(model?: LLMModel): number;
    getExecutionStats(): {
        totalExecutions: number;
        averageTime: number;
        modelUsage: Record<LLMModel, number>;
    };
}
//# sourceMappingURL=llm-executor.d.ts.map