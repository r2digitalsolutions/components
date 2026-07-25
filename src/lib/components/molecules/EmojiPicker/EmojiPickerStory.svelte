<script lang="ts">
	import EmojiPicker from './EmojiPicker.svelte';

	let selected = $state('');
</script>

<div class="space-y-3">
	<EmojiPicker onselect={(e) => (selected = e)} />
	{#if selected}
		<p class="text-sm text-secondary">Selected: <span class="text-2xl">{selected}</span></p>
	{/if}
</div>
