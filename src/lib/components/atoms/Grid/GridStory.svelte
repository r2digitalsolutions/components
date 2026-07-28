<script lang="ts">
	import Grid from './Grid.svelte';

	type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
	type GridColsConfig =
		| GridCols
		| {
				base?: GridCols;
				sm?: GridCols;
				md?: GridCols;
				lg?: GridCols;
				xl?: GridCols;
				'2xl'?: GridCols;
		  };

	let props = $props<{ cols?: GridColsConfig }>();
</script>

<Grid cols={props.cols ?? 3} gap="md" class="w-full max-w-3xl">
	{#each [1, 2, 3, 4, 5, 6] as n}
		<div
			class="rounded-lg border border-border bg-surface-elevated px-3 py-6 text-center text-sm text-secondary"
		>
			{n}
		</div>
	{/each}
</Grid>
