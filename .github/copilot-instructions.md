# Copilot / AI Agent Instructions for swn-faction-tracker

## Purpose
- Help AI agents be productive quickly by describing project structure, coding patterns, developer workflows, and testing/debugging entry points that are specific to this repo.

## Quick repo overview
- TypeScript React app (src/) with domain-specific contexts and small utility types.
- Key areas:
  - src/contexts — React context providers (e.g. FactionContextProvider, LocationContext).
  - src/hooks — reusable hooks (e.g. useLocalStorage).
  - src/utils — domain models and helpers (e.g. FactionInfo, LocationInfo, NamedElementPoset, FactionPoset).
- Code uses absolute imports with the "@/..." path alias (check tsconfig/webpack/vite config).

## Important patterns & conventions
- Poset pattern: Entities are stored/managed via a "Poset," a partially-ordered set (e.g. FactionPoset) that exposes:
  - getAll(), update(id, key, value), subscribe(callback) -> unsubscribe
  - Actions use NamedElementPosetAction types (e.g. "REMOVE").
  - When subscribing, callers must call the returned unsubscribe function (see useEffect in FactionContextProvider).
- Context providers expose poset instances rather than plain arrays:
  - Provider value = { factions: factionsPoset }
  - Use useMemo to keep context identity stable for consumers.
- Local persistence:
  - useLocalStorage hook is used for persistence. Keys are stable strings (example: "swn-faction-tracker.factions"); do not rename keys without a migration plan.
- Testability:
  - Providers accept optional factory parameters to inject test doubles (see FactionContextProvider.factory). Use that when writing unit tests to avoid real localStorage or global singletons.

## React lifecycle expectations
- Subscribe/unsubscribe from posets and other contexts in useEffect; include poset/other-context references in dependency arrays so cleanup/re-subscribe logic is correct.
- When related domain objects are removed (e.g. a Location), update referencing objects (e.g. set faction.homeworldId to undefined) rather than deleting the referencing object.

Filesystem & import notes
- Path alias "@/..." is used throughout. Resolve via tsconfig paths or your editor config before running TypeScript tooling.
- Look for domain types under src/utils (e.g. FactionInfo, LocationInfo, NamedElementPoset).

Developer workflows (how to run/build/test)
- Check package.json for exact scripts. Typical commands to try from repo root (Windows PowerShell/CMD):
  - npm install
  - npm run dev    (start dev server)
  - npm run build  (production build)
  - npm test       (run tests)
  - npx tsc --noEmit or npm run typecheck (type checking)
  - npm run lint   (linting)
- If scripts differ, prefer the exact names in package.json.

## Editing guidance for AI edits
- Preserve use of factories and dependency injection in providers (keeps tests simple).
- When modifying persisted keys (useLocalStorage), add a migration comment and do not silently change keys.
- When changing context shape, update all consumers and the FactionContext definition.
- When interacting with posets, use the public API (getAll/update/subscribe) rather than poking internal state.

Files to inspect first for context
- src/contexts/providers/FactionContextProvider.tsx — example provider, subscriptions, and persistence.
- src/contexts/FactionContext.ts — context type and default values.
- src/hooks/useLocalStorage.ts — persistence behavior and signature.
- src/utils/NamedElementPoset.ts (or similar) — poset API shape and action types.

## Example patterns to follow (from repo)
- Provider creates poset from stored elements:
  - const factionsPoset = factory ? factory(storedFactions) : new FactionPoset(storedFactions);
- Update on related-entity removal:
  - locations.subscribe(action => { if (action.type === "REMOVE") { update referencing factions } });

## When to ask for clarification
- If you need to change package.json scripts, path aliases, or localStorage keys — prompt the maintainer.
- If a migration of persisted data is required, request a strategy and consent.

If anything in this summary is unclear or you'd like more detail on a particular area (poset API, tests, or import resolution), indicate which file or workflow and I will expand.
