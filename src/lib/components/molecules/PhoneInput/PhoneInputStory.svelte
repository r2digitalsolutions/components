<script lang="ts">
	import PhoneInput from './PhoneInput.svelte';

	let props = $props<{
		countryCode?: string;
		label?: string;
		disabled?: boolean;
		status?: 'default' | 'error' | 'success' | 'warning';
		helperText?: string;
		size?: 'sm' | 'md' | 'lg';
	}>();

	let value = $state('');
	let rawValue = $state('');
</script>

<div class="w-72 max-w-full p-6 flex flex-col gap-4">
	<PhoneInput
		countryCode={props.countryCode ?? '+1'}
		label={props.label ?? 'Phone Number'}
		disabled={props.disabled ?? false}
		status={props.status ?? 'default'}
		helperText={props.helperText}
		size={props.size ?? 'md'}
		bind:value
		bind:rawValue
	/>
	<p class="text-xs text-muted font-mono">Masked: {value}</p>
	<p class="text-xs text-muted font-mono">Raw digits: {rawValue}</p>
</div>
