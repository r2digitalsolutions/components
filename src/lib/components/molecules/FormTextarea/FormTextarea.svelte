<script lang="ts">
	import Textarea from '$lib/components/atoms/Textarea/Textarea.svelte';
	import { getFormContext } from '$lib/utils/formContext.js';

	interface FormTextareaProps {
		id?: string;
		name?: string;
		label?: string;
		placeholder?: string;
		value?: string;
		status?: 'default' | 'error' | 'success' | 'warning';
		helperText?: string;
		errorMessage?: string;
		disabled?: boolean;
		readonly?: boolean;
		required?: boolean;
		rows?: number;
		maxLength?: number;
		showCount?: boolean;
		autoResize?: boolean;
		/** Sync with `form.data[name]` when inside `<Form>`. */
		bindData?: boolean;
		class?: string;
		oninput?: (e: Event) => void;
		onchange?: (e: Event) => void;
	}

	let {
		id,
		name,
		label,
		placeholder,
		value = $bindable(''),
		status = 'default',
		helperText,
		errorMessage,
		disabled = false,
		readonly = false,
		required = false,
		rows = 3,
		maxLength,
		showCount = false,
		autoResize = false,
		bindData = false,
		class: className = '',
		oninput,
		onchange
	}: FormTextareaProps = $props();

	const form = getFormContext();

	const contextError = $derived(
		errorMessage ?? (name && form ? form.getError(name) : undefined)
	);
	const resolvedStatus = $derived(contextError ? 'error' : status);
	const resolvedHelperText = $derived(contextError ?? helperText);
	const resolvedDisabled = $derived(disabled || Boolean(form?.loading) || Boolean(form?.disabled));

	$effect(() => {
		if (!bindData || !name || !form) return;
		const fromCtx = form.data[name];
		if (fromCtx !== undefined && String(fromCtx) !== value) {
			value = String(fromCtx);
		}
	});

	function handleInput(e: Event) {
		if (bindData && name && form) {
			form.setData(name, (e.currentTarget as HTMLTextAreaElement).value);
			form.clearError(name);
		}
		oninput?.(e);
	}
</script>

<div class={['w-full', className]}>
	<Textarea
		{id}
		{name}
		{label}
		{placeholder}
		disabled={resolvedDisabled}
		{readonly}
		{required}
		{rows}
		{maxLength}
		{showCount}
		{autoResize}
		status={resolvedStatus}
		helperText={resolvedHelperText}
		oninput={handleInput}
		{onchange}
		bind:value
	/>
</div>
