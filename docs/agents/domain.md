# Domain Docs

How the engineering skills should consume this repo's domain documentation.

## Before exploring, read these

- **CONTEXT.md** at the repo root
- **docs/adr/** — read ADRs that touch the area you're about to work in.

If these files don't exist, proceed silently. Don't flag their absence.

## File structure

Single-context repo:

`
/
├── CONTEXT.md
├── docs/adr/
│   ├── 0001-some-decision.md
│   └── 0002-another-decision.md
└── src/
`

## Use the glossary's vocabulary

When naming a domain concept, use the term as defined in CONTEXT.md. Don't drift to synonyms.

## Flag ADR conflicts

If output contradicts an existing ADR, surface it explicitly:

> _Contradicts ADR-0007 — but worth reopening because…_
