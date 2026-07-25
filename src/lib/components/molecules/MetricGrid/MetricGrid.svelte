<script lang="ts">
	import type { Snippet } from 'svelte';
	import Grid from '$lib/components/atoms/Grid/Grid.svelte';
	import StatCard from '$lib/components/molecules/StatCard/StatCard.svelte';
	import type { StatCardTrend } from '$lib/components/molecules/StatCard/StatCard.svelte';

	export interface MetricItem {
		id: string;
		label: string;
		value: string | number;
		delta?: string;
		trend?: StatCardTrend;
		description?: string;
		badge?: string;
	}

	interface MetricGridProps {
		items?: MetricItem[];
		cols?: 1 | 2 | 3 | 4;
		class?: string;
		/** Optional custom card renderer */
		children?: Snippet<[MetricItem]>;
	}

	const { items = [], cols = 3, class: className = '', children }: MetricGridProps = $props();

	const responsive = $derived(
		cols === 1
			? ''
			: cols === 2
				? 'sm:grid-cols-2'
				: cols === 4
					? 'sm:grid-cols-2 lg:grid-cols-4'
					: 'sm:grid-cols-2 lg:grid-cols-3'
	);
</script>

<Grid cols={1} gap="md" class={[responsive, className].filter(Boolean).join(' ')}>
	{#each items as item (item.id)}
		{#if children}
			{@render children(item)}
		{:else}
			<StatCard
				label={item.label}
				value={item.value}
				delta={item.delta}
				trend={item.trend}
				description={item.description}
				badge={item.badge}
			/>
		{/if}
	{/each}
</Grid>
