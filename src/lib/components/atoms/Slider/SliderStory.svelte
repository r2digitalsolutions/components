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
		valuePosition?: 'header' | 'tooltip' | 'inline';
		variant?: 'default' | 'inset';
		showMarks?: boolean;
		unit?: string;
		size?: 'sm' | 'md' | 'lg';
	}>();
</script>

<div class="w-80 max-w-full p-4">
	<Slider
		label={props.label}
		min={props.min ?? 0}
		max={props.max ?? 100}
		step={props.step ?? 1}
		disabled={props.disabled ?? false}
		showValue={props.showValue ?? true}
		valuePosition={props.valuePosition ?? 'tooltip'}
		variant={props.variant ?? 'default'}
		showMarks={props.showMarks ?? true}
		unit={props.unit ?? '%'}
		size={props.size ?? 'md'}
		value={props.value ?? 65}
	/>
</div>
