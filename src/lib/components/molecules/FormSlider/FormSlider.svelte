<script lang="ts">
	import Slider from '$lib/components/atoms/Slider/Slider.svelte';
	import FormError from '$lib/components/molecules/FormError/FormError.svelte';
	import FormDescription from '$lib/components/molecules/FormDescription/FormDescription.svelte';
	import {
		getFormContext,
		resolveFormFieldState,
		applyFormDataSync
	} from '$lib/utils/formContext.js';

	interface FormSliderProps {
		id?: string;
		name?: string;
		label?: string;
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		showValue?: boolean;
		valuePosition?: 'header' | 'tooltip';
		showMarks?: boolean;
		unit?: string;
		size?: 'sm' | 'md' | 'lg';
		helperText?: string;
		errorMessage?: string;
		disabled?: boolean;
		bindData?: boolean;
		class?: string;
		onchange?: (value: number) => void;
		oninput?: (value: number) => void;
	}

	let {
		id,
		name,
		label,
		value = $bindable(50),
		min = 0,
		max = 100,
		step = 1,
		showValue = true,
		valuePosition = 'tooltip',
		showMarks = false,
		unit = '',
		size = 'md',
		helperText,
		errorMessage,
		disabled = false,
		bindData = false,
		class: className = '',
		onchange,
		oninput
	}: FormSliderProps = $props();

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

	function push(next: number) {
		value = next;
		if (bindData && name && form) {
			form.setData(name, next);
			form.clearError(name);
		}
	}

	function handleChange(next: number) {
		push(next);
		onchange?.(next);
	}

	function handleInput(next: number) {
		push(next);
		oninput?.(next);
	}
</script>

<div class={['w-full space-y-1', className]}>
	<Slider
		{id}
		{name}
		{label}
		{min}
		{max}
		{step}
		{showValue}
		{valuePosition}
		{showMarks}
		{unit}
		{size}
		disabled={resolved.disabled}
		bind:value
		onchange={handleChange}
		oninput={handleInput}
	/>
	{#if resolved.error}
		<FormError message={resolved.error} />
	{:else if helperText}
		<FormDescription text={helperText} />
	{/if}
</div>
