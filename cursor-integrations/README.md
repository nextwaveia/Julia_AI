# 🎼 Cursor Integrations

Julia AI integrations for Cursor IDE.

## 📦 Available Integrations

### Julia Orchestrator Skill (v2.0.4)

**Path:** `./julia-orchestrator/`

AIL Intent parsing, DAG execution, 19-agent delegation system for Cursor chat.

**Features:**
- 5 intents: `implement`, `refactor`, `audit`, `status`, `config`
- AIL Intent compilation
- DAG execution with parallelism
- 19 agents (Dev, Marketing, Design, Strategy squads)
- Cursor subagent delegation
- Validation harness (TypeScript, i18n, RBAC, spec)

**Installation:**
1. Copy `julia-orchestrator/` to your project's `.cursor/skills/`
2. Restart Cursor
3. Use `/julia <intent>` in chat

**Documentation:**
- `SKILL.md` — Full specification
- `README.md` — Quick start
- `ACTIVATE.md` — Activation guide

**Project Integration:**
- Works with NextWaveia_AWS_System
- Respects nextwave-os-developer rules
- References `~/.cursor/julia-2.0/` registry

---

## 🔗 Links

- **Julia AI npm:** https://www.npmjs.com/package/julia-ai
- **Julia AI GitHub:** https://github.com/nextwaveia/Julia_AI
- **NextWave System:** https://github.com/nextwaveia/NextWaveia_AWS_System

---

**Last Updated:** 2026-06-06  
**Julia Version:** 2.0.4
