<script lang="ts">
	import MasonryGrid from './MasonryGrid.svelte';

	const items = [
		{ title: 'Sunrise', h: 140, color: 'bg-amber-100 dark:bg-amber-950/40' },
		{ title: 'Notes', h: 220, color: 'bg-sky-100 dark:bg-sky-950/40' },
		{ title: 'Ship', h: 160, color: 'bg-emerald-100 dark:bg-emerald-950/40' },
		{ title: 'Draft', h: 200, color: 'bg-violet-100 dark:bg-violet-950/40' },
		{ title: 'Mood', h: 120, color: 'bg-rose-100 dark:bg-rose-950/40' },
		{ title: 'Archive', h: 180, color: 'bg-zinc-100 dark:bg-zinc-800' }
	];
</script>

<div class="max-w-3xl rounded-2xl border border-border bg-surface-elevated p-4">
	<p class="mb-4 text-sm font-semibold text-primary">Gallery</p>
	<MasonryGrid columns={3}>
		{#each items as item (item.title)}
			<div
				class={['rounded-xl border border-border p-4', item.color]}
				style:min-height={`${item.h}px`}
			>
				<p class="text-sm font-medium text-primary">{item.title}</p>
				<p class="mt-1 text-xs text-muted">Masonry card · {item.h}px</p>
			</div>
		{/each}
	</MasonryGrid>
</div>
