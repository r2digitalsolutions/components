<script lang="ts">
	import CurrencyInput from './CurrencyInput.svelte';

	let props = $props<{
		currency?: string;
		locale?: string;
		label?: string;
		disabled?: boolean;
		status?: 'default' | 'error' | 'success' | 'warning';
		helperText?: string;
		size?: 'sm' | 'md' | 'lg';
		min?: number;
		max?: number;
	}>();

	let value = $state(1250.0);
</script>

<div class="w-64 max-w-full p-6 flex flex-col gap-4">
	<CurrencyInput
		currency={props.currency ?? 'USD'}
		locale={props.locale ?? 'en-US'}
		label={props.label ?? 'Amount'}
		disabled={props.disabled ?? false}
		status={props.status ?? 'default'}
		helperText={props.helperText}
		size={props.size ?? 'md'}
		min={props.min}
		max={props.max}
		bind:value
	/>
	<p class="text-xs text-muted font-mono">Value: {value}</p>
</div>
