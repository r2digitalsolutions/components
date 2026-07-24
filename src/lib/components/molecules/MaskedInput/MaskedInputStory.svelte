<script lang="ts">
	import MaskedInput from './MaskedInput.svelte';

	let props = $props<{
		mask?: string;
		label?: string;
		disabled?: boolean;
		status?: 'default' | 'error' | 'success' | 'warning';
		helperText?: string;
		size?: 'sm' | 'md' | 'lg';
	}>();

	let value = $state('');
	let rawValue = $state('');
</script>

<div class="w-80 max-w-full p-6 flex flex-col gap-4">
	<MaskedInput
		mask={props.mask ?? '(###) ###-####'}
		label={props.label ?? 'Phone Number'}
		disabled={props.disabled ?? false}
		status={props.status ?? 'default'}
		helperText={props.helperText}
		size={props.size ?? 'md'}
		bind:value
		bind:rawValue
	/>
	<p class="text-xs text-muted font-mono">Masked: {value}</p>
	<p class="text-xs text-muted font-mono">Raw: {rawValue}</p>
</div>
