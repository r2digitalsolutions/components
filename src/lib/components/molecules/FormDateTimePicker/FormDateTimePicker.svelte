<script lang="ts">
	import DateTimePicker from '$lib/components/molecules/DateTimePicker/DateTimePicker.svelte';
	import FormError from '$lib/components/molecules/FormError/FormError.svelte';
	import FormDescription from '$lib/components/molecules/FormDescription/FormDescription.svelte';
	import {
		getFormContext,
		resolveFormFieldState,
		applyFormDataSync
	} from '$lib/utils/formContext.js';

	interface FormDateTimePickerProps {
		name?: string;
		label?: string;
		placeholder?: string;
		value?: string;
		date?: string;
		time?: string;
		min?: string;
		max?: string;
		helperText?: string;
		errorMessage?: string;
		disabled?: boolean;
		bindData?: boolean;
		class?: string;
		onchange?: (detail: { date: string; time: string; value: string }) => void;
	}

	let {
		name,
		label,
		placeholder = 'Select date & time',
		value = $bindable(''),
		date = $bindable(''),
		time = $bindable(''),
		min,
		max,
		helperText,
		errorMessage,
		disabled = false,
		bindData = false,
		class: className = '',
		onchange
	}: FormDateTimePickerProps = $props();

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

	function handleChange(detail: { date: string; time: string; value: string }) {
		date = detail.date;
		time = detail.time;
		value = detail.value;
		if (bindData && name && form) {
			form.setData(name, detail.value);
			form.clearError(name);
		}
		onchange?.(detail);
	}
</script>

<div class={['w-full space-y-1', className]}>
	<DateTimePicker
		{label}
		{placeholder}
		{min}
		{max}
		disabled={resolved.disabled}
		bind:value
		bind:date
		bind:time
		onchange={handleChange}
	/>
	{#if resolved.error}
		<FormError message={resolved.error} />
	{:else if helperText}
		<FormDescription text={helperText} />
	{/if}
</div>
