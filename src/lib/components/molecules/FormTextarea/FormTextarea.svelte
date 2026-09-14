<script lang="ts">
	import Textarea from '$lib/components/atoms/Textarea/Textarea.svelte';
	import {
		getFormContext,
		resolveFormFieldState,
		resolveRemoteInputProps,
		parseRemoteFieldName,
		applyFormDataSync
	} from '$lib/utils/formContext.js';

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
	const parsed = $derived(parseRemoteFieldName(name));
	const logicalName = $derived(parsed.logicalName);
	const htmlName = $derived.by(() => {
		if (parsed.isEncoded) return parsed.htmlName;
		return resolveRemoteInputProps(form?.remoteFormId, name, 'text').name;
	});
	const resolved = $derived(
		resolveFormFieldState({
			name: logicalName,
			errorMessage,
			helperText,
			status,
			disabled,
			form
		})
	);

	$effect(() => {
		if (!bindData || !logicalName || !form) return;
		applyFormDataSync({
			fromCtx: form.data[logicalName],
			getLocal: () => value,
			setLocal: (v) => {
				value = v;
			},
			map: (raw) => (raw !== undefined ? String(raw) : undefined)
		});
	});

	function handleInput(e: Event) {
		if (bindData && logicalName && form) {
			form.setData(logicalName, (e.currentTarget as HTMLTextAreaElement).value);
			form.clearError(logicalName);
		}
		oninput?.(e);
	}
</script>

<div class={['w-full', className]}>
	<Textarea
		{id}
		name={htmlName}
		{label}
		{placeholder}
		disabled={resolved.disabled}
		{readonly}
		{required}
		{rows}
		{maxLength}
		{showCount}
		{autoResize}
		status={resolved.status}
		helperText={resolved.helperText}
		oninput={handleInput}
		{onchange}
		bind:value
	/>
</div>
