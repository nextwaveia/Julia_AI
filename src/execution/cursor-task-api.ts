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

export class CursorTaskAPIClient {
  private baseUrl: string;
  private apiKey: string;
  private progressCallbacks: Map<string, (progress: TaskProgress) => void> = new Map();

  constructor(baseUrl: string = 'http://localhost:3000', apiKey: string = '') {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async submit(task: Omit<CursorTask, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<CursorTask> {
    const payload = {
      intent: task.intent,
      priority: task.priority,
      timestamp: Date.now(),
    };

    const response = await this.makeRequest(`/tasks`, 'POST', payload);
    const data = response as CursorTask;
    return { ...data, id: `task-${Date.now()}`, status: 'pending', createdAt: Date.now(), updatedAt: Date.now() };
  }

  async getResult(taskId: string): Promise<TaskResult> {
    const response = await this.makeRequest(`/tasks/${taskId}/result`, 'GET');
    return response as TaskResult;
  }

  onProgress(taskId: string, callback: (progress: TaskProgress) => void): void {
    this.progressCallbacks.set(taskId, callback);
    this.simulateProgress(taskId, callback);
  }

  private async simulateProgress(taskId: string, callback: (progress: TaskProgress) => void): Promise<void> {
    for (let i = 0; i <= 100; i += 20) {
      const progress: TaskProgress = {
        taskId,
        percent: i,
        currentAgent: `agent-${Math.floor(i / 25)}`,
        message: `Processing task ${i}%`,
      };
      callback(progress);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  async cancelTask(taskId: string): Promise<void> {
    await this.makeRequest(`/tasks/${taskId}/cancel`, 'POST', {});
  }

  private async makeRequest(endpoint: string, method: string = 'GET', body?: unknown): Promise<unknown> {
    // Simulated API call for testing
    return {
      success: true,
      data: body || {},
    };
  }
}

export class TaskQueueManager {
  private queue: CursorTask[] = [];
  private processing: Set<string> = new Set();
  private maxConcurrent: number = 10;

  constructor(maxConcurrent: number = 10) {
    this.maxConcurrent = maxConcurrent;
  }

  enqueue(task: CursorTask): void {
    this.queue.push(task);
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    while (this.queue.length > 0 && this.processing.size < this.maxConcurrent) {
      const task = this.queue.shift();
      if (task) {
        this.processing.add(task.id);
        await new Promise((resolve) => setTimeout(resolve, 100));
        this.processing.delete(task.id);
      }
    }
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  getProcessingCount(): number {
    return this.processing.size;
  }
}
