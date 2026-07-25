<script lang="ts">
	import MultiSelect, {
		type MultiSelectOption
	} from '$lib/components/molecules/MultiSelect/MultiSelect.svelte';
	import FormError from '$lib/components/molecules/FormError/FormError.svelte';
	import FormDescription from '$lib/components/molecules/FormDescription/FormDescription.svelte';
	import {
		getFormContext,
		resolveFormFieldState,
		applyFormDataSync,
		sameStringArray
	} from '$lib/utils/formContext.js';

	interface FormMultiSelectProps {
		name?: string;
		label?: string;
		placeholder?: string;
		options?: MultiSelectOption[];
		value?: string[];
		searchable?: boolean;
		max?: number;
		emptyText?: string;
		helperText?: string;
		errorMessage?: string;
		disabled?: boolean;
		bindData?: boolean;
		class?: string;
		onchange?: (value: string[]) => void;
	}

	let {
		name,
		label,
		placeholder = 'Select…',
		options = [],
		value = $bindable<string[]>([]),
		searchable = true,
		max,
		emptyText = 'No options found',
		helperText,
		errorMessage,
		disabled = false,
		bindData = false,
		class: className = '',
		onchange
	}: FormMultiSelectProps = $props();

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
			map: (raw) => (Array.isArray(raw) ? [...(raw as string[])] : undefined),
			equals: sameStringArray
		});
	});

	function handleChange(next: string[]) {
		value = next;
		if (bindData && name && form) {
			form.setData(name, next);
			form.clearError(name);
		}
		onchange?.(next);
	}
</script>

<div class={['w-full space-y-1', className]}>
	<MultiSelect
		{label}
		{placeholder}
		{options}
		{searchable}
		{max}
		{emptyText}
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
