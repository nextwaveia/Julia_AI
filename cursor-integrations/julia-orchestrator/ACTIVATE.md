# ✅ Julia Orchestrator - Ativação

## 🚀 Para Ativar a Skill

### Passo 1: Reiniciar o Cursor
```bash
# Feche o Cursor completamente
# Reabra o Cursor

# Cursor detecta automaticamente:
# .cursor/skills/ → carrega todas as skills
```

### Passo 2: Confirmar Ativação
No chat, digite:

```
/julia status
```

Você deve ver:
```
✅ Julia Orchestrator v2.0.4 ativada

19 Agentes disponíveis:
  Dev Squad (6):      tech_lead, frontend_senior, backend_senior, database_architect, devops_engineer, qa_engineer
  Marketing Squad (7): content_strategist, social_media_manager, email_specialist, growth_hacker, brand_manager, pr_specialist, analytics_expert
  Design Squad (3):   ux_designer, ui_designer, motion_designer
  Strategy Squad (3): product_manager, business_analyst, innovation_lead

Registry: ~/.cursor/julia-2.0/agents-registry.json
Parser: ~/.cursor/julia-2.0/parser.ts
DAG Engine: ~/.cursor/julia-2.0/dag-engine.ts

Pronto para receber comandos: /julia <intent> [args]
```

### Passo 3: Usar
```
/julia implement settings.team para 100%:
- corrigir resend-member-invite locale
- validar fluxo convite → aceite
- atualizar spec Equipe
```

---

## 🔍 Troubleshooting

### Skill não aparece
**Solução:**
1. Verifique caminho: `.cursor/skills/julia-orchestrator/SKILL.md`
2. Restart Cursor
3. Verifique se `~/.cursor/julia-2.0/` existe

### `/julia` command não funciona
**Solução:**
1. Confirme ativação: `/julia status`
2. Se falhar, skill pode não ter carregado
3. Restart Cursor novamente

### Agentes não aparecem
**Solução:**
1. Verifique: `cat ~/.cursor/julia-2.0/agents-registry.json`
2. Se arquivo não existe, Julia não foi instalado corretamente
3. Execute: `npm install -g julia-ai`

---

## 📋 Checklist Pós-Ativação

- [ ] Skill aparece em `.cursor/skills/julia-orchestrator/`
- [ ] Cursor reiniciado
- [ ] `/julia status` retorna sucesso
- [ ] 19 agentes listados
- [ ] Registry em `~/.cursor/julia-2.0/` existe
- [ ] Pronto para usar `/julia implement ...`

---

## 🎯 Próximas Ações

1. **Teste agora:**
   ```
   /julia implement settings.team para 100%:
   - corrigir resend-member-invite locale
   - validar fluxo convite → aceite
   - atualizar spec Equipe
   ```

2. **Observe o fluxo:**
   - AIL Intent compilado
   - DAG executado
   - Relatório final

3. **Revise mudanças:**
   ```bash
   git diff
   ```

4. **Commit ou revise:**
   ```bash
   git commit -m "[AIL] Equipe Settings: completar invite flow"
   ```

---

**Status:** ✅ Pronto  
**Data:** 2026-06-06  
**Versão:** 2.0.4
