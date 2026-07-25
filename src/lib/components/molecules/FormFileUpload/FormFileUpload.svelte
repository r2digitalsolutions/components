<script lang="ts">
	import DropZone from '$lib/components/molecules/DropZone/DropZone.svelte';
	import FormError from '$lib/components/molecules/FormError/FormError.svelte';
	import FormDescription from '$lib/components/molecules/FormDescription/FormDescription.svelte';
	import {
		getFormContext,
		resolveFormFieldState,
		applyFormDataSync
	} from '$lib/utils/formContext.js';

	interface FormFileUploadProps {
		name?: string;
		label?: string;
		hint?: string;
		accept?: string;
		multiple?: boolean;
		maxFiles?: number;
		maxSizeMb?: number;
		showPreview?: boolean;
		files?: File[];
		helperText?: string;
		errorMessage?: string;
		disabled?: boolean;
		bindData?: boolean;
		class?: string;
		onchange?: (files: File[]) => void;
		ondropfiles?: (files: File[]) => void;
		onremove?: (file: File) => void;
	}

	let {
		name,
		label = 'Drop files here',
		hint = 'or click to browse',
		accept,
		multiple = true,
		maxFiles,
		maxSizeMb = 25,
		showPreview = true,
		files = $bindable([] as File[]),
		helperText,
		errorMessage,
		disabled = false,
		bindData = false,
		class: className = '',
		onchange,
		ondropfiles,
		onremove
	}: FormFileUploadProps = $props();

	const form = getFormContext();
	const resolved = $derived(
		resolveFormFieldState({ name, errorMessage, helperText, disabled, form })
	);

	$effect(() => {
		if (!bindData || !name || !form) return;
		applyFormDataSync({
			fromCtx: form.data[name],
			getLocal: () => files,
			setLocal: (v) => {
				files = v;
			},
			map: (raw) => (Array.isArray(raw) ? (raw as File[]) : undefined)
		});
	});

	function handleChange(next: File[]) {
		files = next;
		if (bindData && name && form) {
			form.setData(name, next);
			form.clearError(name);
		}
		onchange?.(next);
	}
</script>

<div class={['w-full space-y-1', className]}>
	<DropZone
		{label}
		{hint}
		{accept}
		{multiple}
		{maxFiles}
		{maxSizeMb}
		{showPreview}
		disabled={resolved.disabled}
		bind:files
		onchange={handleChange}
		{ondropfiles}
		{onremove}
	/>
	{#if resolved.error}
		<FormError message={resolved.error} />
	{:else if helperText}
		<FormDescription text={helperText} />
	{/if}
</div>
