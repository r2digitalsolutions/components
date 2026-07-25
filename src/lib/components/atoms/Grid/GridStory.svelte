<script lang="ts">
	import Grid from './Grid.svelte';

	let props = $props<{ cols?: 1 | 2 | 3 | 4 }>();
</script>

<Grid cols={props.cols ?? 3} gap="md" class="w-full max-w-lg">
	{#each [1, 2, 3, 4, 5, 6] as n}
		<div class="rounded-lg border border-border bg-surface-elevated px-3 py-6 text-center text-sm text-secondary">
			{n}
		</div>
	{/each}
</Grid>
