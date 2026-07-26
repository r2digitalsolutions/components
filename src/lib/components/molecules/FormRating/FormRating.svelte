<script lang="ts">
	import Rating from '$lib/components/atoms/Rating/Rating.svelte';
	import FormLabel from '$lib/components/molecules/FormLabel/FormLabel.svelte';
	import FormError from '$lib/components/molecules/FormError/FormError.svelte';
	import FormDescription from '$lib/components/molecules/FormDescription/FormDescription.svelte';
	import {
		getFormContext,
		resolveFormFieldState,
		applyFormDataSync
	} from '$lib/utils/formContext.js';

	interface FormRatingProps {
		name?: string;
		label?: string;
		value?: number;
		max?: number;
		size?: 'sm' | 'md' | 'lg';
		readonly?: boolean;
		helperText?: string;
		errorMessage?: string;
		disabled?: boolean;
		bindData?: boolean;
		class?: string;
		onchange?: (value: number) => void;
	}

	let {
		name,
		label,
		value = $bindable(0),
		max = 5,
		size = 'md',
		readonly = false,
		helperText,
		errorMessage,
		disabled = false,
		bindData = false,
		class: className = '',
		onchange
	}: FormRatingProps = $props();

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
			map: (raw) => (typeof raw === 'number' ? raw : undefined)
		});
	});

	function handleChange(next: number) {
		value = next;
		if (bindData && name && form) {
			form.setData(name, next);
			form.clearError(name);
		}
		onchange?.(next);
	}
</script>

<div class={['w-full space-y-1.5', className]}>
	{#if label}
		<FormLabel>{label}</FormLabel>
	{/if}
	<Rating
		{max}
		{size}
		readonly={readonly || resolved.disabled}
		bind:value
		onchange={handleChange}
	/>
	{#if resolved.error}
		<FormError message={resolved.error} />
	{:else if helperText}
		<FormDescription text={helperText} />
	{/if}
</div>
