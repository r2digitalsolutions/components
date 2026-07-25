<script lang="ts">
	import InfiniteScroll from './InfiniteScroll.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	let items = $state(Array.from({ length: 8 }, (_, i) => i + 1));
	let loading = $state(false);
	let hasMore = $state(true);

	function loadMore() {
		if (loading || !hasMore) return;
		loading = true;
		setTimeout(() => {
			const start = items.length + 1;
			items = [...items, ...Array.from({ length: 6 }, (_, i) => start + i)];
			loading = false;
			if (items.length >= 30) hasMore = false;
		}, 600);
	}
</script>

<div class="max-h-72 max-w-sm overflow-y-auto rounded-xl border border-border">
	<InfiniteScroll {loading} {hasMore} onloadmore={loadMore}>
		<ul class="divide-y divide-border">
			{#each items as n}
				<li class="px-3 py-2.5">
					<Text size="sm">Item {n}</Text>
				</li>
			{/each}
		</ul>
	</InfiniteScroll>
</div>
