<script lang="ts">
	import Select, {
		type SelectOption
	} from '$lib/components/molecules/Select/Select.svelte';
	import {
		getFormContext,
		resolveFormFieldState,
		resolveRemoteInputProps,
		parseRemoteFieldName,
		applyFormDataSync
	} from '$lib/utils/formContext.js';

	interface FormSelectProps {
		id?: string;
		name?: string;
		label?: string;
		placeholder?: string;
		options?: SelectOption[];
		value?: string;
		status?: 'default' | 'error' | 'success' | 'warning';
		helperText?: string;
		errorMessage?: string;
		disabled?: boolean;
		required?: boolean;
		searchable?: boolean;
		size?: 'sm' | 'md' | 'lg';
		/** Min width (px) of the open listbox — see Select `listboxMinWidth`. */
		listboxMinWidth?: number;
		/** Sync with `form.data[name]` when inside `<Form>`. */
		bindData?: boolean;
		class?: string;
		onchange?: (value: string) => void;
	}

	let {
		id,
		name,
		label,
		placeholder = 'Select an option...',
		options = [],
		value = $bindable(''),
		status = 'default',
		helperText,
		errorMessage,
		disabled = false,
		required = false,
		searchable = false,
		size = 'md',
		listboxMinWidth,
		bindData = false,
		class: className = '',
		onchange
	}: FormSelectProps = $props();

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

	function handleChange(next: string) {
		value = next;
		if (bindData && logicalName && form) {
			form.setData(logicalName, next);
			form.clearError(logicalName);
		}
		onchange?.(next);
	}
</script>

<div class={['w-full', className]}>
	<Select
		{id}
		name={htmlName}
		{label}
		{placeholder}
		{options}
		disabled={resolved.disabled}
		{required}
		{searchable}
		{size}
		{listboxMinWidth}
		status={resolved.status}
		helperText={resolved.helperText}
		bind:value
		onchange={handleChange}
	/>
</div>
