<script lang="ts">
	/**
	 * Mask syntax:
	 *   #  → digit (0-9)
	 *   A  → letter (a-z, A-Z)
	 *   *  → alphanumeric
	 * Any other character is a literal separator.
	 *
	 * `value` = masked display string.
	 * `rawValue` = only user-typed slot characters (no literals).
	 */
	type InputStatus = 'default' | 'error' | 'success' | 'warning';
	type InputSize = 'sm' | 'md' | 'lg';

	interface MaskedInputProps {
		id?: string;
		mask: string;
		value?: string;
		rawValue?: string;
		label?: string;
		placeholder?: string;
		disabled?: boolean;
		status?: InputStatus;
		helperText?: string;
		size?: InputSize;
		class?: string;
		onchange?: (masked: string, raw: string) => void;
	}

	let {
		id,
		mask,
		value = $bindable(''),
		rawValue = $bindable(''),
		label,
		placeholder,
		disabled = false,
		status = 'default',
		helperText,
		size = 'md',
		class: className = '',
		onchange
	}: MaskedInputProps = $props();

	let inputEl = $state<HTMLInputElement | null>(null);

	const inputId = $derived(id ?? `masked-${Math.random().toString(36).slice(2, 9)}`);
	const helperId = $derived(`${inputId}-helper`);

	const slots = $derived([...mask].filter((ch) => ch === '#' || ch === 'A' || ch === '*'));

	const maskPlaceholder = $derived(
		placeholder ??
			[...mask]
				.map((ch) => (ch === '#' || ch === 'A' || ch === '*' ? '_' : ch))
				.join('')
	);

	function isSlot(ch: string) {
		return ch === '#' || ch === 'A' || ch === '*';
	}

	function matchesSlot(maskCh: string, inputCh: string): boolean {
		if (maskCh === '#') return /\d/.test(inputCh);
		if (maskCh === 'A') return /[a-zA-Z]/.test(inputCh);
		if (maskCh === '*') return /[a-zA-Z0-9]/.test(inputCh);
		return false;
	}

	/** Pull slot characters from free-form typed text (ignores literals / junk). */
	function toRaw(typed: string): string {
		let raw = '';
		let si = 0;
		for (const ch of typed) {
			if (si >= slots.length) break;
			if (matchesSlot(slots[si], ch)) {
				raw += ch;
				si++;
			}
		}
		return raw;
	}

	function format(raw: string): string {
		if (!raw) return '';

		let result = '';
		let rawIdx = 0;

		for (let i = 0; i < mask.length; i++) {
			const m = mask[i];
			if (isSlot(m)) {
				if (rawIdx >= raw.length) break;
				result += raw[rawIdx++];
			} else if (rawIdx === 0 || rawIdx < raw.length) {
				// Leading literals ("(") or separators while more digits remain
				result += m;
			} else {
				break;
			}
		}

		return result;
	}

	/** Caret index in masked string after `rawCount` slot chars. */
	function caretAfterRaw(masked: string, rawCount: number): number {
		if (rawCount <= 0) {
			// Place after leading literals (e.g. after "(")
			let i = 0;
			while (i < masked.length && !isSlot(mask[i])) i++;
			return i;
		}
		let seen = 0;
		for (let i = 0; i < masked.length; i++) {
			if (isSlot(mask[i])) {
				seen++;
				if (seen === rawCount) return i + 1;
			}
		}
		return masked.length;
	}

	function handleInput(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const caret = input.selectionStart ?? input.value.length;
		const rawBefore = toRaw(input.value.slice(0, caret));
		const raw = toRaw(input.value).slice(0, slots.length);
		const masked = format(raw);

		value = masked;
		rawValue = raw;
		// Force DOM sync even when `value` is unchanged (at max length).
		input.value = masked;
		onchange?.(masked, raw);

		const pos = Math.min(caretAfterRaw(masked, Math.min(rawBefore.length, raw.length)), masked.length);
		input.setSelectionRange(pos, pos);
	}

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
		error: 'border-red-400 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20',
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
</script>

<div class={['flex w-full flex-col gap-1.5', className]}>
	{#if label}
		<label for={inputId} class="text-sm font-medium text-primary">{label}</label>
	{/if}

	<div
		class={[
			'flex w-full items-center gap-2 rounded-lg border bg-surface-elevated transition-all duration-200',
			paddingSizeClasses[size],
			wrapperSizeClasses[size],
			statusRingClasses[status],
			disabled && 'cursor-not-allowed bg-surface opacity-50'
		]}
	>
		<input
			bind:this={inputEl}
			id={inputId}
			type="text"
			inputmode={slots.every((s) => s === '#') ? 'numeric' : 'text'}
			autocomplete="off"
			spellcheck="false"
			{disabled}
			value={value}
			maxlength={mask.length}
			placeholder={maskPlaceholder}
			aria-describedby={helperText ? helperId : undefined}
			aria-invalid={status === 'error' || undefined}
			class="min-w-0 flex-1 bg-transparent font-mono tracking-wider text-primary outline-none placeholder:text-muted disabled:cursor-not-allowed"
			oninput={handleInput}
		/>
	</div>

	{#if helperText}
		<p id={helperId} class={['text-xs leading-relaxed', statusTextClasses[status]]}>
			{helperText}
		</p>
	{/if}
</div>
