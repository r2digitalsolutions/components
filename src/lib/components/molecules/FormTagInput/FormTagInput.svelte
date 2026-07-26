<script lang="ts">
	import TagInput from '$lib/components/molecules/TagInput/TagInput.svelte';
	import FormError from '$lib/components/molecules/FormError/FormError.svelte';
	import FormDescription from '$lib/components/molecules/FormDescription/FormDescription.svelte';
	import {
		getFormContext,
		resolveFormFieldState,
		applyFormDataSync,
		sameStringArray
	} from '$lib/utils/formContext.js';

	interface FormTagInputProps {
		name?: string;
		label?: string;
		placeholder?: string;
		value?: string[];
		max?: number;
		helperText?: string;
		errorMessage?: string;
		disabled?: boolean;
		bindData?: boolean;
		class?: string;
		onchange?: (tags: string[]) => void;
	}

	let {
		name,
		label,
		placeholder = 'Add tag and press Enter',
		value = $bindable<string[]>([]),
		max,
		helperText,
		errorMessage,
		disabled = false,
		bindData = false,
		class: className = '',
		onchange
	}: FormTagInputProps = $props();

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
	<TagInput
		{label}
		{placeholder}
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
