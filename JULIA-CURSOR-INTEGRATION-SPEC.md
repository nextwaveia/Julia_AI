# SPEC: Julia 3.0 + Cursor Task API Integration

**Data:** 2026-06-09  
**Status:** Design Phase  
**Objetivo:** Integrar Cursor Task API real com Julia para paralelização de tasks  

---

## 1. VISÃO GERAL

Julia 3.0 tem `CursorTaskAPIClient` (simulado) que precisa ser integrado com a **API real do Cursor** para:

- ✅ Submeter tasks em paralelo
- ✅ Monitorar progresso em tempo real
- ✅ Medir economia real de tokens
- ✅ Coordenar múltiplos agentes

---

## 2. ECONOMIA ESPERADA

### Cenário: Implementar `settings.team`

**Sem Cursor parallelization (atual):**
```
1 agent × 1 task = 1 sequencial
Time: ~30s per task
Tokens: 2,500 tokens por task
Total: 7,500 tokens para 3 tasks
```

**Com Cursor parallelization (proposto):**
```
3 agentes × 3 tasks = paralelo
Time: ~30s total (tudo simultâneo!)
Tokens: 2,500 tokens × 3 = 7,500 tokens
      - RTK compression (60%): -4,500 tokens
      - DAG parallelism (dedup): -1,000 tokens
      ______________________________
      Total efetivo: 2,000 tokens
      
Economia: 73% redução de tokens! 🎉
```

---

## 3. ARQUITETURA

### Integração com Cursor

```
Julia Orchestrator
    ↓
    ├─ Parse Intent
    ├─ Generate DAG (3 tarefas paralelas)
    ├─ Call Cursor Task API ← NEW!
    │   ├─ Task 1: Backend (tech_lead + backend_senior)
    │   ├─ Task 2: Frontend (frontend_senior + qa_engineer)
    │   └─ Task 3: Tests (qa_engineer + security_specialist)
    │
    ├─ Monitor Progress (real-time)
    ├─ Apply RTK compression
    └─ Generate Report

Result: Código pronto em arquivos!
```

### Classes Principais

```typescript
// src/integration/cursor-bridge.ts
class CursorBridge {
  async submitTasksToCursor(tasks: Task[]): Promise<TaskResult[]>
  async monitorProgress(taskIds: string[]): void
  async retrieveResults(taskId: string): Promise<string>
  async parallelizeExecution(dag: DAG): Promise<ExecutionResult>
}

// src/integration/cursor-metrics.ts
class CursorMetrics {
  trackTokenUsage(taskId: string): number
  measureCompressionRatio(): number
  calculateParallelismFactor(): number
  reportEconomy(): EconomyReport
}
```

---

## 4. FLUXO DE EXECUÇÃO

### Fase 1: Cursor Integration
```
User: /julia implement settings.team PARALELO:

✅ Julia Parse Intent
   └─ intent: "Implement settings.team"

✅ Julia Generate DAG
   └─ tasks: [backend, frontend, tests]
   └─ parallelism: 3

✅ Cursor API Call (NEW!)
   ├─ POST /api/tasks
   │  ├─ task_1: {intent, agents: [tech_lead, backend_senior]}
   │  ├─ task_2: {intent, agents: [frontend_senior, qa_engineer]}
   │  └─ task_3: {intent, agents: [qa_engineer, security]}
   │
   └─ Response: {task_ids: [1, 2, 3]}

✅ Monitor Progress (real-time)
   ├─ Task 1: 0% → 50% → 100% ✅
   ├─ Task 2: 0% → 30% → 100% ✅
   └─ Task 3: 0% → 80% → 100% ✅

✅ Retrieve Results
   ├─ backend.ts: [código]
   ├─ frontend.tsx: [código]
   └─ tests.ts: [código]

✅ Apply Compression (RTK)
   └─ Token reduction: 60-95%

✅ Code Injection
   ├─ Write backend.ts
   ├─ Write frontend.tsx
   └─ Write tests.ts

✅ Report Generation
   └─ Tokens saved: 73%
   └─ Time saved: 60%
   └─ Parallelism: 3x
```

---

