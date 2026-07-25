<script lang="ts">
	import DocsLayout from './DocsLayout.svelte';

	let navValue = $state('intro');
	let activeHeading = $state('getting-started');

	const markdown = `# Getting started

Welcome to the component docs.

## Installation

\`\`\`bash
npm i @r2digisolutions/components
\`\`\`

## Usage

Import atoms, molecules, or organisms from the package entry.

### Theming

Tokens live in CSS variables and work with light/dark mode.
`;
</script>

<DocsLayout
	brand="Components"
	bind:navValue
	bind:activeHeading
	{markdown}
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
	toc={[
		{ id: 'getting-started', label: 'Getting started' },
		{ id: 'installation', label: 'Installation', depth: 2 },
		{ id: 'usage', label: 'Usage', depth: 2 },
		{ id: 'theming', label: 'Theming', depth: 3 }
	]}
/>
