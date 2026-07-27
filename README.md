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
pnpm storybook:build   # salida en storybook-static/
```

En cada push a `main`, GitHub Actions publica Storybook en Pages:

`https://r2digitalsolutions.github.io/components/`

Requisito (una vez): en el repo → **Settings → Pages → Source: GitHub Actions**.

## Build

```sh
pnpm prepack   # genera dist/ con svelte-package + publint
pnpm build     # showcase app + prepack
```

## Publicación

El versionado usa [bumpp](https://github.com/antfu/bumpp) (semver). Al crear un tag `v*`, GitHub Actions publica en npm con **Trusted Publishing (OIDC)** — sin `NPM_TOKEN`.

### Requisitos previos (una sola vez)

1. Acceso al scope npm `@r2digisolutions`
2. En [npmjs.com](https://www.npmjs.com/) → tu paquete (o créalo) → **Settings → Trusted Publisher**:
   - Provider: **GitHub Actions**
   - Organization / user: `r2digitalsolutions`
   - Repository: `components`
   - Workflow filename: `publish.yml`
3. (Opcional) Borra el secret `NPM_TOKEN` del repo si lo tenías; ya no hace falta

Si el paquete aún no existe en npm, créalo una vez desde la web o con un publish local autenticado; después el Trusted Publisher se encarga de los releases por CI.

Docs: https://docs.npmjs.com/trusted-publishers/

### Subir versión

Working tree limpio, en `main`:

```sh
pnpm release:patch   # 0.0.1 → 0.0.2
pnpm release:minor   # 0.0.1 → 0.1.0
pnpm release:major   # 0.0.1 → 1.0.0

# O interactivo:
pnpm release
```

Esto hace bump de versión, commit, tag `vX.Y.Z` y push. CI entonces:

1. Publica `@r2digisolutions/components` en npm
2. Crea un **GitHub Release** con notas generadas desde los commits desde el tag anterior

Mismo flujo que usan muchas libs con `bumpp` / `release-it` (tag → CI → npm + GitHub Release).

### Instalación (consumidores)

```sh
pnpm add @r2digisolutions/components
```

## Licencia

MIT
