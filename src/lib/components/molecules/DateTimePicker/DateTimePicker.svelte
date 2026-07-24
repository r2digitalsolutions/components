<script lang="ts">
	import Calendar from '../Calendar/Calendar.svelte';
	import type { CalendarDot } from '../Calendar/Calendar.svelte';
	import type { TimeFormat } from '../TimePicker/TimePicker.svelte';

	interface DateTimePickerProps {
		/** Date part `YYYY-MM-DD`. */
		date?: string;
		/** Time part `HH:mm` (24h). */
		time?: string;
		/** Combined `YYYY-MM-DDTHH:mm` when both are set. */
		value?: string;
		open?: boolean;
		disabled?: boolean;
		label?: string;
		placeholder?: string;
		min?: string;
		max?: string;
		disabledDates?: string[];
		dots?: CalendarDot[];
		format?: TimeFormat;
		minuteStep?: number;
		closeOnSelect?: boolean;
		class?: string;
		onchange?: (detail: { date: string; time: string; value: string }) => void;
	}

	let {
		date = $bindable(''),
		time = $bindable(''),
		value = $bindable(''),
		open = $bindable(false),
		disabled = false,
		label = '',
		placeholder = 'Select date & time',
		min,
		max,
		disabledDates = [],
		dots = [],
		format = '24h',
		minuteStep = 5,
		closeOnSelect = true,
		class: className = '',
		onchange
	}: DateTimePickerProps = $props();

	let rootEl = $state<HTMLDivElement | null>(null);
	let hourListEl = $state<HTMLDivElement | null>(null);
	let minuteListEl = $state<HTMLDivElement | null>(null);

	const hours24 = Array.from({ length: 24 }, (_, i) => i);
	const minutes = $derived(
		Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep).filter(
			(m) => m < 60
		)
	);

	function pad(n: number) {
		return String(n).padStart(2, '0');
	}

	function parseTime(v: string): { h: number; m: number } | null {
		if (!v) return null;
		const match = /^(\d{1,2}):(\d{2})$/.exec(v.trim());
		if (!match) return null;
		const h = Number(match[1]);
		const m = Number(match[2]);
		if (h < 0 || h > 23 || m < 0 || m > 59) return null;
		return { h, m };
	}

	function toTime(h: number, m: number) {
		return `${pad(h)}:${pad(m)}`;
	}

	function syncFromParts() {
		value = date && time ? `${date}T${time}` : date || '';
	}

	function emit() {
		syncFromParts();
		onchange?.({ date, time, value });
	}

	// Keep parts in sync when `value` is set externally
	$effect(() => {
		if (!value) return;
		const [d, t] = value.includes('T') ? value.split('T') : [value, time];
		if (d && d !== date) date = d.slice(0, 10);
		if (t) {
			const cleaned = t.slice(0, 5);
			if (cleaned !== time) time = cleaned;
		}
	});

	const parsedTime = $derived(parseTime(time));
	const selectedH = $derived(parsedTime?.h ?? null);
	const selectedM = $derived(parsedTime?.m ?? null);

	function formatIso(iso: string) {
		if (!iso) return '';
		const [y, m, d] = iso.split('-').map(Number);
		return new Date(y, m - 1, d).toLocaleDateString('en', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function formatTimeDisplay(t: string) {
		const p = parseTime(t);
		if (!p) return '';
		if (format === '24h') return toTime(p.h, p.m);
		const period = p.h >= 12 ? 'PM' : 'AM';
		return `${p.h % 12 || 12}:${pad(p.m)} ${period}`;
	}

	const fieldLabel = $derived.by(() => {
		if (!date && !time) return placeholder;
		if (date && time) return `${formatIso(date)} · ${formatTimeDisplay(time)}`;
		if (date) return `${formatIso(date)} · …`;
		return formatTimeDisplay(time);
	});

	function setOpen(next: boolean) {
		if (disabled) return;
		open = next;
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

	function handleDateChange(detail: { value: string }) {
		date = detail.value;
		if (!time) time = '09:00';
		emit();
		if (closeOnSelect && date && time) setOpen(false);
	}

	function pickHour(h: number) {
		const m = selectedM ?? 0;
		time = toTime(h, m);
		emit();
	}

	function pickMinute(m: number) {
		const h = selectedH ?? 9;
		time = toTime(h, m);
		emit();
		if (closeOnSelect && date && time) setOpen(false);
	}

	function clear(e: MouseEvent) {
		e.stopPropagation();
		if (disabled) return;
		date = '';
		time = '';
		value = '';
		onchange?.({ date: '', time: '', value: '' });
	}

	function hourLabel(h: number) {
		if (format === '24h') return pad(h);
		const period = h >= 12 ? 'PM' : 'AM';
		return `${h % 12 || 12} ${period}`;
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

<div class={['relative w-full min-w-[20rem] max-w-[22rem]', className]} bind:this={rootEl}>
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
					d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
				/>
			</svg>
			<span class={['min-w-0 flex-1 truncate', date || time ? 'text-primary' : 'text-muted']}>
				{fieldLabel}
			</span>
		</button>
		{#if (date || time) && !disabled}
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
			aria-label="Choose date and time"
			class="absolute left-0 z-50 mt-2 flex w-max max-w-[min(100vw-1rem,42rem)] flex-col overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-xl sm:flex-row sm:items-stretch"
			onpointerdown={(e) => e.stopPropagation()}
		>
			<div class="w-[22rem] shrink-0 p-3.5">
				<Calendar
					mode="single"
					bind:value={date}
					{min}
					{max}
					{disabledDates}
					{dots}
					framed={false}
					class="w-full"
					onchange={handleDateChange}
				/>
			</div>
			<div
				class="flex w-full shrink-0 flex-col border-t border-border sm:w-40 sm:border-l sm:border-t-0"
			>
				<span
					class="shrink-0 border-b border-border px-3 py-2.5 text-center text-[11px] font-medium uppercase tracking-wide text-muted"
				>
					Time
				</span>
				<div class="grid min-h-0 flex-1 grid-cols-2 divide-x divide-border">
					<div
						bind:this={hourListEl}
						class="h-[18.5rem] overflow-y-auto p-1.5"
						role="listbox"
						aria-label="Hours"
					>
						{#each hours24 as h (h)}
							<button
								type="button"
								role="option"
								aria-pressed={selectedH === h}
								aria-selected={selectedH === h}
								onclick={() => pickHour(h)}
								class={[
									'w-full rounded-lg px-2 py-1.5 text-sm transition-colors',
									selectedH === h
										? 'bg-brand-500 font-semibold text-white'
										: 'text-primary hover:bg-surface-overlay'
								]}
							>
								{hourLabel(h)}
							</button>
						{/each}
					</div>
					<div
						bind:this={minuteListEl}
						class="h-[18.5rem] overflow-y-auto p-1.5"
						role="listbox"
						aria-label="Minutes"
					>
						{#each minutes as m (m)}
							<button
								type="button"
								role="option"
								aria-pressed={selectedM === m}
								aria-selected={selectedM === m}
								onclick={() => pickMinute(m)}
								class={[
									'w-full rounded-lg px-2 py-1.5 text-sm transition-colors',
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
