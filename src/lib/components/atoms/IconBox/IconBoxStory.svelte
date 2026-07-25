<script lang="ts">
	import IconBox from './IconBox.svelte';
	import Cluster from '$lib/components/atoms/Cluster/Cluster.svelte';

	let props = $props<{ tone?: 'brand' | 'neutral' | 'success' | 'warning' | 'error' | 'info' }>();
</script>

<Cluster gap="md">
	{#each ['brand', 'success', 'warning', 'error', 'info', 'neutral'] as tone}
		<IconBox tone={(props.tone ?? tone) as 'brand'} size="md">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
			</svg>
		</IconBox>
	{/each}
</Cluster>
