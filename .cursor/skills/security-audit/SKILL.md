---
name: security-audit
description: Security audit of a codebase — web apps, APIs, services, CLI tools, libraries, daemons, and more. Use when asked to find security bugs, do a security review, audit for vulnerabilities, or pen-test the code. Focuses on exploitable issues with real impact, not theoretical concerns or industry-standard behavior.
---

# Security Audit (project skill)

Source of truth lives in `.agents/skills/security-audit/`. Read and follow that directory before starting an audit.

## Required reading order

1. `.agents/skills/security-audit/SKILL.md` — orchestration, phases, output paths
2. `.agents/skills/security-audit/RECONNAISSANCE.md` — Phase 1
3. `.agents/skills/security-audit/HUNTING.md` — Phase 2
4. `.agents/skills/security-audit/ATTACK-CLASSES.md` — attack taxonomy
5. `.agents/skills/security-audit/VALIDATION-AND-REPORTING.md` — Phases 4–6
6. `.agents/skills/security-audit/report-schema.json` and `validate-findings.cjs` — structured output

## Output location

Write audit artifacts under `.security-audit/run-<N>/` in this repo (not committed). Increment `<N>` per run. Do not reuse deleted run folders unless the user asks.

## Related skills

- `.cursor/skills/security-and-hardening/` — preventive secure coding while building features
- `review-security` (Cursor built-in) — review local code changes before merge
