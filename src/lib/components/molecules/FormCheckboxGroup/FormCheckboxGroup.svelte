<script lang="ts">
	import CheckboxGroup, {
		type CheckboxOption
	} from '$lib/components/molecules/CheckboxGroup/CheckboxGroup.svelte';
	import FormError from '$lib/components/molecules/FormError/FormError.svelte';
	import FormDescription from '$lib/components/molecules/FormDescription/FormDescription.svelte';
	import {
		getFormContext,
		resolveFormFieldState,
		applyFormDataSync,
		sameStringArray
	} from '$lib/utils/formContext.js';

	interface FormCheckboxGroupProps {
		name?: string;
		label?: string;
		options?: CheckboxOption[];
		value?: string[];
		orientation?: 'vertical' | 'horizontal';
		size?: 'sm' | 'md' | 'lg';
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
		orientation = 'vertical',
		size = 'md',
		helperText,
		errorMessage,
		disabled = false,
		bindData = false,
		class: className = '',
		onchange
	}: FormCheckboxGroupProps = $props();

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
	<CheckboxGroup
		{name}
		{label}
		{options}
		{orientation}
		{size}
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
