<script lang="ts">
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import type { Snippet } from 'svelte';

	interface FormFieldProps {
		id?: string;
		name?: string;
		label?: string;
		placeholder?: string;
		value?: string;
		type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
		status?: 'default' | 'error' | 'success' | 'warning';
		helperText?: string;
		errorMessage?: string;
		disabled?: boolean;
		readonly?: boolean;
		required?: boolean;
		clearable?: boolean;
		size?: 'sm' | 'md' | 'lg';
		leadIcon?: Snippet;
		trailIcon?: Snippet;
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
		type = 'text',
		status = 'default',
		helperText,
		errorMessage,
		disabled = false,
		readonly = false,
		required = false,
		clearable = false,
		size = 'md',
		leadIcon,
		trailIcon,
		class: className = '',
		oninput,
		onchange
	}: FormFieldProps = $props();

	// Prioritize errorMessage to show with error status
	const resolvedStatus = $derived(errorMessage ? 'error' : status);
	const resolvedHelperText = $derived(errorMessage ?? helperText);
</script>

<div class={['w-full', className]}>
	<Input
		{id}
		{name}
		{label}
		{placeholder}
		{type}
		{disabled}
		{readonly}
		{required}
		{clearable}
		{size}
		{leadIcon}
		{trailIcon}
		{oninput}
		{onchange}
		status={resolvedStatus}
		helperText={resolvedHelperText}
		bind:value
	/>
</div>
