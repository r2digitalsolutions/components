<script lang="ts">
	import BentoGrid from './BentoGrid.svelte';
	import type { BentoItem } from './BentoGrid.svelte';

	const items: BentoItem[] = [
		{ id: 'hero', colSpan: 2, rowSpan: 2 },
		{ id: 'metrics', colSpan: 2, rowSpan: 1 },
		{ id: 'feature-a', colSpan: 1, rowSpan: 1 },
		{ id: 'feature-b', colSpan: 1, rowSpan: 1 },
		{ id: 'cta', colSpan: 2, rowSpan: 1 },
		{ id: 'social', colSpan: 2, rowSpan: 1 }
	];

	const titles: Record<string, { title: string; description: string }> = {
		hero: { title: 'Ship faster', description: 'Composable UI for product teams.' },
		metrics: { title: 'Live metrics', description: 'Track adoption in real time.' },
		'feature-a': { title: 'Themes', description: 'Light and dark out of the box.' },
		'feature-b': { title: 'Accessible', description: 'Keyboard-first by default.' },
		cta: { title: 'Start building', description: 'Drop-in molecules and pages.' },
		social: { title: 'Community', description: 'Share patterns with your team.' }
	};
</script>

<div class="max-w-4xl">
	<BentoGrid {items} cols={4} gap="md">
		{#snippet render(item)}
			<div class="flex h-full flex-col justify-between p-5">
				<div>
					<p class="text-xs font-medium uppercase tracking-wide text-brand-600 dark:text-brand-400">
						{item.id}
					</p>
					<h3 class="mt-1 text-lg font-semibold text-primary">
						{titles[item.id]?.title ?? item.id}
					</h3>
					<p class="mt-2 text-sm leading-relaxed text-muted">
						{titles[item.id]?.description ?? ''}
					</p>
				</div>
				<span class="mt-4 text-xs text-secondary">col {item.colSpan ?? 1} · row {item.rowSpan ?? 1}</span>
			</div>
		{/snippet}
	</BentoGrid>
</div>
