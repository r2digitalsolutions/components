<script lang="ts">
	import RangeSlider from '$lib/components/atoms/RangeSlider/RangeSlider.svelte';
	import FormError from '$lib/components/molecules/FormError/FormError.svelte';
	import FormDescription from '$lib/components/molecules/FormDescription/FormDescription.svelte';
	import {
		getFormContext,
		resolveFormFieldState,
		applyFormDataSync
	} from '$lib/utils/formContext.js';

	type RangeValue = [number, number];

	interface FormRangeSliderProps {
		id?: string;
		name?: string;
		label?: string;
		value?: RangeValue;
		min?: number;
		max?: number;
		step?: number;
		showValue?: boolean;
		unit?: string;
		size?: 'sm' | 'md' | 'lg';
		helperText?: string;
		errorMessage?: string;
		disabled?: boolean;
		bindData?: boolean;
		class?: string;
		onchange?: (value: RangeValue) => void;
		oninput?: (value: RangeValue) => void;
	}

	let {
		id,
		name,
		label,
		value = $bindable<[number, number]>([20, 80]),
		min = 0,
		max = 100,
		step = 1,
		showValue = true,
		unit = '',
		size = 'md',
		helperText,
		errorMessage,
		disabled = false,
		bindData = false,
		class: className = '',
		onchange,
		oninput
	}: FormRangeSliderProps = $props();

	const form = getFormContext();
	const resolved = $derived(
		resolveFormFieldState({ name, errorMessage, helperText, disabled, form })
	);

	function sameRange(a: RangeValue, b: RangeValue) {
		return a[0] === b[0] && a[1] === b[1];
	}

	$effect(() => {
		if (!bindData || !name || !form) return;
		applyFormDataSync({
			fromCtx: form.data[name],
			getLocal: () => value,
			setLocal: (v) => {
				value = v;
			},
			map: (raw) => {
				if (Array.isArray(raw) && raw.length === 2) {
					const a = Number(raw[0]);
					const b = Number(raw[1]);
					if (Number.isFinite(a) && Number.isFinite(b)) return [a, b] as RangeValue;
				}
				return undefined;
			},
			equals: sameRange
		});
	});

	function push(next: RangeValue) {
		value = next;
		if (bindData && name && form) {
			form.setData(name, next);
			form.clearError(name);
		}
	}

	function handleChange(next: RangeValue) {
		push(next);
		onchange?.(next);
	}

	function handleInput(next: RangeValue) {
		push(next);
		oninput?.(next);
	}
</script>

<div class={['w-full space-y-1', className]}>
	<RangeSlider
		{id}
		{label}
		{min}
		{max}
		{step}
		{showValue}
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
