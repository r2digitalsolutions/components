<script lang="ts">
	interface TextareaProps {
		id?: string;
		name?: string;
		label?: string;
		placeholder?: string;
		value?: string;
		status?: 'default' | 'error' | 'success' | 'warning';
		helperText?: string;
		disabled?: boolean;
		readonly?: boolean;
		required?: boolean;
		rows?: number;
		maxLength?: number;
		showCount?: boolean;
		autoResize?: boolean;
		class?: string;
		oninput?: (e: Event) => void;
		onchange?: (e: Event) => void;
		onfocus?: (e: FocusEvent) => void;
		onblur?: (e: FocusEvent) => void;
		onkeydown?: (e: KeyboardEvent) => void;
	}

	let {
		id,
		name,
		label,
		placeholder,
		value = $bindable(''),
		status = 'default',
		helperText,
		disabled = false,
		readonly = false,
		required = false,
		rows = 3,
		maxLength,
		showCount = false,
		autoResize = false,
		class: className = '',
		oninput,
		onchange,
		onfocus,
		onblur,
		onkeydown
	}: TextareaProps = $props();

	const textareaId = $derived(id ?? `textarea-${Math.random().toString(36).slice(2, 9)}`);
	const helperId = $derived(`${textareaId}-helper`);
	const characterCount = $derived(value.length);

	const statusRingClasses: Record<string, string> = {
		default:
			'border-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20',
		error:
			'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20',
		success:
			'border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20',
		warning:
			'border-amber-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
	};

	const statusTextClasses: Record<string, string> = {
		default: 'text-muted',
		error: 'text-red-500',
		success: 'text-green-600 dark:text-green-400',
		warning: 'text-amber-600 dark:text-amber-400'
	};

	function handleInput(e: Event) {
		const target = e.target as HTMLTextAreaElement;
		if (autoResize) {
			target.style.height = 'auto';
			target.style.height = `${target.scrollHeight}px`;
		}
		oninput?.(e);
	}

	function attachAutoResize(node: HTMLTextAreaElement) {
		$effect(() => {
			if (autoResize) {
				node.style.height = 'auto';
				node.style.height = `${node.scrollHeight}px`;
			}
		});
	}
</script>

<div class={['flex flex-col gap-1.5 w-full', className]}>
	{#if label}
		<label for={textareaId} class="text-sm font-medium text-primary">
			{label}
			{#if required}
				<span class="text-red-500 ml-0.5" aria-hidden="true">*</span>
			{/if}
		</label>
	{/if}

	<div class="relative w-full">
		<textarea
			id={textareaId}
			{name}
			{placeholder}
			{disabled}
			{readonly}
			{required}
			{rows}
			maxlength={maxLength}
			bind:value
			aria-describedby={helperText ? helperId : undefined}
			aria-invalid={status === 'error'}
			{@attach attachAutoResize}
			class={[
				'w-full bg-surface-elevated border rounded-lg p-3 text-primary text-sm placeholder:text-muted outline-none transition-all duration-200 resize-y',
				statusRingClasses[status],
				disabled && 'opacity-50 cursor-not-allowed bg-surface',
				autoResize && 'resize-none overflow-hidden'
			]}
			oninput={handleInput}
			{onchange}
			{onfocus}
			{onblur}
			{onkeydown}
		></textarea>
	</div>

	<div class="flex items-center justify-between gap-2 text-xs">
		{#if helperText}
			<p id={helperId} class={['leading-relaxed', statusTextClasses[status]]}>
				{helperText}
			</p>
		{:else}
			<span></span>
		{/if}

		{#if showCount}
			<span class={['font-mono shrink-0 ml-auto', maxLength && characterCount >= maxLength ? 'text-red-500 font-semibold' : 'text-muted']}>
				{characterCount}{#if maxLength}/{maxLength}{/if}
			</span>
		{/if}
	</div>
</div>
