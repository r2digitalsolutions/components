<script lang="ts">
	import Overlay from './Overlay.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	let open = $state(true);
</script>

<div class="relative h-40 overflow-hidden rounded-xl border border-border bg-surface-elevated p-4">
	<p class="text-sm text-secondary">Content behind the overlay</p>
	{#if open}
		<Overlay placement="absolute" zIndex="1" onclick={() => (open = false)} />
	{:else}
		<Button size="sm" class="mt-3" onclick={() => (open = true)}>Show overlay</Button>
	{/if}
</div>
