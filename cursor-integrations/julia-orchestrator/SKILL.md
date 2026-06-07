---
name: julia-orchestrator
description: AIL intent parsing, DAG execution, 19-agent delegation for NextWaveia_AWS_System
version: 2.0.4
registry: ~/.cursor/julia-2.0/agents-registry.json
parser: ~/.cursor/julia-2.0/parser.ts
dag_engine: ~/.cursor/julia-2.0/dag-engine.ts
---

# 🎼 Julia Orchestrator Skill v2.0.4

Ativa modo orquestrador Julia no Cursor. Parse AIL Intent → DAG → execução delegada.

**Trigger:** Qualquer mensagem começando com `/julia`

---

## 📌 Intents Suportados

### `/julia implement <module> [options]`
Desenvolver + validar + atualizar spec

```
/julia implement settings.team para 100%:
- corrigir resend-member-invite locale
- validar fluxo convite → aceite
- atualizar spec Equipe ~93%
```

**Fluxo:**
1. Tech Lead: lê spec + mapeia lacunas
2. Backend Senior: valida actions/API
3. Frontend Senior: implementa/valida UI (paralelo)
4. QA Engineer: lint + checklist (após 2 e 3)

### `/julia refactor <path> [options]`
Refatorar com zero regressão

```
/julia refactor src/modules/settings --target=components
```

### `/julia audit <module> [options]`
Auditoria RBAC + i18n + TypeScript

```
/julia audit settings.team --check=[rbac,i18n,types]
```

### `/julia status`
Listar agentes + plano AIL atual

```
/julia status --verbose
```

### `/julia config <agent> --<flag>`
Ativar/desativar agentes específicos

```
/julia config tech_lead --enable
/julia config qa_engineer --disable
```

---

## 🧠 AIL Intent Compilation

Quando você manda `/julia implement settings.team ...`, eu compilo em AIL:

```yaml
# AIL Intent Object
action: implement
target: settings.team
priority: high
scope: Equipe Settings (spec 93% → 100%)

requirements:
  - validar convite Resend em locale pt-BR
  - testar fluxo completo invite → accept
  - editar permissões em authority + squads + funções
  - atualizar docs/spec/modules/settings.md

suggested_agents:
  - tech_lead (análise)
  - backend_senior (actions/API)
  - frontend_senior (UI)
  - qa_engineer (validação)

validation:
  must_pass:
    - typescript (tsc --noEmit)
    - i18n (locale pt-BR presente)
    - rbac (permissões coerentes)
  should_pass:
    - e2e_invite_flow (smoke test)
    - spec_updated (docs/spec/ sincronizado)

context:
  project: NextWaveia_AWS_System
  branch: (current)
  rule: nextwave-os-developer
  env: ENABLE_EMAIL_IN_DEV=true (se dev)
```

---

## 📊 DAG Execution Graph

Após compilar AIL, gero DAG (tarefas + dependências):

```yaml
# Execution Graph
tasks:
  - id: T1
    agent: tech_lead
    action: read_spec
    description: Ler spec Equipe Settings, mapear lacunas
    depends_on: []
    parallel_with: []
    estimated_time: 5min

  - id: T2
    agent: backend_senior
    action: validate_resend_actions
    description: Validar actions/email de convite, locale pt-BR
    depends_on: [T1]
    parallel_with: [T3]
    estimated_time: 10min

  - id: T3
    agent: frontend_senior
    action: implement_invite_ui
    description: Implementar invite-member-dialog + manage-assignments-sheet
    depends_on: [T1]
    parallel_with: [T2]
    estimated_time: 15min

  - id: T4
    agent: qa_engineer
    action: validate_all
    description: Lint (TypeScript, i18n) + checklist + smoke test
    depends_on: [T2, T3]
    parallel_with: []
    estimated_time: 10min

# Total: ~25min de wall-clock (parallelismo)
```

---

## 🎯 Handoff AIL para Cada Agente

Quando delego T2 para `backend_senior`, envio:

```json
{
  "from": "julia",
  "to": "backend_senior",
  "task_id": "T2",
  "parent_intent": "implement",
  "parent_target": "settings.team",
  
  "context": {
    "project": "NextWaveia_AWS_System",
    "module": "settings/team",
    "spec_path": "docs/spec/modules/settings.md",
    "priority": "high"
  },
  
  "instruction": "Validar actions de email para invites (Resend). Confirmar locale pt-BR em templates.",
  
  "files_to_touch": [
    "src/modules/settings/actions.ts",
    "src/modules/settings/templates/invite-email.ts",
    "i18n/pt-BR/modules/settings.json"
  ],
  
  "constraints": [
    "Respeitar nextwave-os-developer rule",
    "Zero breaking changes",
    "Atualizar spec se houver divergência",
    "TypeScript deve compilar"
  ],
  
  "validation_checklist": [
    "Email locale correto (pt-BR)?",
    "Actions chamam Resend corretamente?",
    "Nenhum breaking change?",
    "Spec sincronizado?"
  ],
  
  "deliverable": "Lista de mudanças + checklist validado OU lista de bugs encontrados"
}
```

---

## 🔀 Mapeamento: Agentes Julia → Subagentes Cursor

