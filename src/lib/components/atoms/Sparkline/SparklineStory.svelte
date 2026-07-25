<script lang="ts">
	import Sparkline from './Sparkline.svelte';
	import StatCard from '$lib/components/molecules/StatCard/StatCard.svelte';

	let props = $props<{ tone?: 'brand' | 'success' | 'warning' | 'error' | 'neutral' }>();
</script>

<div class="grid max-w-2xl gap-4 sm:grid-cols-2">
	<StatCard label="Active users" value="12.4k" delta="+3.1%" trend="up">
		{#snippet icon()}
			<Sparkline
				data={[4, 6, 5, 8, 7, 10, 9, 12, 11, 14]}
				tone={props.tone ?? 'brand'}
				width={96}
				height={28}
			/>
		{/snippet}
	</StatCard>
	<StatCard label="Churn" value="1.8%" delta="-0.4%" trend="down">
		{#snippet icon()}
			<Sparkline data={[9, 8, 8, 7, 6, 7, 5, 5, 4, 3]} tone="success" width={96} height={28} />
		{/snippet}
	</StatCard>
</div>
