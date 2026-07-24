<script lang="ts">
	export type TimeFormat = '24h' | '12h';

	interface TimePickerProps {
		/** Selected time as `HH:mm` (24h). */
		value?: string;
		open?: boolean;
		disabled?: boolean;
		label?: string;
		placeholder?: string;
		format?: TimeFormat;
		/** Minute step (1, 5, 10, 15…). */
		minuteStep?: number;
		min?: string;
		max?: string;
		closeOnSelect?: boolean;
		class?: string;
		onchange?: (value: string) => void;
	}

	let {
		value = $bindable(''),
		open = $bindable(false),
		disabled = false,
		label = '',
		placeholder = 'Select time',
		format = '24h',
		minuteStep = 5,
		min,
		max,
		closeOnSelect = false,
		class: className = '',
		onchange
	}: TimePickerProps = $props();

	let rootEl = $state<HTMLDivElement | null>(null);
	let hourListEl = $state<HTMLDivElement | null>(null);
	let minuteListEl = $state<HTMLDivElement | null>(null);

	const hours24 = $derived(Array.from({ length: 24 }, (_, i) => i));
	const minutes = $derived(
		Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep).filter(
			(m) => m < 60
		)
	);

	function parse(v: string): { h: number; m: number } | null {
		if (!v) return null;
		const match = /^(\d{1,2}):(\d{2})$/.exec(v.trim());
		if (!match) return null;
		const h = Number(match[1]);
		const m = Number(match[2]);
		if (h < 0 || h > 23 || m < 0 || m > 59) return null;
		return { h, m };
	}

	function pad(n: number) {
		return String(n).padStart(2, '0');
	}

	function toValue(h: number, m: number) {
		return `${pad(h)}:${pad(m)}`;
	}

	function snapMinute(m: number) {
		const step = Math.max(1, minuteStep);
		const snapped = Math.round(m / step) * step;
		return snapped >= 60 ? 60 - step : snapped;
	}

	const parsed = $derived(parse(value));
	const selectedH = $derived(parsed?.h ?? null);
	const selectedM = $derived(parsed?.m ?? null);

	const display = $derived.by(() => {
		if (!parsed) return placeholder;
		if (format === '24h') return toValue(parsed.h, parsed.m);
		const period = parsed.h >= 12 ? 'PM' : 'AM';
		const h12 = parsed.h % 12 || 12;
		return `${h12}:${pad(parsed.m)} ${period}`;
	});

	function isDisabled(h: number, m: number) {
		const t = toValue(h, m);
		if (min && t < min) return true;
		if (max && t > max) return true;
		return false;
	}

	function setOpen(next: boolean) {
		if (disabled) return;
		open = next;
	}

	function emit(next: string) {
		value = next;
		onchange?.(next);
		if (closeOnSelect) setOpen(false);
	}

	function pickHour(h: number) {
		const m = selectedM !== null ? snapMinute(selectedM) : 0;
		if (isDisabled(h, m)) return;
		emit(toValue(h, m));
	}

	function pickMinute(m: number) {
		const h = selectedH ?? 0;
		if (isDisabled(h, m)) return;
		emit(toValue(h, m));
	}

	function clear(e: MouseEvent) {
		e.stopPropagation();
		if (disabled) return;
		value = '';
		onchange?.('');
	}

	function onDocPointerDown(e: PointerEvent) {
		if (!open || !rootEl) return;
		const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
		if (path.includes(rootEl) || rootEl.contains(e.target as Node)) return;
		setOpen(false);
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape' && open) setOpen(false);
	}

	function hourLabel(h: number) {
		if (format === '24h') return pad(h);
		const period = h >= 12 ? 'PM' : 'AM';
		const h12 = h % 12 || 12;
		return `${h12} ${period}`;
	}

	$effect(() => {
		if (!open) return;
		requestAnimationFrame(() => {
			const hEl = hourListEl?.querySelector('[aria-pressed="true"]') as HTMLElement | null;
			const mEl = minuteListEl?.querySelector('[aria-pressed="true"]') as HTMLElement | null;
			hEl?.scrollIntoView({ block: 'center' });
			mEl?.scrollIntoView({ block: 'center' });
		});
	});
