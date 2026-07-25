<script lang="ts">
	import ColorSwatch from './ColorSwatch.svelte';

	let selected = $state('#6366f1');
	const palette = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444', '#0ea5e9'];
</script>

<div class="flex flex-wrap items-end gap-3">
	{#each palette as color}
		<ColorSwatch
			{color}
			showValue
			selected={selected === color}
			onclick={() => (selected = color)}
		/>
	{/each}
</div>
