<script lang="ts">
	import Slider from './Slider.svelte';

	let props = $props<{
		label?: string;
		min?: number;
		max?: number;
		step?: number;
		value?: number;
		disabled?: boolean;
		showValue?: boolean;
		unit?: string;
		size?: 'sm' | 'md' | 'lg';
	}>();
</script>

<div class="w-80 max-w-full">
	<Slider
		label={props.label ?? 'Volume'}
		min={props.min ?? 0}
		max={props.max ?? 100}
		step={props.step ?? 1}
		disabled={props.disabled ?? false}
		showValue={props.showValue ?? true}
		unit={props.unit ?? '%'}
		size={props.size ?? 'md'}
		value={props.value ?? 65}
	/>
</div>