</script>

<svelte:document onpointerdown={onDocPointerDown} onkeydown={onKey} />

<div class={['relative w-full min-w-[12rem] max-w-[16rem]', className]} bind:this={rootEl}>
	{#if label}
		<span class="mb-1.5 block text-sm font-medium text-primary">{label}</span>
	{/if}

	<div
		class={[
			'flex h-10 w-full items-center overflow-hidden rounded-xl border border-border bg-surface-elevated transition-colors',
			open && 'border-brand-500 ring-2 ring-brand-500/20',
			disabled && 'opacity-60'
		]}
	>
		<button
			type="button"
			{disabled}
			onclick={() => setOpen(!open)}
			aria-expanded={open}
			class={[
				'flex h-full min-w-0 flex-1 items-center gap-2 px-3.5 text-left text-sm',
				'hover:bg-surface-overlay focus-visible:outline-none',
				disabled && 'cursor-not-allowed'
			]}
		>
			<svg
				class="h-4 w-4 shrink-0 text-muted"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<span class={['min-w-0 flex-1 truncate', value ? 'text-primary' : 'text-muted']}>
				{display}
			</span>
		</button>
		{#if value && !disabled}
			<button
				type="button"
				onclick={clear}
				class="h-full px-3 text-muted hover:bg-surface-overlay hover:text-primary"
				aria-label="Clear"
			>
				<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		{/if}
	</div>

	{#if open}
		<div
			role="dialog"
			aria-label="Choose time"
			class="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-xl"
			onpointerdown={(e) => e.stopPropagation()}
		>
			<div class="grid grid-cols-2 divide-x divide-border">
				<div class="flex flex-col">
					<span class="border-b border-border px-3 py-2 text-center text-[11px] font-medium uppercase tracking-wide text-muted">
						Hour
					</span>
					<div bind:this={hourListEl} class="max-h-52 overflow-y-auto p-1.5" role="listbox" aria-label="Hours">
						{#each hours24 as h (h)}
							{@const disabledHour = minutes.every((m) => isDisabled(h, m))}
							<button
								type="button"
								role="option"
								disabled={disabledHour}
								aria-pressed={selectedH === h}
								aria-selected={selectedH === h}
								onclick={() => pickHour(h)}
								class={[
									'w-full rounded-lg px-2 py-1.5 text-sm transition-colors',
									'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
									disabledHour && 'cursor-not-allowed opacity-30',
									selectedH === h
										? 'bg-brand-500 font-semibold text-white'
										: 'text-primary hover:bg-surface-overlay'
								]}
							>
								{hourLabel(h)}
							</button>
						{/each}
					</div>
				</div>
				<div class="flex flex-col">
					<span class="border-b border-border px-3 py-2 text-center text-[11px] font-medium uppercase tracking-wide text-muted">
						Min
					</span>
					<div
						bind:this={minuteListEl}
						class="max-h-52 overflow-y-auto p-1.5"
						role="listbox"
						aria-label="Minutes"
					>
						{#each minutes as m (m)}
							{@const disabledMin = selectedH === null ? false : isDisabled(selectedH, m)}
							<button
								type="button"
								role="option"
								disabled={disabledMin}
								aria-pressed={selectedM === m}
								aria-selected={selectedM === m}
								onclick={() => pickMinute(m)}
								class={[
									'w-full rounded-lg px-2 py-1.5 text-sm transition-colors',
									'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
									disabledMin && 'cursor-not-allowed opacity-30',
									selectedM === m
										? 'bg-brand-500 font-semibold text-white'
										: 'text-primary hover:bg-surface-overlay'
								]}
							>
								{pad(m)}
							</button>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
