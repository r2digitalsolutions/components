<script lang="ts">
	import PropertyField from './PropertyField.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import Toggle from '$lib/components/atoms/Toggle/Toggle.svelte';
	import Slider from '$lib/components/atoms/Slider/Slider.svelte';

	const DEFAULT_OPACITY = 1;
	let location = $state('0, 0, 0');
	let visible = $state(true);
	let opacity = $state(0.65);
</script>

<div class="max-w-xs space-y-0.5 rounded border border-border bg-surface-elevated p-1">
	<PropertyField label="Location">
		<Input size="sm" bind:value={location} />
	</PropertyField>
	<PropertyField label="Visible">
		<Toggle bind:checked={visible} size="sm" />
	</PropertyField>
	<PropertyField
		label="Opacity"
		modified={opacity !== DEFAULT_OPACITY}
		onreset={() => (opacity = DEFAULT_OPACITY)}
	>
		<Slider
			size="sm"
			min={0}
			max={1}
			step={0.01}
			bind:value={opacity}
			showValue
			valuePosition="header"
		/>
	</PropertyField>
	<p class="px-1 pt-1 text-[10px] text-muted">
		Amber reset icon appears when a value differs from its default (Unreal-style).
	</p>
</div>
