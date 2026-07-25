<script lang="ts">
	import PropertyField from './PropertyField.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import Toggle from '$lib/components/atoms/Toggle/Toggle.svelte';

	let location = $state('0, 0, 0');
	let visible = $state(true);
</script>

<div class="max-w-xs space-y-0.5 rounded border border-border bg-surface-elevated p-1">
	<PropertyField label="Location">
		<Input size="sm" bind:value={location} />
	</PropertyField>
	<PropertyField label="Visible">
		<Toggle bind:checked={visible} size="sm" />
	</PropertyField>
</div>
