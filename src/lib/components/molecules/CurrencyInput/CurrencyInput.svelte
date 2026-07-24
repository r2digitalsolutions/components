<script lang="ts">
	type InputStatus = 'default' | 'error' | 'success' | 'warning';
	type InputSize = 'sm' | 'md' | 'lg';

	interface CurrencyInputProps {
		id?: string;
		value?: number;
		currency?: string;
		locale?: string;
		min?: number;
		max?: number;
		label?: string;
		disabled?: boolean;
		status?: InputStatus;
		helperText?: string;
		size?: InputSize;
		class?: string;
		onchange?: (value: number) => void;
	}

	let {
		id,
		value = $bindable(0),
		currency = 'USD',
		locale = 'en-US',
		min,
		max,
		label,
		disabled = false,
		status = 'default',
		helperText,
		size = 'md',
		class: className = '',
		onchange
	}: CurrencyInputProps = $props();

	const inputId = $derived(id ?? `currency-${Math.random().toString(36).slice(2, 9)}`);
	const helperId = $derived(`${inputId}-helper`);

	const symbol = $derived(
		new Intl.NumberFormat(locale, { style: 'currency', currency })
			.formatToParts(0)
			.find((p) => p.type === 'currency')?.value ?? currency
	);

	let inputEl = $state<HTMLInputElement | null>(null);
	let isFocused = $state(false);
	let rawInput = $state('');

	function format(n: number): string {
		return new Intl.NumberFormat(locale, {
			style: 'decimal',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(n);
	}

	const displayValue = $derived(isFocused ? rawInput : format(value));

	function handleFocus() {
		isFocused = true;
		rawInput = value === 0 ? '' : String(value);
	}

	function handleInput(e: Event) {
		const raw = (e.target as HTMLInputElement).value;
		// Allow digits, one decimal point, and minus
		rawInput = raw.replace(/[^0-9.-]/g, '');
	}

	function handleBlur() {
		isFocused = false;
		let parsed = parseFloat(rawInput);
		if (isNaN(parsed)) parsed = 0;
		if (min !== undefined) parsed = Math.max(min, parsed);
		if (max !== undefined) parsed = Math.min(max, parsed);
		value = parsed;
		rawInput = '';
		onchange?.(value);
	}

	const wrapperSizeClasses: Record<InputSize, string> = {
		sm: 'h-8 text-sm',
		md: 'h-10 text-sm',
		lg: 'h-12 text-base'
	};

	const statusRingClasses: Record<InputStatus, string> = {
		default: 'border-border focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20',
		error: 'border-red-400 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20',
		success: 'border-green-400 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20',
		warning: 'border-amber-400 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20'
	};

	const statusTextClasses: Record<InputStatus, string> = {
		default: 'text-muted',
		error: 'text-red-500',
		success: 'text-green-600 dark:text-green-400',
		warning: 'text-amber-600 dark:text-amber-400'
	};
</script>

<div class={['flex flex-col gap-1.5 w-full', className]}>
	{#if label}
		<label for={inputId} class="text-sm font-medium text-primary">{label}</label>
	{/if}

	<div
		class={[
			'flex items-center w-full bg-surface-elevated border rounded-lg transition-all duration-200',
			wrapperSizeClasses[size],
			statusRingClasses[status],
			disabled && 'opacity-50 cursor-not-allowed bg-surface'
		]}
	>
		<span class="shrink-0 pl-3.5 pr-2.5 text-sm font-medium text-secondary border-r border-border select-none self-stretch flex items-center">
			{symbol}
		</span>

		<input
			bind:this={inputEl}
			id={inputId}
			type="text"
			inputmode="decimal"
			{disabled}
			value={displayValue}
			aria-describedby={helperText ? helperId : undefined}
			aria-invalid={status === 'error'}
			class="flex-1 min-w-0 bg-transparent text-primary placeholder:text-muted outline-none disabled:cursor-not-allowed text-right pr-3.5 font-mono tabular-nums"
			onfocus={handleFocus}
			oninput={handleInput}
			onblur={handleBlur}
		/>
	</div>

	{#if helperText}
		<p id={helperId} class={['text-xs leading-relaxed', statusTextClasses[status]]}>
			{helperText}
		</p>
	{/if}
</div>
