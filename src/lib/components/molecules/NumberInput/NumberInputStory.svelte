<script lang="ts">
	import NumberInput from './NumberInput.svelte';

	let props = $props<{
		min?: number;
		max?: number;
		step?: number;
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
		controls?: 'none' | 'stacked' | 'sides';
	}>();

	let value = $state(3);
</script>

<div class="w-72 max-w-full">
	<NumberInput
		bind:value
		label="Quantity"
		min={props.min ?? 0}
		max={props.max ?? 99}
		step={props.step ?? 1}
		size={props.size ?? 'md'}
		disabled={props.disabled ?? false}
		controls={props.controls ?? 'sides'}
		helperText="Use − / + or type a number"
	/>
</div>
