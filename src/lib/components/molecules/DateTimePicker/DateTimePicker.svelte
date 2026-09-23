<script lang="ts">
	import { on } from 'svelte/events';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Calendar from '../Calendar/Calendar.svelte';
	import type { CalendarDot } from '../Calendar/Calendar.svelte';
	import type { TimeFormat } from '../TimePicker/TimePicker.svelte';
	import { i18n } from '$lib/utils/i18n.svelte.js';
	import { createId } from '$lib/utils/id.js';
	import { popoverInvokerToggle } from '$lib/utils/popoverInvoker.js';

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
		/**
		 * When false (default), edits stay in the panel until Save; Cancel discards.
		 * When true, each pick commits immediately and may close the panel.
		 */
		closeOnSelect?: boolean;
		cancelLabel?: string;
		saveLabel?: string;
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
		closeOnSelect = false,
		cancelLabel,
		saveLabel,
		class: className = '',
		onchange
	}: DateTimePickerProps = $props();

	let triggerEl = $state<HTMLElement | null>(null);
	let panelEl = $state<HTMLDivElement | null>(null);
	let hourListEl = $state<HTMLDivElement | null>(null);
	let minuteListEl = $state<HTMLDivElement | null>(null);
	let placed = $state(false);
	let panelId = $state('');
	let draftDate = $state('');
	let draftTime = $state('');

	const resolvedCancelLabel = $derived(cancelLabel ?? i18n.t('cancel'));
	const resolvedSaveLabel = $derived(saveLabel ?? i18n.t('save'));
	const confirmMode = $derived(!closeOnSelect);
	const panelDate = $derived(confirmMode ? draftDate : date);
	const panelTime = $derived(confirmMode ? draftTime : time);

	$effect(() => {
		panelId ||= createId('datetimepicker');
	});

	const hours24 = Array.from({ length: 24 }, (_, i) => i);
	const minutes = $derived(
		Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep).filter(
			(m) => m < 60
		)
	);

	function boundOf(value: string | undefined) {
		if (!value) return { date: '', time: '' };
		const [datePart, timePart = ''] = value.split('T');
		return { date: datePart.slice(0, 10), time: timePart.slice(0, 5) };
	}

	const minBound = $derived(boundOf(min));
	const maxBound = $derived(boundOf(max));

	function asMinutes(h: number, m: number) {
		return h * 60 + m;
	}

	/** Same calendar day stays open. A time on that day must fall strictly after `min` and before `max`. */
	function slotBlocked(day: string, h: number, m: number) {
		if (!day) return false;
		const at = asMinutes(h, m);
		if (minBound.time && day === minBound.date) {
			const start = parseTime(minBound.time);
			if (start && at <= asMinutes(start.h, start.m)) return true;
		}
		if (maxBound.time && day === maxBound.date) {
			const end = parseTime(maxBound.time);
			if (end && at >= asMinutes(end.h, end.m)) return true;
		}
		return false;
	}

	function firstOpen(day: string, fromH = 0, fromM = 0) {
		if (!day) return '';
		if ((fromH !== 0 || fromM !== 0) && !slotBlocked(day, fromH, fromM))
			return toTime(fromH, fromM);
		for (const h of hours24) {
			for (const m of minutes) {
				if (h < fromH || (h === fromH && m < fromM)) continue;
				if (!slotBlocked(day, h, m)) return toTime(h, m);
			}
		}
		return '';
	}

	function hourBlocked(h: number) {
		if (!panelDate) return false;
		return minutes.every((m) => slotBlocked(panelDate, h, m));
	}

	function minuteBlocked(m: number) {
		if (!panelDate || selectedH == null) return false;
		return slotBlocked(panelDate, selectedH, m);
	}

	const calendarDisabled = $derived.by(() => {
		const extra: string[] = [];
		if (minBound.date && minBound.time && !firstOpen(minBound.date)) extra.push(minBound.date);
		if (maxBound.date && maxBound.time && !firstOpen(maxBound.date)) extra.push(maxBound.date);
		return [...disabledDates, ...extra];
	});

	const panelTimeBlocked = $derived.by(() => {
		const parsed = parseTime(panelTime);
		if (!panelDate || !parsed) return false;
		return slotBlocked(panelDate, parsed.h, parsed.m);
	});

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

	$effect(() => {
		if (!value) return;
		const [d, t] = value.includes('T') ? value.split('T') : [value, time];
		if (d && d !== date) date = d.slice(0, 10);
		if (t) {
			const cleaned = t.slice(0, 5);
			if (cleaned !== time) time = cleaned;
		}
	});

	const parsedTime = $derived(parseTime(panelTime));
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

	function estimatePanelSize() {
		return { panelW: 672, panelH: confirmMode ? 432 : 380 };
	}

	function beginDraft() {
		draftDate = date;
		const base = parseTime(time || '09:00') ?? { h: 9, m: 0 };
		draftTime = (date && (firstOpen(date, base.h, base.m) || firstOpen(date))) || time || '09:00';
	}

	function setPanelDate(next: string) {
		if (confirmMode) draftDate = next;
		else date = next;
	}

	function setPanelTime(next: string) {
		if (confirmMode) draftTime = next;
		else time = next;
	}

	function commitDraft() {
		date = draftDate;
		time = draftTime || '09:00';
		emit();
		setOpen(false);
	}

	function cancelDraft() {
		setOpen(false);
	}

	function positionPanel(opts: { measure?: boolean; show?: boolean } = {}) {
		if (!triggerEl) return;
		if (opts.show) placed = true;

		const trigger = triggerEl.getBoundingClientRect();
		if (trigger.width < 2 && trigger.height < 2) return;

		const vv = window.visualViewport;
		const viewW = vv?.width ?? window.innerWidth;
		const viewH = vv?.height ?? window.innerHeight;
		const viewLeft = vv?.offsetLeft ?? 0;
		const viewTop = vv?.offsetTop ?? 0;
		const gap = 8;
		const pad = 8;
		const estimated = estimatePanelSize();
		const canMeasure = opts.measure !== false && !!panelEl?.matches(':popover-open');
		const panelW = Math.min(
			canMeasure && panelEl?.offsetWidth ? panelEl.offsetWidth : estimated.panelW,
			viewW - pad * 2
		);
		const panelH = Math.min(
			canMeasure && panelEl?.offsetHeight ? panelEl.offsetHeight : estimated.panelH,
			viewH - pad * 2
		);

		const spaceBelow = viewTop + viewH - trigger.bottom - gap - pad;
		const spaceAbove = trigger.top - viewTop - gap - pad;
		const side: 'top' | 'bottom' =
			spaceBelow < panelH && spaceAbove > spaceBelow ? 'top' : 'bottom';

		let top = side === 'bottom' ? trigger.bottom + gap : trigger.top - panelH - gap;
		let left = trigger.left;

		left = Math.min(Math.max(viewLeft + pad, left), viewLeft + viewW - panelW - pad);
		top = Math.min(Math.max(viewTop + pad, top), viewTop + viewH - panelH - pad);

		if (panelEl) {
			const s = panelEl.style;
			s.setProperty('margin', '0');
			s.setProperty('inset', 'auto');
			s.setProperty('top', `${Math.round(top)}px`);
			s.setProperty('left', `${Math.round(left)}px`);
			s.setProperty('right', 'auto');
			s.setProperty('bottom', 'auto');
			s.setProperty('width', 'max-content');
			s.setProperty('visibility', placed ? 'visible' : 'hidden');
		}
	}

	function schedulePosition() {
		queueMicrotask(() => {
			positionPanel();
			requestAnimationFrame(() => {
				positionPanel();
				requestAnimationFrame(() => positionPanel({ show: true }));
			});
		});
	}

	function syncNative() {
		if (!panelEl) return;
		const isOpen = panelEl.matches(':popover-open');
		try {
			if (open && !isOpen) panelEl.showPopover();
			else if (!open && isOpen) panelEl.hidePopover();
		} catch {
			/* ignore */
		}
	}

	function setOpen(next: boolean) {
		if (disabled && next) return;
		open = next;
	}

	function handleBeforeToggle(event: ToggleEvent) {
		if (event.newState === 'open') {
			if (disabled) {
				event.preventDefault();
				return;
			}
			if (confirmMode) beginDraft();
			placed = false;
			positionPanel({ measure: false });
		} else {
			placed = false;
		}
	}

	function handleToggle(event: ToggleEvent) {
		open = event.newState === 'open';
		if (open) schedulePosition();
		else placed = false;
	}

	$effect(() => {
		open;
		queueMicrotask(() => {
			syncNative();
			if (open) positionPanel();
		});
	});

	$effect(() => {
		if (!open) return;
		const offResize = on(window, 'resize', () => positionPanel());
		const offScroll = on(window, 'scroll', () => positionPanel(), { capture: true });
		return () => {
			offResize();
			offScroll();
		};
	});

	function handleDateChange(detail: { value: string }) {
		setPanelDate(detail.value);
		const current = parseTime(confirmMode ? draftTime : time) ?? { h: 9, m: 0 };
		const next = firstOpen(detail.value, current.h, current.m) || firstOpen(detail.value);
		if (next) setPanelTime(next);
		if (!confirmMode) {
			emit();
			if (closeOnSelect && date && time) setOpen(false);
		}
	}

	function pickHour(h: number) {
		if (hourBlocked(h) || !panelDate) return;
		const preferred = selectedM ?? 0;
		const minute = slotBlocked(panelDate, h, preferred)
			? minutes.find((m) => !slotBlocked(panelDate, h, m))
			: preferred;
		if (minute == null) return;
		setPanelTime(toTime(h, minute));
		if (!confirmMode) emit();
	}

	function pickMinute(m: number) {
		if (minuteBlocked(m)) return;
		const h = selectedH ?? 9;
		setPanelTime(toTime(h, m));
		if (!confirmMode) {
			emit();
			if (closeOnSelect && date && time) setOpen(false);
		}
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

<div class={['min-w-0 w-full', className]}>
	{#if label}
		<span class="mb-1.5 text-sm font-medium text-primary block">{label}</span>
	{/if}

	<div
		bind:this={triggerEl}
		class={[
			'h-10 rounded-xl border-border bg-surface-elevated flex w-full items-center overflow-hidden border transition-colors',
			open && 'border-brand-500 ring-brand-500/20 ring-2',
			disabled && 'opacity-60'
		]}
	>
		<button
			type="button"
			{disabled}
			popovertarget={panelId}
			popovertargetaction="toggle"
			{@attach popoverInvokerToggle(() => panelEl)}
			aria-expanded={open}
			aria-haspopup="dialog"
			aria-controls={panelId}
			class={[
				'min-w-0 gap-2 px-3.5 text-sm flex h-full flex-1 items-center text-left',
				'hover:bg-surface-overlay focus-visible:outline-none',
				disabled && 'cursor-not-allowed'
			]}
		>
			<svg
				class="h-4 w-4 text-muted shrink-0"
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
				class="px-3 text-muted hover:bg-surface-overlay hover:text-primary h-full"
				aria-label="Clear"
			>
				<svg
					class="h-3.5 w-3.5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		{/if}
	</div>

	<div
		bind:this={panelEl}
		id={panelId}
		popover="auto"
		role="dialog"
		aria-label="Choose date and time"
		onbeforetoggle={handleBeforeToggle}
		ontoggle={handleToggle}
		data-placed={placed ? true : undefined}
		class="datetime-picker-popover m-0 rounded-2xl border-border bg-surface-elevated shadow-xl flex w-max max-w-[min(100vw-1rem,42rem)] flex-col overflow-hidden border outline-none"
	>
		{#key open}
			<div class="sm:flex-row sm:items-stretch flex flex-col">
				<div class="p-1.5 w-[22rem] shrink-0">
					<Calendar
						mode="single"
						value={panelDate}
						min={minBound.date || undefined}
						max={maxBound.date || undefined}
						disabledDates={calendarDisabled}
						{dots}
						framed={false}
						class="w-full"
						onchange={handleDateChange}
					/>
				</div>
				<div
					class="border-border sm:w-40 sm:border-l sm:border-t-0 flex w-full shrink-0 flex-col border-t"
				>
					<span
						class="border-border px-3 py-2.5 font-medium tracking-wide text-muted shrink-0 border-b text-center text-[11px] uppercase"
					>
						Time
					</span>
					<div class="min-h-0 divide-border grid flex-1 grid-cols-2 divide-x">
						<div
							bind:this={hourListEl}
							class="p-1.5 h-[18.5rem] overflow-y-auto"
							role="listbox"
							aria-label="Hours"
						>
							{#each hours24 as h (h)}
								<button
									type="button"
									role="option"
									aria-selected={selectedH === h}
									aria-disabled={hourBlocked(h)}
									disabled={hourBlocked(h)}
									onclick={() => pickHour(h)}
									class={[
										'rounded-lg px-2 py-1.5 text-sm w-full transition-colors',
										hourBlocked(h) && 'cursor-not-allowed opacity-30',
										selectedH === h
											? 'bg-brand-500 font-semibold text-white'
											: 'text-primary hover:bg-surface-overlay disabled:hover:bg-transparent'
									]}
								>
									{hourLabel(h)}
								</button>
							{/each}
						</div>
						<div
							bind:this={minuteListEl}
							class="p-1.5 h-[18.5rem] overflow-y-auto"
							role="listbox"
							aria-label="Minutes"
						>
							{#each minutes as m (m)}
								<button
									type="button"
									role="option"
									aria-selected={selectedM === m}
									aria-disabled={minuteBlocked(m)}
									disabled={minuteBlocked(m)}
									onclick={() => pickMinute(m)}
									class={[
										'rounded-lg px-2 py-1.5 text-sm w-full transition-colors',
										minuteBlocked(m) && 'cursor-not-allowed opacity-30',
										selectedM === m
											? 'bg-brand-500 font-semibold text-white'
											: 'text-primary hover:bg-surface-overlay disabled:hover:bg-transparent'
									]}
								>
									{pad(m)}
								</button>
							{/each}
						</div>
					</div>
				</div>
			</div>
			{#if confirmMode}
				<div class="gap-2 border-border px-3 py-2.5 flex items-center justify-end border-t">
					<Button type="button" variant="ghost" size="sm" onclick={cancelDraft}>
						{resolvedCancelLabel}
					</Button>
					<Button
						type="button"
						size="sm"
						disabled={!draftDate || panelTimeBlocked}
						onclick={commitDraft}
					>
						{resolvedSaveLabel}
					</Button>
				</div>
			{/if}
		{/key}
	</div>
</div>

<style>
	.datetime-picker-popover {
		position: fixed;
		inset: unset;
		margin: 0;
		width: max-content;
		height: max-content;
	}

	.datetime-picker-popover:popover-open {
		display: flex;
	}

	.datetime-picker-popover:popover-open:not([data-placed]) {
		visibility: hidden;
		pointer-events: none;
	}

	.datetime-picker-popover:not(:popover-open) {
		display: none;
	}
</style>
