<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';

	interface VirtualListProps {
		items: T[];
		itemHeight: number;
		height: number;
		item: Snippet<[item: T, index: number]>;
		overscan?: number;
		class?: string;
	}

	let {
		items,
		itemHeight,
		height,
		item: itemSnippet,
		overscan = 3,
		class: className = ''
	}: VirtualListProps = $props();

	let scrollTop = $state(0);
	let containerEl = $state<HTMLDivElement | null>(null);

	const totalHeight = $derived(items.length * itemHeight);

	const startIndex = $derived(Math.max(0, Math.floor(scrollTop / itemHeight) - overscan));
	const endIndex = $derived(
		Math.min(items.length - 1, Math.ceil((scrollTop + height) / itemHeight) + overscan)
	);

	const visibleItems = $derived(
		items.slice(startIndex, endIndex + 1).map((it, i) => ({
			item: it,
			index: startIndex + i,
			top: (startIndex + i) * itemHeight
		}))
	);

	function onScroll(e: Event) {
		scrollTop = (e.currentTarget as HTMLDivElement).scrollTop;
	}
</script>

<div
	bind:this={containerEl}
	onscroll={onScroll}
	class={['relative overflow-y-auto', className]}
	style={`height: ${height}px;`}
	role="list"
>
	<!-- Total height spacer -->
	<div style={`height: ${totalHeight}px; position: relative;`}>
		{#each visibleItems as { item: it, index: idx, top } (idx)}
			<div
				role="listitem"
				style={`position: absolute; top: ${top}px; left: 0; right: 0; height: ${itemHeight}px;`}
			>
				{@render itemSnippet(it, idx)}
			</div>
		{/each}
	</div>
</div>