## 5. IMPLEMENTAÇÃO

### Week 9: Cursor Integration

```
Day 1: Cursor Bridge
  - LLMBridge → CursorBridge adapter
  - Task submission API
  - Progress monitoring
  - Result retrieval

Day 2: Metrics & Reporting
  - Token tracking
  - Compression ratio calculation
  - Economy reporting
  - Performance benchmarking

Day 3: Testing & Validation
  - E2E tests with real Cursor API
  - Metrics validation
  - Economy verification
  - Load testing (10+ parallel tasks)

Day 4: Documentation & Examples
  - API documentation
  - Usage examples
  - Best practices
  - Troubleshooting guide
```

---

## 6. TESTES PRÁTICOS

### Teste 1: Token Economy
```javascript
// Baseline (sem parallelization)
const baseline = await julia.generateCode('implement settings');
console.log('Tokens used (baseline):', baseline.tokensUsed); // ~7,500

// Com Cursor parallelization
const optimized = await julia.parallelizeWithCursor('implement settings');
console.log('Tokens used (optimized):', optimized.tokensUsed); // ~2,000
console.log('Savings:', ((7500-2000)/7500*100).toFixed(1) + '%'); // 73%
```

### Teste 2: Speed Improvement
```javascript
const start = Date.now();
const result = await julia.parallelizeWithCursor('implement settings', {
  tasks: [backend, frontend, tests],
  parallelization: true
});
const duration = Date.now() - start;
console.log('Time (sequential): ~90s');
console.log('Time (parallel):', duration/1000 + 's');
console.log('Speedup:', (90000/duration).toFixed(1) + 'x');
```

### Teste 3: Agent Coordination
```javascript
const result = await julia.parallelizeWithCursor('implement settings', {
  agents: {
    backend: ['tech_lead', 'backend_senior'],
    frontend: ['frontend_senior', 'qa_engineer'],
    tests: ['qa_engineer', 'security_specialist']
  }
});
console.log('Backend result:', result.backend.status); // ✅
console.log('Frontend result:', result.frontend.status); // ✅
console.log('Tests result:', result.tests.status); // ✅
```

---

## 7. MÉTRICAS ESPERADAS

| Métrica | Baseline | Com Cursor | Melhoria |
|---------|----------|-----------|----------|
| **Tokens** | 7,500 | 2,000 | **73% ↓** |
| **Tempo** | 90s | 35s | **58% ↓** |
| **Parallelism** | 1x | 3x | **3x ⬆** |
| **Agents** | 1 | 3 | **3x ⬆** |
| **Compression** | 40% (AIL) | 85% (AIL+RTK+Cursor) | **45% ⬆** |

---

## 8. RISCOS & MITIGAÇÃO

| Risco | Impacto | Mitigação |
|-------|--------|-----------|
| Cursor API instável | Alto | Fallback para sequential |
| Rate limits | Médio | Queue + exponential backoff |
| Task conflicts | Médio | Lock mechanism |
| Network latency | Baixo | Timeout + retry |

---

## 9. DEPENDÊNCIAS

- ✅ Cursor Task API (precisa estar disponível)
- ✅ Autenticação Cursor (token/credentials)
- ✅ Julia 3.0.1+ (base)

---

## 10. TIMELINE

```
Week 9 (Jun 9-13): Implementation
├─ Day 1: CursorBridge
├─ Day 2: Metrics
├─ Day 3: Testing
└─ Day 4: Docs

Week 10 (Jun 16-20): Optimization
├─ Performance tuning
├─ Load testing
└─ Production deployment

Target: June 20 - Julia 3.1 with Cursor Integration LIVE
```

---

## 11. SUCCESS CRITERIA

- [ ] CursorBridge implemented (src/integration/cursor-bridge.ts)
- [ ] Token economy ≥ 70% reduction
- [ ] Parallel execution ≥ 2x speedup
- [ ] 100% test coverage
- [ ] Documentation complete
- [ ] Real test with Cursor API working
- [ ] Metrics accurately measured
- [ ] npm julia-ai@3.1.0 published

---

**Próximo Passo:** Implementar Week 9 com testes práticos!

