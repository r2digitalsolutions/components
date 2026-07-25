<script lang="ts">
	import MarkdownPreview from './MarkdownPreview.svelte';

	let {
		size = 'md',
		framed = true,
		variant = 'editor'
	}: {
		size?: 'sm' | 'md' | 'lg';
		framed?: boolean;
		variant?: 'editor' | 'docs' | 'compact';
	} = $props();

	const sampleDocs = `# Product notes

Ship the **mention input** and polish the *lightbox* before Friday.

## Checklist
- [x] Keyboard navigation
- [x] Pull-to-dismiss
- [ ] Accessibility pass

## Highlights
1. Faster cold start
2. Better empty states
3. Dark mode parity

> Design is how it works — not only how it looks.

### Code

\`\`\`ts
export function greet(name: string) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### API table

| Prop | Type | Default |
| --- | --- | ---: |
| \`source\` | \`string\` | \`''\` |
| \`size\` | \`sm | md | lg\` | \`md\` |
| \`framed\` | \`boolean\` | \`false\` |

---

Read more in the [docs](https://example.com) or visit https://r2digisolutions.com

![Landscape](https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900 "Lake")
`;

	const sampleCompact = `### Quick tip

Use \`@\` to mention teammates. **Enter** selects, **Esc** closes.

- Fast
- Accessible
- No deps
`;

	let source = $state(variant === 'compact' ? sampleCompact : sampleDocs);

	$effect(() => {
		if (variant === 'compact') source = sampleCompact;
		else if (variant === 'docs') source = sampleDocs;
	});
</script>

{#if variant === 'editor'}
	<div class="grid w-full max-w-5xl gap-4 lg:grid-cols-2">
		<div class="flex min-h-[28rem] flex-col gap-2">
			<div class="flex items-center justify-between gap-2">
				<p class="text-sm font-semibold text-primary">Source</p>
				<p class="text-[11px] text-muted">{source.length} chars</p>
			</div>
			<textarea
				bind:value={source}
				spellcheck="false"
				class="min-h-0 flex-1 resize-none rounded-2xl border border-border bg-surface-elevated p-4 font-mono text-xs leading-relaxed text-primary outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
			></textarea>
		</div>
		<div class="flex min-h-[28rem] flex-col gap-2">
			<p class="text-sm font-semibold text-primary">Preview</p>
			<div class="min-h-0 flex-1 overflow-auto">
				<MarkdownPreview {source} {size} {framed} class="h-full min-h-[28rem]" />
			</div>
		</div>
	</div>
{:else}
	<div class="w-full max-w-2xl space-y-3">
		<p class="text-sm font-semibold text-primary">
			{variant === 'compact' ? 'Compact preview' : 'Documentation style'}
		</p>
		<MarkdownPreview {source} {size} {framed} />
	</div>
{/if}
