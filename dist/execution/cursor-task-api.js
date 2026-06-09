"use strict";
/**
 * Cursor Task API Integration
 * Submits tasks to Cursor and retrieves results in real-time
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskQueueManager = exports.CursorTaskAPIClient = void 0;
class CursorTaskAPIClient {
    constructor(baseUrl = 'http://localhost:3000', apiKey = '') {
        this.progressCallbacks = new Map();
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
    }
    async submit(task) {
        const payload = {
            intent: task.intent,
            priority: task.priority,
            timestamp: Date.now(),
        };
        const response = await this.makeRequest(`/tasks`, 'POST', payload);
        const data = response;
        return { ...data, id: `task-${Date.now()}`, status: 'pending', createdAt: Date.now(), updatedAt: Date.now() };
    }
    async getResult(taskId) {
        const response = await this.makeRequest(`/tasks/${taskId}/result`, 'GET');
        return response;
    }
    onProgress(taskId, callback) {
        this.progressCallbacks.set(taskId, callback);
        this.simulateProgress(taskId, callback);
    }
    async simulateProgress(taskId, callback) {
        for (let i = 0; i <= 100; i += 20) {
            const progress = {
                taskId,
                percent: i,
                currentAgent: `agent-${Math.floor(i / 25)}`,
                message: `Processing task ${i}%`,
            };
            callback(progress);
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    }
    async cancelTask(taskId) {
        await this.makeRequest(`/tasks/${taskId}/cancel`, 'POST', {});
    }
    async makeRequest(endpoint, _method, body) {
        // Simulated API call for testing
        return {
            success: true,
            data: body || {},
        };
    }
}
exports.CursorTaskAPIClient = CursorTaskAPIClient;
class TaskQueueManager {
    constructor(maxConcurrent = 10) {
        this.queue = [];
        this.processing = new Set();
        this.maxConcurrent = 10;
        this.maxConcurrent = maxConcurrent;
    }
    enqueue(task) {
        this.queue.push(task);
        this.processQueue();
    }
    async processQueue() {
        while (this.queue.length > 0 && this.processing.size < this.maxConcurrent) {
            const task = this.queue.shift();
            if (task) {
                this.processing.add(task.id);
                await new Promise((resolve) => setTimeout(resolve, 100));
                this.processing.delete(task.id);
            }
        }
    }
    getQueueSize() {
        return this.queue.length;
    }
    getProcessingCount() {
        return this.processing.size;
    }
}
exports.TaskQueueManager = TaskQueueManager;
//# sourceMappingURL=cursor-task-api.js.map