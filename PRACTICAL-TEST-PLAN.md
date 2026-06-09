# Plano de Testes Práticos: Julia 3.0 + Cursor Integration

**Data:** 2026-06-09  
**Objetivo:** Validar economia real antes de implementar Week 9  

---

## FASE 1: Teste com CLI Local (Hoje)

### 1.1 Teste: Planejamento sem Cursor

```bash
# Instalar Julia
npm install -g julia-ai@3.0.1

# Teste básico
julia orchestrate "Implementar settings.team" \
  --language typescript \
  --agents tech_lead,backend_senior,frontend_senior

# Saída esperada:
# ✅ Intent parsed
# ✅ DAG generated (3 tasks)
# ✅ Plan: 1 sequential execution
# Tokens estimated: ~7,500
# Time estimated: ~90s
```

### 1.2 Teste: Mesma tarefa COM simulação de Cursor

```bash
# Teste com parallelization
julia orchestrate "Implementar settings.team" \
  --language typescript \
  --agents tech_lead,backend_senior,frontend_senior \
  --parallel \
  --simulate-cursor

# Saída esperada:
# ✅ Intent parsed
# ✅ DAG generated (3 tasks)
# ✅ Cursor simulation: 3 parallel tasks
# Tokens estimated: ~2,000 (com compressão)
# Time estimated: ~30s
# Economy: 73% ✅
```

---

## FASE 2: Medição de Economia (Este fim de semana)

### 2.1 Baseline (sem Cursor)

```javascript
// test/baseline.js
const { DAGBuilder, AILCompiler } = require('julia-ai');

const intent = "Implementar settings.team com backend, frontend e testes";

const dag = new DAGBuilder();
const tasks = dag.analyzeIntent(intent);
console.log('Tasks found:', tasks.length); // 3

const compiler = new AILCompiler();
let totalTokens = 0;
let totalTime = 0;

// Simular execução sequencial
for (const task of tasks) {
  const start = Date.now();
  const result = compiler.compile({
    action: 'implement',
    target: task.name,
    priority: 'high'
  });
  totalTime += (Date.now() - start);
  totalTokens += result.tokenCount;
}

console.log('Sequential execution:');
console.log('- Total tokens:', totalTokens); // ~7,500
console.log('- Total time:', totalTime + 'ms'); // ~15000
console.log('- Parallelism: 1x');
```

### 2.2 Com Cursor (simulado)

```javascript
// test/cursor-simulation.js
const { CursorTaskAPIClient, RTKAdapter } = require('julia-ai');

const client = new CursorTaskAPIClient();
const rtk = new RTKAdapter();

const tasks = [
  { id: 1, name: 'backend', agents: ['tech_lead', 'backend_senior'] },
  { id: 2, name: 'frontend', agents: ['frontend_senior', 'qa_engineer'] },
  { id: 3, name: 'tests', agents: ['qa_engineer', 'security_specialist'] }
];

// Submeter em paralelo
const start = Date.now();
const results = await Promise.all(
  tasks.map(t => client.submit({
    intent: `Implementar ${t.name}`,
    agents: t.agents
  }))
);
const totalTime = Date.now() - start;

// Aplicar compressão
let totalTokens = 0;
for (const result of results) {
  const compressed = rtk.compress(result);
  totalTokens += compressed.tokensUsed;
}

console.log('Parallel execution (Cursor):');
console.log('- Total tokens:', totalTokens); // ~2,000
console.log('- Total time:', totalTime + 'ms'); // ~5000
console.log('- Parallelism: 3x');
console.log('- Savings:', ((7500-totalTokens)/7500*100).toFixed(1) + '%');
```

---

## FASE 3: Integração Real com Cursor (Próxima semana)

### 3.1 Teste com Cursor Task API Real

```bash
# Set credentials
export CURSOR_API_KEY="your-key-here"
export CURSOR_API_ENDPOINT="http://localhost:5000"

# Run test against real Cursor
npm run test:cursor-integration

# Expect:
# ✅ Tasks submitted to Cursor
# ✅ Progress monitored in real-time
# ✅ Results retrieved successfully
# ✅ Code injected into files
# ✅ Metrics accurately measured
```

---

## FASE 4: Validação de Métricas

### 4.1 Checklist de Validação

```
Token Economy:
  [ ] Baseline tokens: 7,500 ± 500
  [ ] Cursor tokens: 2,000 ± 300
  [ ] Compression ratio ≥ 70%

Speed:
  [ ] Sequential time: 90s ± 10s
  [ ] Parallel time: 30s ± 10s
  [ ] Speedup ≥ 2.5x

Accuracy:
  [ ] Generated code is valid TypeScript
  [ ] Files inject without errors
  [ ] All tests pass post-injection
  [ ] No syntax errors in generated code

Reliability:
  [ ] 100% success rate (10+ runs)
  [ ] No task timeouts
  [ ] Proper error handling
  [ ] Graceful fallback to sequential
```

---

## FASE 5: Documentação de Resultados

### 5.1 Report Template

```markdown
# Julia 3.0 + Cursor Integration Test Results

**Date:** [data]
**Tester:** [nome]

## Economy Metrics
- Baseline tokens: [numero]
- Optimized tokens: [numero]
- Savings: [%]

## Performance
- Sequential time: [ms]
- Parallel time: [ms]
- Speedup: [x]

## Quality
- Code validity: [%]
- Test pass rate: [%]
- Error rate: [%]

## Conclusion
[observations]
```

---

## Como Executar os Testes

### Hoje (Fase 1 - CLI local)
```bash
cd /tmp/julia-3.0-development
npm run build
npm install -g .

# Teste 1: Baseline
julia orchestrate "Implementar settings.team" --verbose

# Teste 2: Com parallelization simulada
julia orchestrate "Implementar settings.team" --parallel --simulate-cursor
```

### Este fim de semana (Fase 2 - Medição)
```bash
# Criar test/baseline.js e test/cursor-simulation.js
npm run test:baseline
npm run test:cursor-simulation

# Comparar resultados
npm run test:economy-report
```

### Próxima semana (Fase 3-5 - Real + Reports)
```bash
# Com Cursor API real
export CURSOR_API_KEY=...
npm run test:cursor-integration
npm run generate:metrics-report
```

---

## Success Criteria

- ✅ Fase 1: CLI testes completados
- ✅ Fase 2: Economy metrics validados
- ✅ Fase 3: Real Cursor API testado
- ✅ Fase 4: Métricas dentro dos limites esperados
- ✅ Fase 5: Report documentado

Se TODOS os testes passarem → Implementar Week 9!

---

**Próximo Passo:** Começar Fase 1 hoje!

