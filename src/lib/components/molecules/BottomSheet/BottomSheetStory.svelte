<script lang="ts">
	import BottomSheet from './BottomSheet.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	let open = $state(false);
</script>

<Button size="sm" onclick={() => (open = true)}>Open sheet</Button>

<BottomSheet bind:open title="Actions">
	<Text size="sm">Choose an option or dismiss the sheet.</Text>
	{#snippet footer()}
		<div class="flex justify-end gap-2">
			<Button size="sm" variant="ghost" onclick={() => (open = false)}>Cancel</Button>
			<Button size="sm" onclick={() => (open = false)}>Confirm</Button>
		</div>
	{/snippet}
</BottomSheet>
