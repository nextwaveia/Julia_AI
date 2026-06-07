# Julia Orchestrator Skill v2.0.4

🎼 **Orquestração cognitiva no Cursor** — AIL parsing, DAG execution, 19 agentes especializados.

---

## ⚡ Quick Start

1. **Reinicie o Cursor** (skills recarregam automaticamente)
2. **Use em qualquer chat deste projeto:**

```
/julia implement settings.team para 100%:
- corrigir resend-member-invite locale
- validar fluxo convite → aceite
- atualizar spec Equipe
```

3. **Observe:**
   - ✅ AIL Intent compilado
   - ✅ DAG com tarefas + dependências
   - ✅ Execução paralela via subagentes
   - ✅ Validação (TypeScript, i18n, RBAC)
   - ✅ Relatório final

---

## 📖 Documentação Completa

Veja `SKILL.md` para:
- AIL Intent syntax
- DAG execution model
- Agent handoffs
- Validation checklist
- Todos os intents suportados

---

## 🎯 Intents Principais

| Intent | Exemplo | Quando Usar |
|--------|---------|------------|
| `implement` | `/julia implement settings.team ...` | Desenvolver feature completa |
| `refactor` | `/julia refactor src/modules/settings` | Refatorar com zero regressão |
| `audit` | `/julia audit settings.team --check=rbac` | Validar compliance |
| `status` | `/julia status` | Ver agentes + plano |
| `config` | `/julia config tech_lead --enable` | Ativar/desativar agentes |

---

## 🧠 Como Funciona

```
/julia [comando]
    ↓
AIL Parser compila Intent
    ↓
DAG Engine gera tarefas + dependências
    ↓
Julia delega via Cursor subagentes
    ↓
Execução paralela (quando possível)
    ↓
Validação: TypeScript, i18n, RBAC, spec
    ↓
Relatório estruturado
```

---

## 📁 Estrutura

```
.cursor/skills/julia-orchestrator/
├── SKILL.md           ← Documentação completa
├── README.md          ← Este arquivo
└── (regras adicionais)
```

---

## 🔗 Links Úteis

- **AIL Parser:** `~/.cursor/julia-2.0/parser.ts`
- **DAG Engine:** `~/.cursor/julia-2.0/dag-engine.ts`
- **Agentes:** `~/.cursor/julia-2.0/agents-registry.json`
- **Spec:** `docs/spec/modules/`
- **Regra:** `.cursor/rules/nextwave-os-developer.md`

---

## ✅ Validação

Julia sempre valida antes de completar:

- [ ] TypeScript compila (`npm run check:types`)
- [ ] i18n presente (`npm run check:i18n`)
- [ ] RBAC coerente (`npm run check:rbac`)
- [ ] Lint (`npm run lint`)
- [ ] Spec sincronizado

---

## 💬 Feedback

Se encontrar issues com a skill:
1. Note qual intent falhou
2. Veja a AIL Intent compilada
3. Verifique DAG (tarefas, dependências)
4. Reporte o erro

---

**Status:** ✅ Ativo  
**Versão:** 2.0.4  
**Trigger:** `/julia`
