<script lang="ts">
	import PropertyGroup from './PropertyGroup.svelte';
	import PropertyField from '$lib/components/molecules/PropertyField/PropertyField.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import Toggle from '$lib/components/atoms/Toggle/Toggle.svelte';
	import Slider from '$lib/components/atoms/Slider/Slider.svelte';

	let location = $state('0.0, 0.0, 0.0');
	let rotation = $state('0.0, 0.0, 0.0');
	let visible = $state(true);
	let intensity = $state(1);
</script>

<div class="max-w-xs overflow-hidden rounded border border-border bg-surface-elevated">
	<PropertyGroup title="Transform" open>
		<PropertyField label="Location">
			<Input size="sm" bind:value={location} />
		</PropertyField>
		<PropertyField label="Rotation">
			<Input size="sm" bind:value={rotation} />
		</PropertyField>
	</PropertyGroup>
	<PropertyGroup title="Rendering">
		<PropertyField label="Visible">
			<Toggle bind:checked={visible} size="sm" />
		</PropertyField>
		<PropertyField label="Intensity">
			<Slider bind:value={intensity} min={0} max={5} step={0.1} />
		</PropertyField>
	</PropertyGroup>
</div>
