<script lang="ts">
	import ChipSelect, {
		type ChipSelectOption
	} from '$lib/components/molecules/ChipSelect/ChipSelect.svelte';
	import FormError from '$lib/components/molecules/FormError/FormError.svelte';
	import FormDescription from '$lib/components/molecules/FormDescription/FormDescription.svelte';
	import {
		getFormContext,
		resolveFormFieldState,
		applyFormDataSync,
		sameStringArray
	} from '$lib/utils/formContext.js';

	interface FormChipSelectProps {
		name?: string;
		label?: string;
		options?: ChipSelectOption[];
		value?: string[];
		multiple?: boolean;
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
		options = [],
		value = $bindable<string[]>([]),
		multiple = true,
		helperText,
		errorMessage,
		disabled = false,
		bindData = false,
		class: className = '',
		onchange
	}: FormChipSelectProps = $props();

	const form = getFormContext();
	const resolved = $derived(
		resolveFormFieldState({ name, errorMessage, helperText, disabled, form })
	);

	const resolvedOptions = $derived(
		disabled || resolved.disabled
			? options.map((o) => ({ ...o, disabled: true }))
			: options
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
	<ChipSelect
		{label}
		{multiple}
		options={resolvedOptions}
		bind:value
		onchange={handleChange}
	/>
	{#if resolved.error}
		<FormError message={resolved.error} />
	{:else if helperText}
		<FormDescription text={helperText} />
	{/if}
</div>
