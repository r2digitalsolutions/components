<script lang="ts">
	import DateRangePicker from '$lib/components/molecules/DateRangePicker/DateRangePicker.svelte';
	import FormError from '$lib/components/molecules/FormError/FormError.svelte';
	import FormDescription from '$lib/components/molecules/FormDescription/FormDescription.svelte';
	import {
		getFormContext,
		resolveFormFieldState,
		applyFormDataSync
	} from '$lib/utils/formContext.js';

	export interface FormDateRangeValue {
		start: string;
		end: string;
	}

	interface FormDateRangePickerProps {
		name?: string;
		label?: string;
		placeholder?: string;
		start?: string;
		end?: string;
		min?: string;
		max?: string;
		months?: 1 | 2;
		variant?: 'field' | 'split';
		helperText?: string;
		errorMessage?: string;
		disabled?: boolean;
		bindData?: boolean;
		class?: string;
		onchange?: (value: FormDateRangeValue) => void;
	}

	let {
		name,
		label,
		placeholder = 'Select dates',
		start = $bindable(''),
		end = $bindable(''),
		min,
		max,
		months = 2,
		variant = 'split',
		helperText,
		errorMessage,
		disabled = false,
		bindData = false,
		class: className = '',
		onchange
	}: FormDateRangePickerProps = $props();

	const form = getFormContext();
	const resolved = $derived(
		resolveFormFieldState({ name, errorMessage, helperText, disabled, form })
	);

	$effect(() => {
		if (!bindData || !name || !form) return;
		applyFormDataSync({
			fromCtx: form.data[name],
			getLocal: () => ({ start, end }),
			setLocal: (v) => {
				start = v.start;
				end = v.end;
			},
			map: (raw) => {
				if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
					const range = raw as FormDateRangeValue;
					if (typeof range.start === 'string' && typeof range.end === 'string') {
						return { start: range.start, end: range.end };
					}
				}
				return undefined;
			},
			equals: (a, b) => a.start === b.start && a.end === b.end
		});
	});

	function handleChange(detail: FormDateRangeValue) {
		start = detail.start;
		end = detail.end;
		if (bindData && name && form) {
			form.setData(name, { start: detail.start, end: detail.end });
			form.clearError(name);
		}
		onchange?.(detail);
	}
</script>

<div class={['w-full space-y-1', className]}>
	<DateRangePicker
		{label}
		{placeholder}
		{min}
		{max}
		{months}
		{variant}
		disabled={resolved.disabled}
		bind:start
		bind:end
		onchange={handleChange}
	/>
	{#if resolved.error}
		<FormError message={resolved.error} />
	{:else if helperText}
		<FormDescription text={helperText} />
	{/if}
</div>
