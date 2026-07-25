<script lang="ts">
	import type { Snippet } from 'svelte';

	type InputStatus = 'default' | 'error' | 'success' | 'warning';
	type InputSize = 'sm' | 'md' | 'lg';

	interface InputProps {
		id?: string;
		name?: string;
		label?: string;
		placeholder?: string;
		value?: string;
		type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
		status?: InputStatus;
		helperText?: string;
		disabled?: boolean;
		readonly?: boolean;
		required?: boolean;
		clearable?: boolean;
		size?: InputSize;
		leadIcon?: Snippet;
		trailIcon?: Snippet;
		class?: string;
		oninput?: (e: Event) => void;
		onchange?: (e: Event) => void;
		onfocus?: (e: FocusEvent) => void;
		onblur?: (e: FocusEvent) => void;
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
		disabled = false,
		readonly = false,
		required = false,
		clearable = false,
		size = 'md',
		leadIcon,
		trailIcon,
		class: className = '',
		oninput,
		onchange,
		onfocus,
		onblur
	}: InputProps = $props();

	const inputId = $derived(id ?? `input-${Math.random().toString(36).slice(2, 9)}`);
	const helperId = $derived(`${inputId}-helper`);
	const hasClear = $derived(clearable && value.length > 0 && !disabled && !readonly);

	const wrapperSizeClasses: Record<InputSize, string> = {
		sm: 'h-8 text-sm',
		md: 'h-10 text-sm',
		lg: 'h-12 text-base'
	};

	const paddingSizeClasses: Record<InputSize, string> = {
		sm: 'px-3',
		md: 'px-3.5',
		lg: 'px-4'
	};

	const statusRingClasses: Record<InputStatus, string> = {
		default:
			'border-border focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20',
		error:
			'border-red-400 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20',
		success:
			'border-green-400 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20',
		warning:
			'border-amber-400 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20'
	};

	const statusTextClasses: Record<InputStatus, string> = {
		default: 'text-muted',
		error: 'text-red-500',
		success: 'text-green-600 dark:text-green-400',
		warning: 'text-amber-600 dark:text-amber-400'
	};

	const statusIconClasses: Record<InputStatus, string> = {
		default: '',
		error: '!text-red-500',
		success: '!text-green-500',
		warning: '!text-amber-500'
	};

	function clearValue() {
		value = '';
	}
</script>

<div class={['flex flex-col gap-1.5 w-full', className]}>
	{#if label}
		<label
			for={inputId}
			class="text-sm font-medium text-primary"
		>
			{label}
			{#if required}
				<span class="text-red-500 ml-0.5" aria-hidden="true">*</span>
			{/if}
		</label>
	{/if}

	<div
		class={[
			'flex items-center gap-2 w-full bg-surface-elevated border rounded-lg transition-all duration-200',
			paddingSizeClasses[size],
			wrapperSizeClasses[size],
			statusRingClasses[status],
			disabled && 'opacity-50 cursor-not-allowed bg-surface'
		]}
	>
		{#if leadIcon}
			<span class={['shrink-0 text-muted', statusIconClasses[status]]}>
				{@render leadIcon()}
			</span>
		{/if}

		<input
			id={inputId}
			{name}
			{type}
			{placeholder}
			{disabled}
			{readonly}
			{required}
			bind:value
			aria-describedby={helperText ? helperId : undefined}
			aria-invalid={status === 'error'}
			class={[
				'min-w-0 flex-1 bg-transparent text-primary outline-none placeholder:text-muted disabled:cursor-not-allowed',
				type === 'search' &&
					'[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none'
			]}
			{oninput}
			{onchange}
			{onfocus}
			{onblur}
		/>

		{#if hasClear}
			<button
				type="button"
				onclick={clearValue}
				class="shrink-0 text-muted hover:text-primary transition-colors duration-150 rounded"
				aria-label="Clear input"
			>
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		{:else if trailIcon}
			<span class={['shrink-0 text-muted', statusIconClasses[status]]}>
				{@render trailIcon()}
			</span>
		{:else if status === 'error'}
			<svg class="h-4 w-4 shrink-0 text-red-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path fill-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 5a1 1 0 112 0v4a1 1 0 11-2 0V7zm1 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clip-rule="evenodd" />
			</svg>
		{:else if status === 'success'}
			<svg class="h-4 w-4 shrink-0 text-green-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path fill-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.707 7.293a1 1 0 00-1.414 0L10 14.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l6-6a1 1 0 000-1.414z" clip-rule="evenodd" />
			</svg>
		{/if}
	</div>

	{#if helperText}
		<p id={helperId} class={['text-xs leading-relaxed', statusTextClasses[status]]}>
			{helperText}
		</p>
	{/if}
</div>
