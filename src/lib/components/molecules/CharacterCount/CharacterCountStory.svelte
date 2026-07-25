<script lang="ts">
	import Textarea from '$lib/components/atoms/Textarea/Textarea.svelte';
	import CharacterCount from './CharacterCount.svelte';

	let value = $state('A short note about the product launch.');
</script>

<div class="max-w-md space-y-2">
	<Textarea bind:value label="Bio" rows={3} />
	<div class="flex justify-end">
		<CharacterCount {value} max={120} mode="both" />
	</div>
</div>
