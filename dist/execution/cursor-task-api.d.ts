/**
 * Cursor Task API Integration
 * Submits tasks to Cursor and retrieves results in real-time
 */
export interface CursorTask {
    id: string;
    intent: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'pending' | 'running' | 'completed' | 'failed';
    createdAt: number;
    updatedAt: number;
}
export interface TaskProgress {
    taskId: string;
    percent: number;
    currentAgent: string;
    message: string;
}
export interface TaskResult {
    taskId: string;
    success: boolean;
    output: string;
    agentExecutions: Array<{
        agent: string;
        duration: number;
        tokensUsed: number;
    }>;
    totalDuration: number;
    totalTokens: number;
}
export declare class CursorTaskAPIClient {
    private baseUrl;
    private apiKey;
    private progressCallbacks;
    constructor(baseUrl?: string, apiKey?: string);
    submit(task: Omit<CursorTask, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<CursorTask>;
    getResult(taskId: string): Promise<TaskResult>;
    onProgress(taskId: string, callback: (progress: TaskProgress) => void): void;
    private simulateProgress;
    cancelTask(taskId: string): Promise<void>;
    private makeRequest;
}
export declare class TaskQueueManager {
    private queue;
    private processing;
    private maxConcurrent;
    constructor(maxConcurrent?: number);
    enqueue(task: CursorTask): void;
    private processQueue;
    getQueueSize(): number;
    getProcessingCount(): number;
}
//# sourceMappingURL=cursor-task-api.d.ts.map