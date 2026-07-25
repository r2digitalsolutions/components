<script lang="ts">
	import DiffViewer from './DiffViewer.svelte';

	let {
		mode = 'unified',
		wordDiff = true,
		variant = 'code'
	}: {
		mode?: 'unified' | 'split';
		wordDiff?: boolean;
		variant?: 'code' | 'text' | 'large';
	} = $props();

	let viewMode = $state<'unified' | 'split'>(mode);

	$effect(() => {
		viewMode = mode;
	});

	const codeBefore = `export function greet(name) {
  const prefix = 'Hi';
  return prefix + ' ' + name;
}

export const version = 1;
`;

	const codeAfter = `export function greet(name: string) {
  const prefix = 'Hello';
  return \`\${prefix}, \${name}!\`;
}

export const version = 2;
export const locale = 'en';
`;

	const textBefore = `Shipping Friday
- Mention input
- Lightbox polish
- Docs draft
`;

	const textAfter = `Shipping Friday
- Mention input ✓
- Lightbox polish ✓
- Markdown preview
- JSON viewer
`;

	const largeBefore = Array.from({ length: 24 }, (_, i) => `line ${i + 1}: unchanged content`).join(
		'\n'
	);
	const largeAfter = largeBefore
		.split('\n')
		.map((l, i) => (i === 5 ? 'line 6: changed content here' : i === 12 ? null : l))
		.filter((l): l is string => l !== null)
		.concat('line 25: brand new footer')
		.join('\n');

	const before = $derived(
		variant === 'text' ? textBefore : variant === 'large' ? largeBefore : codeBefore
	);
	const after = $derived(
		variant === 'text' ? textAfter : variant === 'large' ? largeAfter : codeAfter
	);
	const title = $derived(
		variant === 'text' ? 'Changelog' : variant === 'large' ? 'Long file' : 'greet.ts'
	);
</script>

<div class="w-full max-w-4xl space-y-3">
	<div class="space-y-1">
		<p class="text-sm font-semibold text-primary">Diff viewer</p>
		<p class="text-xs leading-relaxed text-secondary">
			LCS line diff with optional word highlighting. Switch between unified and side-by-side.
		</p>
	</div>

	<DiffViewer
		{before}
		{after}
		bind:mode={viewMode}
		{wordDiff}
		{title}
		beforeLabel={variant === 'code' ? 'main' : 'Before'}
		afterLabel={variant === 'code' ? 'feature' : 'After'}
		maxHeight="22rem"
		class="w-full"
	/>
</div>
