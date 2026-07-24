<script lang="ts">
	import RangeSlider from './RangeSlider.svelte';

	let props = $props<{
		label?: string;
		min?: number;
		max?: number;
		step?: number;
		disabled?: boolean;
		showValue?: boolean;
		unit?: string;
		size?: 'sm' | 'md' | 'lg';
	}>();

	let value = $state<[number, number]>([20, 80]);
</script>

<div class="w-96 max-w-full p-6 flex flex-col gap-6">
	<RangeSlider
		label={props.label ?? 'Price Range'}
		min={props.min ?? 0}
		max={props.max ?? 100}
		step={props.step ?? 1}
		disabled={props.disabled ?? false}
		showValue={props.showValue ?? true}
		unit={props.unit ?? '$'}
		size={props.size ?? 'md'}
		bind:value
	/>
	<p class="text-xs text-muted font-mono">Value: [{value[0]}, {value[1]}]</p>
</div>
