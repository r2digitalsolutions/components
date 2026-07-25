<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import ActionSheet from './ActionSheet.svelte';

	let open = $state(false);
	let last = $state('');
</script>

<div class="space-y-3">
	<Button onclick={() => (open = true)}>Open action sheet</Button>
	{#if last}
		<p class="text-sm text-secondary">Selected: <span class="font-medium text-primary">{last}</span></p>
	{/if}
</div>

<ActionSheet
	bind:open
	title="Photo options"
	message="Choose how you want to continue"
	actions={[
		{ id: 'camera', label: 'Take photo' },
		{ id: 'library', label: 'Choose from library' },
		{ id: 'delete', label: 'Delete photo', variant: 'destructive' }
	]}
	onselect={(id) => (last = id)}
/>
