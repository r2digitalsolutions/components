<script lang="ts">
	/**
	 * US phone input with optional country code prefix.
	 * Default mask: (###) ###-####
	 * `value` stores the masked display string.
	 * `rawValue` exposes only digits.
	 */
	type InputStatus = 'default' | 'error' | 'success' | 'warning';
	type InputSize = 'sm' | 'md' | 'lg';

	interface PhoneInputProps {
		id?: string;
		value?: string;
		rawValue?: string;
		countryCode?: string;
		label?: string;
		disabled?: boolean;
		status?: InputStatus;
		helperText?: string;
		size?: InputSize;
		class?: string;
		onchange?: (masked: string, raw: string) => void;
	}

	let {
		id,
		value = $bindable(''),
		rawValue = $bindable(''),
		countryCode = '+1',
		label = 'Phone',
		disabled = false,
		status = 'default',
		helperText,
		size = 'md',
		class: className = '',
		onchange
	}: PhoneInputProps = $props();

	const mask = '(###) ###-####';
	const inputId = $derived(id ?? `phone-${Math.random().toString(36).slice(2, 9)}`);
	const helperId = $derived(`${inputId}-helper`);

	function isSlot(ch: string) {
		return ch === '#' || ch === 'A' || ch === '*';
	}

	function applyMask(raw: string): string {
		let result = '';
		let rawIdx = 0;
		for (let i = 0; i < mask.length && rawIdx < raw.length; i++) {
			const m = mask[i];
			if (m === '#') {
				while (rawIdx < raw.length && !/\d/.test(raw[rawIdx])) rawIdx++;
				if (rawIdx < raw.length) result += raw[rawIdx++];
			} else {
				result += m;
				if (raw[rawIdx] === m) rawIdx++;
			}
		}
		return result;
	}

	function extractRaw(masked: string): string {
		let raw = '';
		for (let i = 0; i < Math.min(masked.length, mask.length); i++) {
			if (isSlot(mask[i])) raw += masked[i];
		}
		return raw;
	}

	function handleInput(e: Event) {
		const input = e.target as HTMLInputElement;
		const maxDigits = [...mask].filter((ch) => ch === '#').length;
		const digits = input.value.replace(/\D/g, '').slice(0, maxDigits);
		const masked = applyMask(digits);
		value = masked;
		rawValue = extractRaw(masked);
		input.value = masked;
		onchange?.(masked, rawValue);
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
		<span class="shrink-0 pl-3.5 pr-2.5 font-mono text-sm text-secondary border-r border-border select-none self-stretch flex items-center">
			{countryCode}
		</span>

		<input
			id={inputId}
			type="tel"
			inputmode="numeric"
			autocomplete="tel"
			{disabled}
			value={value}
			placeholder="(###) ###-####"
			aria-describedby={helperText ? helperId : undefined}
			aria-invalid={status === 'error'}
			class="flex-1 min-w-0 bg-transparent text-primary placeholder:text-muted outline-none disabled:cursor-not-allowed font-mono tracking-wider px-3"
			oninput={handleInput}
		/>
	</div>

	{#if helperText}
		<p id={helperId} class={['text-xs leading-relaxed', statusTextClasses[status]]}>
			{helperText}
		</p>
	{/if}
</div>
