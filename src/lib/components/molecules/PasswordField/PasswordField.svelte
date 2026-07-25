<script lang="ts">
	import PasswordInput from '$lib/components/molecules/PasswordInput/PasswordInput.svelte';
	import PasswordStrength from '$lib/components/molecules/PasswordStrength/PasswordStrength.svelte';
	import FieldHint from '$lib/components/atoms/FieldHint/FieldHint.svelte';

	interface PasswordFieldProps {
		value?: string;
		label?: string;
		placeholder?: string;
		required?: boolean;
		disabled?: boolean;
		showStrength?: boolean;
		hint?: string;
		class?: string;
	}

	let {
		value = $bindable(''),
		label = 'Password',
		placeholder = '••••••••',
		required = false,
		disabled = false,
		showStrength = true,
		hint,
		class: className = ''
	}: PasswordFieldProps = $props();
</script>

<div class={['w-full space-y-2', className]}>
	<PasswordInput bind:value {label} {placeholder} {required} {disabled} />
	{#if showStrength}
		<PasswordStrength password={value} />
	{/if}
	{#if hint}
		<FieldHint text={hint} tone="muted" />
	{/if}
</div>
