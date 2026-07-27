<script lang="ts">
	import StickerPicker from './StickerPicker.svelte';

	let last = $state('');
</script>

<div class="max-w-xs space-y-3">
	<p class="text-sm font-semibold text-primary">Sticker picker</p>
	<StickerPicker onselect={(id) => (last = id)} />
	{#if last}
		<p class="text-[11px] text-muted">Selected: {last}</p>
	{/if}
</div>
