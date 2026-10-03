# Components — AGENTS.md

Librería UI compartida `@r2digisolutions/components` (Svelte 5, Atomic Design, Tailwind 4).

## Publicar siempre al terminar

Si en la sesión **cambiaste código en este repo** (primitivos, MapExplorer, Form*, etc.):

1. Working tree limpio, en `main`.
2. `pnpm release:patch` (o `minor` / `major` si el semver lo pide).
3. Eso hace bump + commit + tag `v*` + push → CI (`.github/workflows/publish.yml`) publica en npm.
4. En cada app consumidora que use el cambio: `pnpm add @r2digisolutions/components@^X.Y.Z`.

**No** dejes cambios solo en local aunque Vite resuelva `../components`. Sin publish, `svelte-check` / CI / Coolify siguen tipando contra el npm viejo.

Confirmación no interactiva: `pnpm exec bumpp patch --commit --tag --push --yes`.

Detalle del flujo: [README.md § Publicación](README.md#publicación).

## Comandos

```bash
pnpm install
pnpm dev
pnpm prepack          # dist/ + tipos
pnpm check
pnpm release:patch    # publicar
```
