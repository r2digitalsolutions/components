<script lang="ts">
	import PhoneInput from '$lib/components/molecules/PhoneInput/PhoneInput.svelte';
	import {
		getFormContext,
		resolveFormFieldState,
		applyFormDataSync
	} from '$lib/utils/formContext.js';

	interface FormPhoneInputProps {
		id?: string;
		name?: string;
		label?: string;
		value?: string;
		rawValue?: string;
		countryCode?: string;
		helperText?: string;
		errorMessage?: string;
		disabled?: boolean;
		size?: 'sm' | 'md' | 'lg';
		bindData?: boolean;
		class?: string;
		onchange?: (masked: string, raw: string) => void;
	}

	let {
		id,
		name,
		label = 'Phone',
		value = $bindable(''),
		rawValue = $bindable(''),
		countryCode = '+1',
		helperText,
		errorMessage,
		disabled = false,
		size = 'md',
		bindData = false,
		class: className = '',
		onchange
	}: FormPhoneInputProps = $props();

	const form = getFormContext();
	const resolved = $derived(
		resolveFormFieldState({ name, errorMessage, helperText, disabled, form })
	);

	$effect(() => {
		if (!bindData || !name || !form) return;
		applyFormDataSync({
			fromCtx: form.data[name],
			getLocal: () => value,
			setLocal: (v) => {
				value = v;
			},
			map: (raw) => (raw !== undefined ? String(raw) : undefined)
		});
	});

	function handleChange(masked: string, raw: string) {
		value = masked;
		rawValue = raw;
		if (bindData && name && form) {
			form.setData(name, masked);
			form.clearError(name);
		}
		onchange?.(masked, raw);
	}
</script>

<div class={['w-full', className]}>
	<PhoneInput
		{id}
		{label}
		{countryCode}
		{size}
		disabled={resolved.disabled}
		status={resolved.status}
		helperText={resolved.helperText}
		bind:value
		bind:rawValue
		onchange={handleChange}
	/>
</div>
