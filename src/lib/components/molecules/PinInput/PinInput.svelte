<script lang="ts">
	interface PinInputProps {
		id?: string;
		length?: number;
		value?: string;
		label?: string;
		helperText?: string;
		status?: 'default' | 'error' | 'success';
		disabled?: boolean;
		type?: 'text' | 'number' | 'password';
		class?: string;
		oncomplete?: (value: string) => void;
		onchange?: (value: string) => void;
	}

	let {
		id,
		length = 4,
		value = $bindable(''),
		label,
		helperText,
		status = 'default',
		disabled = false,
		type = 'number',
		class: className = '',
		oncomplete,
		onchange
	}: PinInputProps = $props();

	let inputNodes = $state<HTMLInputElement[]>([]);

	const pinId = $derived(id ?? `pin-${Math.random().toString(36).slice(2, 9)}`);
	const labelId = $derived(`${pinId}-label`);
	const helperId = $derived(`${pinId}-helper`);

	const digits = $derived(Array.from({ length }, (_, i) => value[i] ?? ''));

	const statusRingClasses: Record<string, string> = {
		default: 'border-border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20',
		error: 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20',
		success: 'border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
	};

	function handleInput(index: number, e: Event) {
		const target = e.target as HTMLInputElement;
		const char = target.value.slice(-1);
		const newDigits = [...digits];
		newDigits[index] = char;
		value = newDigits.join('');

		onchange?.(value);

		if (char && index < length - 1) {
			inputNodes[index + 1]?.focus();
		}

		if (value.length === length && !value.includes('')) {
			oncomplete?.(value);
		}
	}

	function handleKeyDown(index: number, e: KeyboardEvent) {
		if (e.key === 'Backspace' && !digits[index] && index > 0) {
			inputNodes[index - 1]?.focus();
		}
	}

	function handlePaste(e: ClipboardEvent) {
		e.preventDefault();
		const pasted = e.clipboardData?.getData('text').trim() ?? '';
		if (!pasted) return;

		const cleanPasted = (type === 'number' ? pasted.replace(/\D/g, '') : pasted).slice(0, length);
		value = cleanPasted;
		onchange?.(value);

		if (cleanPasted.length === length) {
			oncomplete?.(cleanPasted);
			inputNodes[length - 1]?.focus();
		} else {
			inputNodes[cleanPasted.length]?.focus();
		}
	}
</script>

<div class={['flex flex-col gap-2 w-full', className]}>
	{#if label}
		<div id={labelId} class="text-sm font-medium text-primary">{label}</div>
	{/if}

	<div
		class="flex items-center gap-2.5"
		role="group"
		aria-labelledby={label ? labelId : undefined}
		aria-describedby={helperText ? helperId : undefined}
	>
		{#each Array.from({ length }) as _, i (i)}
			<input
				bind:this={inputNodes[i]}
				id={i === 0 ? pinId : `${pinId}-${i}`}
				type={type === 'number' ? 'text' : type}
				inputmode={type === 'number' ? 'numeric' : 'text'}
				autocomplete={i === 0 ? 'one-time-code' : 'off'}
				maxlength={1}
				value={digits[i]}
				{disabled}
				aria-label="Digit {i + 1} of {length}"
				aria-invalid={status === 'error' || undefined}
				class={[
					'h-12 w-12 text-center text-lg font-bold font-mono text-primary bg-surface-elevated border rounded-xl transition-all duration-200 outline-none select-none',
					statusRingClasses[status],
					disabled && 'opacity-50 cursor-not-allowed bg-surface'
				]}
				oninput={(e) => handleInput(i, e)}
				onkeydown={(e) => handleKeyDown(i, e)}
				onpaste={handlePaste}
			/>
		{/each}
	</div>

	{#if helperText}
		<p
			id={helperId}
			class={[
				'text-xs leading-relaxed',
				status === 'error' ? 'text-red-600 dark:text-red-400' : 'text-secondary'
			]}
		>
			{helperText}
		</p>
	{/if}
</div>
