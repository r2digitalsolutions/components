<script lang="ts">
	import VirtualList from './VirtualList.svelte';

	let {
		count = 10000,
		itemHeight = 52,
		height = 400
	}: {
		count?: number;
		itemHeight?: number;
		height?: number;
	} = $props();

	const items = $derived(
		Array.from({ length: count }, (_, i) => ({
			id: String(i),
			name: `Item ${i + 1}`,
			description: `Description for item number ${i + 1}`,
			index: i
		}))
	);
</script>

<div class="w-full max-w-lg space-y-3">
	<p class="text-xs text-muted">
		Rendering <span class="text-primary font-semibold">{count.toLocaleString()}</span> items virtually — only visible rows mount.
	</p>

	<div class="rounded-xl border border-border overflow-hidden">
		<VirtualList
			{items}
			{itemHeight}
			{height}
			class="w-full"
		>
			{#snippet item(row, idx)}
				<div
					class={[
						'flex items-center gap-3 px-4 border-b border-border',
						idx % 2 === 0 ? 'bg-surface-elevated' : 'bg-surface-overlay'
					]}
					style={`height: ${itemHeight}px;`}
				>
					<span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900 text-xs font-bold text-brand-600 dark:text-brand-400">
						{idx % 26 === 0 ? String.fromCharCode(65 + (idx / 26) % 26) : String.fromCharCode(65 + idx % 26)}
					</span>
					<div class="min-w-0 flex-1">
						<p class="text-sm font-medium text-primary truncate">{row.name}</p>
						<p class="text-xs text-muted truncate">{row.description}</p>
					</div>
					<span class="shrink-0 text-xs text-muted font-mono">#{row.index + 1}</span>
				</div>
			{/snippet}
		</VirtualList>
	</div>
</div>
