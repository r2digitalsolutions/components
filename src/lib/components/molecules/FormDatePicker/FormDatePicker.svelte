<script lang="ts">
	import DatePicker from '$lib/components/molecules/DatePicker/DatePicker.svelte';
	import FormError from '$lib/components/molecules/FormError/FormError.svelte';
	import FormDescription from '$lib/components/molecules/FormDescription/FormDescription.svelte';
	import {
		getFormContext,
		resolveFormFieldState,
		applyFormDataSync
	} from '$lib/utils/formContext.js';

	interface FormDatePickerProps {
		name?: string;
		label?: string;
		placeholder?: string;
		value?: string;
		min?: string;
		max?: string;
		helperText?: string;
		errorMessage?: string;
		disabled?: boolean;
		bindData?: boolean;
		/** BCP 47 locale for the calendar and displayed date. */
		locale?: string;
		class?: string;
		onchange?: (value: string) => void;
	}

	let {
		name,
		label,
		placeholder = 'Select date…',
		value = $bindable(''),
		min,
		max,
		helperText,
		errorMessage,
		disabled = false,
		bindData = false,
		locale,
		class: className = '',
		onchange
	}: FormDatePickerProps = $props();

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

	function handleChange(detail: { value: string }) {
		value = detail.value;
		if (bindData && name && form) {
			form.setData(name, detail.value);
			form.clearError(name);
		}
		onchange?.(detail.value);
	}
</script>

<div class={['w-full space-y-1', className]}>
	<DatePicker
		{label}
		{placeholder}
		{min}
		{max}
		{locale}
		disabled={resolved.disabled}
		bind:value
		onchange={handleChange}
	/>
	{#if resolved.error}
		<FormError message={resolved.error} />
	{:else if helperText}
		<FormDescription text={helperText} />
	{/if}
</div>
