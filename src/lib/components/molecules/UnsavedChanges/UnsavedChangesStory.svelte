<script lang="ts">
	import UnsavedChanges from './UnsavedChanges.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Toggle from '$lib/components/atoms/Toggle/Toggle.svelte';

	let dirty = $state(true);
</script>

<div class="w-full max-w-lg space-y-3">
	<Toggle bind:checked={dirty} label="Dirty form" />
	<UnsavedChanges {dirty}>
		{#snippet actions()}
			<div class="flex gap-2">
				<Button size="xs" variant="secondary">Discard</Button>
				<Button size="xs">Save</Button>
			</div>
		{/snippet}
	</UnsavedChanges>
</div>
