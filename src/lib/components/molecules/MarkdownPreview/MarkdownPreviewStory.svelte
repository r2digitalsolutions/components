<script lang="ts">
	import MarkdownPreview from './MarkdownPreview.svelte';

	const source = `# Markdown preview

A **bold** and *italic* example with a [link](https://example.com).

## Lists
- First item
- Second item

> A short quote

\`inline code\` and a block:

\`\`\`
const hello = 'world';
\`\`\`
`;
</script>

<MarkdownPreview {source} class="w-full max-w-lg rounded-xl border border-border bg-surface-elevated p-4" />
