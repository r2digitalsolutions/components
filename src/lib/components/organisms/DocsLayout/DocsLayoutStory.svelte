<script lang="ts">
	import DocsLayout from './DocsLayout.svelte';
	import type { DocsPage } from './DocsLayout.svelte';

	let navValue = $state('intro');
	let activeHeading = $state('getting-started');

	const pages: DocsPage[] = [
		{
			id: 'intro',
			title: 'Guide',
			markdown: `# Getting started

Welcome to the **R2 Digi** component docs. This layout mirrors a real documentation site: sidebar navigation swaps pages, and the table of contents scrolls within the article.

Use the left rail to move between topics. Use **On this page** to jump to sections in the current article.

## Why this library

Ship consistent product UI without rebuilding atoms and page shells every time.

- Typed Svelte 5 components
- Shared design tokens
- Storybook-first development

## Next steps

1. Install the package
2. Import what you need
3. Theme with CSS variables

Keep scrolling — there is enough content here for the TOC anchors to move the article pane.
`,
			toc: [
				{ id: 'getting-started', label: 'Getting started' },
				{ id: 'why-this-library', label: 'Why this library', depth: 2 },
				{ id: 'next-steps', label: 'Next steps', depth: 2 }
			]
		},
		{
			id: 'install',
			title: 'Guide',
			markdown: `# Installation

Add the package to your SvelteKit or Vite app.

## npm

\`\`\`bash
npm i @r2digisolutions/components
\`\`\`

## pnpm

\`\`\`bash
pnpm add @r2digisolutions/components
\`\`\`

## Peer dependencies

Make sure you are on **Svelte 5** and have your design tokens imported once at the app root.

### Styles

Import the package styles (or copy token CSS) before rendering components.
`,
			toc: [
				{ id: 'installation', label: 'Installation' },
				{ id: 'npm', label: 'npm', depth: 2 },
				{ id: 'pnpm', label: 'pnpm', depth: 2 },
				{ id: 'peer-dependencies', label: 'Peer dependencies', depth: 2 },
				{ id: 'styles', label: 'Styles', depth: 3 }
			]
		},
		{
			id: 'theming',
			title: 'Guide',
			markdown: `# Theming

Tokens live in CSS variables and work with light/dark mode.

## Surfaces

Use \`surface\`, \`surface-elevated\`, and \`surface-overlay\` for nesting panels without harsh borders.

## Brand

\`brand-500\` drives primary actions, focus rings, and active navigation states.

## Dark mode

Toggle the \`dark\` class on \`document.documentElement\` — components follow automatically.
`,
			toc: [
				{ id: 'theming', label: 'Theming' },
				{ id: 'surfaces', label: 'Surfaces', depth: 2 },
				{ id: 'brand', label: 'Brand', depth: 2 },
				{ id: 'dark-mode', label: 'Dark mode', depth: 2 }
			]
		},
		{
			id: 'atoms',
			title: 'Components',
			markdown: `# Atoms

Smallest building blocks: buttons, inputs, badges, avatars.

## Button

Primary, secondary, ghost, outline, and destructive variants.

## Input

Text fields with sizes, status tones, and clearable behavior.
`,
			toc: [
				{ id: 'atoms', label: 'Atoms' },
				{ id: 'button', label: 'Button', depth: 2 },
				{ id: 'input', label: 'Input', depth: 2 }
			]
		},
		{
			id: 'molecules',
			title: 'Components',
			markdown: `# Molecules

Composed patterns built from atoms: form fields, cards, menus.

## FormField

Label + control + helper text with shared status styling.

## Card

Elevated surfaces for grouping related content.
`,
			toc: [
				{ id: 'molecules', label: 'Molecules' },
				{ id: 'formfield', label: 'FormField', depth: 2 },
				{ id: 'card', label: 'Card', depth: 2 }
			]
		}
	];
</script>

<div class="h-dvh min-h-dvh w-full">
	<DocsLayout
		brand="Components"
		bind:navValue
		bind:activeHeading
		{pages}
		nav={[
			{
				id: 'guide',
				label: 'Guide',
				items: [
					{ id: 'intro', label: 'Introduction' },
					{ id: 'install', label: 'Installation' },
					{ id: 'theming', label: 'Theming' }
				]
			},
			{
				id: 'components',
				label: 'Components',
				items: [
					{ id: 'atoms', label: 'Atoms' },
					{ id: 'molecules', label: 'Molecules' }
				]
			}
		]}
	/>
</div>
