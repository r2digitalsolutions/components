<script lang="ts">
	import ChipSelect from './ChipSelect.svelte';

	let value = $state(['design', 'svelte']);
</script>

<div class="max-w-md space-y-2">
	<ChipSelect
		label="Interests"
		bind:value
		options={[
			{ id: 'design', label: 'Design' },
			{ id: 'svelte', label: 'Svelte' },
			{ id: 'a11y', label: 'Accessibility' },
			{ id: 'dx', label: 'DX' },
			{ id: 'legacy', label: 'Legacy', disabled: true }
		]}
	/>
	<p class="text-xs text-muted">Selected: {value.join(', ') || 'none'}</p>
</div>