| Agente Julia | Subagente Cursor | Quando |
|--------------|------------------|--------|
| **tech_lead** | `Explore` + leitura spec | Análise inicial, design review |
| **frontend_senior** | CLI direto + Edit/Write | Componentes React, UI |
| **backend_senior** | `Explore` + edição TypeScript | Actions, API, handlers |
| **database_architect** | `Explore` + SQL/schema | Migrações, queries |
| **qa_engineer** | `code-reviewer` + Bash | Validação, lint, testes |
| **devops_engineer** | `Bash` direto | Deploy, infra, CI/CD |

---

## ✅ Validação Obrigatória (Pré-Commit)

**Sempre executado antes de reportar sucesso:**

```bash
# 1. TypeScript
npm run check:types

# 2. i18n (pt-BR obrigatório)
npm run check:i18n

# 3. RBAC (permissões coerentes)
npm run check:rbac

# 4. Lint
npm run lint

# 5. Spec sincronizado
grep -l "settings.team" docs/spec/*.md
```

Se algum falhar → reporte quais agentes precisam corrigir.

---

## 📋 Relatório Final (Entrega Julia)

Após completar, reporte em formato estruturado:

```markdown
# ✅ Julia Entrega: Equipe Settings

## AIL Intent
- **Action:** implement
- **Target:** settings.team
- **Prioridade:** high
- **Status:** ✅ COMPLETO

## DAG Execution
- **T1 (tech_lead):** ✅ Spec lido, lacunas mapeadas
- **T2 (backend_senior):** ✅ Resend validado, locale pt-BR OK
- **T3 (frontend_senior):** ✅ UI implementada, zero erros
- **T4 (qa_engineer):** ✅ Lint + i18n + RBAC OK

## Arquivos Tocados
- `src/modules/settings/actions.ts` (+15, -8)
- `src/modules/settings/components/invite-dialog.tsx` (+45, -10)
- `i18n/pt-BR/modules/settings.json` (+3 chaves)
- `docs/spec/modules/settings.md` (+100 caracteres)

## Validação
- [x] TypeScript compila
- [x] i18n pt-BR presente
- [x] RBAC coerente
- [x] Spec 93% → 100%
- [ ] E2E invite flow (próximas sessão)

## Próximos Passos
1. Revisar mudanças no PR
2. E2E smoke test do fluxo invite
3. Merge para main

**Agentes Usados:** tech_lead, backend_senior, frontend_senior, qa_engineer  
**Tempo Total:** ~25min (parallelismo)  
**Commits Recomendados:** 1 commit focado com mensagem AIL

---
```

---

## 🚀 Fluxo Passo a Passo (Você)

### 1️⃣ Reiniciar Cursor
```bash
# Cursor recarrega skills em .cursor/skills/
# Esta skill fica automaticamente disponível
```

### 2️⃣ Usar `/julia` em qualquer chat deste projeto
```
/julia implement settings.team para 100%:
- corrigir resend-member-invite locale
- validar fluxo convite → aceite
- atualizar spec Equipe ~93%
```

### 3️⃣ Eu compilo AIL + DAG + executo
```
✅ AIL compilado
✅ DAG gerado (4 tarefas, parallelismo)
✅ Delegações feitas via subagentes
✅ Arquivos editados
✅ Validação executada
✅ Relatório final
```

### 4️⃣ Você faz merge ou ajusta
```bash
git diff  # revisar mudanças
git commit -m "[AIL] Equipe Settings: completar invite flow"
git push
```

---

## 🔧 Configuração

**Registro de Agentes:**
```bash
cat ~/.cursor/julia-2.0/agents-registry.json
```

**Parser AIL:**
```bash
cat ~/.cursor/julia-2.0/parser.ts
```

**DAG Engine:**
```bash
cat ~/.cursor/julia-2.0/dag-engine.ts
```

**Projeto:**
```bash
pwd
# → /c/Users/linde/projects/agencia/NextWaveia_AWS_System
```

---

## 💡 Exemplos de Uso

### Exemplo 1: Implementar Feature
```
/julia implement settings.team para 100%:
- corrigir resend-member-invite locale
- validar fluxo convite → aceite
- atualizar spec Equipe ~93%
```

### Exemplo 2: Refatorar Módulo
```
/julia refactor src/modules/settings --target=actions --zero-regressão
```

### Exemplo 3: Auditoria Completa
```
/julia audit settings.team --check=[rbac,i18n,types,e2e]
```

### Exemplo 4: Ver Status
```
/julia status --verbose
```

---

## 🎓 Referências

- **AIL Spec:** `~/.cursor/julia-2.0/AIL-SPEC.md`
- **DAG Engine:** `~/.cursor/julia-2.0/dag-engine.ts`
- **Agentes:** `~/.cursor/julia-2.0/agents-registry.json`
- **nextwave-os-developer:** `NextWaveia_AWS_System/.cursor/rules/nextwave-os-developer.md`
- **Spec:** `NextWaveia_AWS_System/docs/spec/`

---

**Versão:** 2.0.4  
**Data:** 2026-06-06  
**Status:** ✅ Pronto para usar  
**Trigger:** `/julia`
