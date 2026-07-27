# @r2digisolutions/components

Librería de componentes Svelte 5 — Atomic Design, Tailwind 4, Light/Dark mode.

## Desarrollo

```sh
pnpm install
pnpm dev
```

Todo lo que está en `src/lib` forma parte de la librería. `src/routes` sirve como showcase.

## Storybook

```sh
pnpm storybook
```

## Build

```sh
pnpm prepack   # genera dist/ con svelte-package + publint
pnpm build     # showcase app + prepack
```

## Publicación

El versionado usa [bumpp](https://github.com/antfu/bumpp) (semver). Al crear un tag `v*`, GitHub Actions publica en npm.

### Requisitos previos (una sola vez)

1. Acceso al scope npm `@r2digisolutions`
2. Automation token en [npmjs.com](https://www.npmjs.com/) → Access Tokens
3. Secret `NPM_TOKEN` en el repo GitHub (`Settings` → `Secrets and variables` → `Actions`)

### Subir versión

Working tree limpio, en `main`:

```sh
pnpm release:patch   # 0.0.1 → 0.0.2
pnpm release:minor   # 0.0.1 → 0.1.0
pnpm release:major   # 0.0.1 → 1.0.0

# O interactivo:
pnpm release
```

Esto hace bump de versión, commit, tag `vX.Y.Z` y push. CI construye con `pnpm prepack` y publica `@r2digisolutions/components`.

### Instalación (consumidores)

```sh
pnpm add @r2digisolutions/components
```

## Licencia

MIT
