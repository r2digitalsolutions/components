<script lang="ts">
	import Combobox, {
		type ComboboxOption
	} from '$lib/components/molecules/Combobox/Combobox.svelte';
	import FormError from '$lib/components/molecules/FormError/FormError.svelte';
	import FormDescription from '$lib/components/molecules/FormDescription/FormDescription.svelte';
	import {
		getFormContext,
		resolveFormFieldState,
		applyFormDataSync
	} from '$lib/utils/formContext.js';

	interface FormComboboxProps {
		name?: string;
		label?: string;
		placeholder?: string;
		options?: ComboboxOption[];
		value?: string;
		query?: string;
		creatable?: boolean;
		emptyText?: string;
		createText?: (query: string) => string;
		helperText?: string;
		errorMessage?: string;
		disabled?: boolean;
		bindData?: boolean;
		class?: string;
		onchange?: (value: string) => void;
		oncreate?: (value: string) => void;
	}

	let {
		name,
		label,
		placeholder = 'Search…',
		options = [],
		value = $bindable(''),
		query = $bindable(''),
		creatable = false,
		emptyText = 'No results',
		createText,
		helperText,
		errorMessage,
		disabled = false,
		bindData = false,
		class: className = '',
		onchange,
		oncreate
	}: FormComboboxProps = $props();

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

	function handleChange(next: string) {
		value = next;
		if (bindData && name && form) {
			form.setData(name, next);
			form.clearError(name);
		}
		onchange?.(next);
	}
</script>

<div class="w-full space-y-1">
	<Combobox
		class={className}
		{label}
		{placeholder}
		{options}
		{creatable}
		{emptyText}
		createText={createText ?? ((q) => `Create “${q}”`)}
		disabled={resolved.disabled}
		bind:value
		bind:query
		onchange={handleChange}
		{oncreate}
	/>
	{#if resolved.error}
		<FormError message={resolved.error} />
	{:else if helperText}
		<FormDescription text={helperText} />
	{/if}
</div>
