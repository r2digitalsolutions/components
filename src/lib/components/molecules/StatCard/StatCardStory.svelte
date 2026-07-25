<script lang="ts">
	import StatCard from './StatCard.svelte';

	let props = $props<{
		label?: string;
		value?: string;
		delta?: string;
		trend?: 'up' | 'down' | 'neutral';
		badge?: string;
	}>();
</script>

<div class="grid max-w-3xl gap-4 sm:grid-cols-3">
	<StatCard
		label={props.label ?? 'Revenue'}
		value={props.value ?? '$48.2k'}
		delta={props.delta ?? '+12.4%'}
		trend={props.trend ?? 'up'}
		badge={props.badge ?? 'Live'}
		description="vs last month"
	>
		{#snippet icon()}
			<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v1m0 10v1m9-7a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
		{/snippet}
	</StatCard>
	<StatCard label="Users" value="12,480" delta="+3.1%" trend="up" description="active" />
	<StatCard label="Churn" value="1.8%" delta="-0.4%" trend="down" badge="Good" badgeVariant="success" />
</div>
