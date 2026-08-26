<script lang="ts">
	import { on } from 'svelte/events';
	import { createId } from '$lib/utils/id.js';

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

	let triggerEl = $state<HTMLElement | null>(null);
	let panelEl = $state<HTMLDivElement | null>(null);
	let hourListEl = $state<HTMLDivElement | null>(null);
	let minuteListEl = $state<HTMLDivElement | null>(null);
	/** Hide the native popover until top/left are applied (UA default is 0,0). */
	let placed = $state(false);
	let panelId = $state('');

	$effect(() => {
		panelId ||= createId('timepicker');
	});

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
		const estimated = { panelW: Math.max(trigger.width, 192), panelH: 280 };
		const canMeasure = opts.measure !== false && !!panelEl?.matches(':popover-open');
		const panelW = Math.min(
			canMeasure && panelEl?.offsetWidth ? panelEl.offsetWidth : estimated.panelW,
			viewW - pad * 2
		);
		const panelH = Math.min(
			canMeasure && panelEl?.offsetHeight ? panelEl.offsetHeight : estimated.panelH,
			320
		);

		const spaceBelow = viewTop + viewH - trigger.bottom - gap - pad;
		const spaceAbove = trigger.top - viewTop - gap - pad;
		const side: 'top' | 'bottom' =
			spaceBelow < panelH && spaceAbove > spaceBelow ? 'top' : 'bottom';

		let top = side === 'bottom' ? trigger.bottom + gap : trigger.top - panelH - gap;
		let left = trigger.left;

		left = Math.min(Math.max(viewLeft + pad, left), viewLeft + viewW - panelW - pad);
		top = Math.min(Math.max(viewTop + pad, top), viewTop + viewH - panelH - pad);

		// Imperative styles in `beforetoggle`: a Svelte `style={}` binding
		// flushes too late and the UA popover paints at 0,0 first.
		if (panelEl) {
			const s = panelEl.style;
			s.setProperty('margin', '0');
			s.setProperty('inset', 'auto');
			s.setProperty('top', `${Math.round(top)}px`);
			s.setProperty('left', `${Math.round(left)}px`);
			s.setProperty('right', 'auto');
			s.setProperty('bottom', 'auto');
			s.setProperty('width', `${Math.round(panelW)}px`);
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
			placed = false;
			// Set top/left before the first paint — UA popover defaults to 0,0.
			positionPanel({ measure: false });
		} else {
			placed = false;
		}
	}

	function handleToggle(event: ToggleEvent) {
		const next = event.newState === 'open';
		open = next;
		if (next) schedulePosition();
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

	function hourLabel(h: number) {
		if (format === '24h') return pad(h);
		const period = h >= 12 ? 'PM' : 'AM';
		const h12 = h % 12 || 12;
		return `${h12} ${period}`;
	}

	$effect(() => {
		if (!open) return;
		requestAnimationFrame(() => {
			const hEl = hourListEl?.querySelector('[aria-selected="true"]') as HTMLElement | null;
			const mEl = minuteListEl?.querySelector('[aria-selected="true"]') as HTMLElement | null;
			hEl?.scrollIntoView({ block: 'center' });
			mEl?.scrollIntoView({ block: 'center' });
		});
	});
</script>

<div class={['w-full min-w-[12rem] max-w-[16rem]', className]}>
	{#if label}
		<span class="mb-1.5 block text-sm font-medium text-primary">{label}</span>
	{/if}

	<div
		bind:this={triggerEl}
		class={[
			'flex h-10 w-full items-center overflow-hidden rounded-xl border border-border bg-surface-elevated transition-colors',
			open && 'border-brand-500 ring-2 ring-brand-500/20',
			disabled && 'opacity-60'
		]}
	>
		<button
			type="button"
			{disabled}
			popovertarget={panelId}
			popovertargetaction="toggle"
			aria-expanded={open}
			aria-haspopup="dialog"
			aria-controls={panelId}
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

	<!-- Native popover (top layer + light dismiss). Not <dialog>: time picker is non-modal. -->
	<div
		bind:this={panelEl}
		id={panelId}
		popover="auto"
		role="dialog"
		aria-label="Choose time"
		onbeforetoggle={handleBeforeToggle}
		ontoggle={handleToggle}
		data-placed={placed ? true : undefined}
		class="timepicker-popover m-0 overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-xl outline-none"
	>
		<div class="grid grid-cols-2 divide-x divide-border">
			<div class="flex flex-col">
				<span
					class="border-b border-border px-3 py-2 text-center text-[11px] font-medium tracking-wide text-muted uppercase"
				>
					Hour
				</span>
				<div
					bind:this={hourListEl}
					class="max-h-52 overflow-y-auto p-1.5"
					role="listbox"
					aria-label="Hours"
				>
					{#each hours24 as h (h)}
						{@const disabledHour = minutes.every((m) => isDisabled(h, m))}
						<button
							type="button"
							role="option"
							disabled={disabledHour}
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
				<span
					class="border-b border-border px-3 py-2 text-center text-[11px] font-medium tracking-wide text-muted uppercase"
				>
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
</div>

<style>
	/* UA popover is inset:0 + margin:auto (viewport-centered and stretched). */
	.timepicker-popover {
		position: fixed;
		inset: unset;
		margin: 0;
		width: max-content;
		height: max-content;
	}

	.timepicker-popover:popover-open {
		display: block;
	}

	.timepicker-popover:popover-open:not([data-placed]) {
		visibility: hidden;
		pointer-events: none;
	}

	.timepicker-popover:not(:popover-open) {
		display: none;
	}
</style>
