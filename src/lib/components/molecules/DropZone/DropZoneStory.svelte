<script lang="ts">
	import DropZone from './DropZone.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';

	let names = $state<string[]>([]);
</script>

<div class="max-w-lg space-y-3">
	<DropZone
		accept="image/*,.pdf"
		ondropfiles={(files) => {
			names = files.map((f) => f.name);
		}}
	/>
	{#if names.length}
		<div class="flex flex-wrap gap-1.5">
			{#each names as name}
				<Badge size="sm">{name}</Badge>
			{/each}
		</div>
	{/if}
</div>
