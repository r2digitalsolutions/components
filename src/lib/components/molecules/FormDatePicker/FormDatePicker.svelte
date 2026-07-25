<script lang="ts">
	import DatePicker from '$lib/components/molecules/DatePicker/DatePicker.svelte';
	import FormError from '$lib/components/molecules/FormError/FormError.svelte';
	import FormDescription from '$lib/components/molecules/FormDescription/FormDescription.svelte';
	import {
		getFormContext,
		resolveFormFieldState
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
		class: className = '',
		onchange
	}: FormDatePickerProps = $props();

	const form = getFormContext();
	const resolved = $derived(
		resolveFormFieldState({ name, errorMessage, helperText, disabled, form })
	);

	$effect(() => {
		if (!bindData || !name || !form) return;
		const fromCtx = form.data[name];
		if (fromCtx !== undefined && String(fromCtx) !== value) {
			value = String(fromCtx);
		}
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
