<script lang="ts">
	import { on } from 'svelte/events';
	import Calendar, {
		type CalendarDot,
		type CalendarMode
	} from '../Calendar/Calendar.svelte';
	import { i18n } from '$lib/utils/i18n.svelte.js';
	import { resolveLocaleTag } from '$lib/utils/i18n.js';
	import { createId } from '$lib/utils/id.js';

	export type DatePickerPlacement =
		| 'auto'
		| 'bottom'
		| 'bottom-start'
		| 'bottom-end'
		| 'top'
		| 'top-start'
		| 'top-end';

	interface DatePickerProps {
		mode?: CalendarMode;
		/** 1 month, or 2 side-by-side (booking style). */
		months?: 1 | 2;
		value?: string;
		values?: string[];
		start?: string;
		end?: string;
		min?: string;
		max?: string;
		disabledDates?: string[];
		enabledDates?: string[];
		dots?: CalendarDot[];
		open?: boolean;
		disabled?: boolean;
		label?: string;
		placeholder?: string;
		startLabel?: string;
		endLabel?: string;
		startPlaceholder?: string;
		endPlaceholder?: string;
		/** `field` = one trigger; `split` = check-in / check-out fields. */
		variant?: 'field' | 'split';
		/** Close popover after a complete selection. */
		closeOnSelect?: boolean;
		/**
		 * Panel placement. `auto` flips vertical and chooses horizontal
		 * alignment from available viewport space.
		 */
		placement?: DatePickerPlacement;
		/** BCP 47 locale for displayed dates. Defaults to the components i18n locale. */
		locale?: string;
		class?: string;
		onchange?: (detail: {
			mode: CalendarMode;
			value: string;
			values: string[];
			start: string;
			end: string;
		}) => void;
	}

	let {
		mode = 'single',
		months = 1,
		value = $bindable(''),
		values = $bindable<string[]>([]),
		start = $bindable(''),
		end = $bindable(''),
		min,
		max,
		disabledDates = [],
		enabledDates,
		dots = [],
		open = $bindable(false),
		disabled = false,
		label = '',
		placeholder = 'Select date',
		startLabel = 'Check-in',
		endLabel = 'Check-out',
		startPlaceholder = 'Add date',
		endPlaceholder = 'Add date',
		variant = 'field',
		closeOnSelect = true,
		placement = 'auto',
		locale,
		class: className = '',
		onchange
	}: DatePickerProps = $props();

	const dateLocale = $derived(locale || resolveLocaleTag(i18n.locale));

	let triggerEl = $state<HTMLElement | null>(null);
	let panelEl = $state<HTMLDivElement | null>(null);
	/** Hide the native popover until top/left are applied (UA default is 0,0). */
	let placed = $state(false);
	let activeField = $state<'start' | 'end' | 'value'>('value');
	let panelId = $state('');

	$effect(() => {
		panelId ||= createId('datepicker');
	});

	function formatIso(iso: string) {
		if (!iso) return '';
		const [y, m, d] = iso.split('-').map(Number);
		const date = new Date(y, m - 1, d);
		return date.toLocaleDateString(dateLocale, {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}

	const fieldLabel = $derived.by(() => {
		if (mode === 'single') return value ? formatIso(value) : placeholder;
		if (mode === 'multiple') {
			if (!values.length) return placeholder;
			if (values.length === 1) return formatIso(values[0]);
			return `${values.length} dates`;
		}
		if (start && end) return `${formatIso(start)} → ${formatIso(end)}`;
		if (start) return `${formatIso(start)} → …`;
		return placeholder;
	});

	function parsePlacement(p: DatePickerPlacement) {
		if (p === 'auto') return null;
		const [side, align] = p.split('-') as ['top' | 'bottom', 'start' | 'center' | 'end' | undefined];
		return { side, align: align ?? (months === 2 ? 'center' : 'start') };
	}

	function estimatePanelSize() {
		const monthW = months === 2 ? 288 : 320;
		const panelW = months === 2 ? monthW * 2 + 24 : monthW + 16;
		return { panelW, panelH: 360 };
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
			420
		);

		const fixed = parsePlacement(placement);
		let side: 'top' | 'bottom' = fixed?.side ?? 'bottom';
		if (!fixed) {
			const spaceBelow = viewTop + viewH - trigger.bottom - gap - pad;
			const spaceAbove = trigger.top - viewTop - gap - pad;
			if (spaceBelow < panelH && spaceAbove > spaceBelow) side = 'top';
		}

		const align = fixed?.align ?? (months === 2 ? 'center' : 'start');

		let top = side === 'bottom' ? trigger.bottom + gap : trigger.top - panelH - gap;
		let left =
			align === 'end'
				? trigger.right - panelW
				: align === 'center'
					? trigger.left + trigger.width / 2 - panelW / 2
					: trigger.left;

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

	function handleChange(detail: {
		mode: CalendarMode;
		value: string;
		values: string[];
		start: string;
		end: string;
	}) {
		onchange?.(detail);

		if (!closeOnSelect) return;

		if (mode === 'single' && detail.value) {
			setOpen(false);
			return;
		}

		if (mode === 'range' && detail.start && detail.end) {
			setOpen(false);
		}
	}

	function clear(e: MouseEvent) {
		e.stopPropagation();
		if (disabled) return;
		value = '';
		values = [];
		start = '';
		end = '';
		onchange?.({ mode, value: '', values: [], start: '', end: '' });
	}

	const hasValue = $derived(
		mode === 'single' ? !!value : mode === 'multiple' ? values.length > 0 : !!(start || end)
	);

	const triggerAction = $derived(variant === 'split' ? 'show' : 'toggle');
</script>

<div
	class={[
		variant === 'split'
			? 'w-full'
			: months === 2
				? 'w-full max-w-xl'
				: 'w-full min-w-[18rem] max-w-[20rem]',
		className
	]}
>
	{#if label && variant === 'field'}
		<span class="mb-1.5 block text-sm font-medium text-primary">{label}</span>
	{/if}

	{#if variant === 'split' && mode === 'range'}
		<div
			bind:this={triggerEl}
			class={[
				'flex overflow-hidden rounded-xl border border-border bg-surface-elevated',
				open && 'border-brand-500 ring-2 ring-brand-500/20',
				disabled && 'opacity-60'
			]}
		>
			<button
				type="button"
				{disabled}
				popovertarget={panelId}
				popovertargetaction={triggerAction}
				onclick={() => {
					activeField = 'start';
				}}
				aria-expanded={open}
				aria-haspopup="dialog"
				aria-controls={panelId}
				class={[
					'flex min-w-0 flex-1 flex-col gap-0.5 px-3.5 py-2.5 text-left transition-colors',
					'hover:bg-surface-overlay focus-visible:outline-none',
					activeField === 'start' && open && 'bg-surface-overlay'
				]}
			>
				<span class="text-[11px] font-medium tracking-wide text-muted uppercase">{startLabel}</span>
				<span class={['truncate text-sm', start ? 'text-primary' : 'text-muted']}>
					{start ? formatIso(start) : startPlaceholder}
				</span>
			</button>
			<div class="w-px self-stretch bg-border" aria-hidden="true"></div>
			<button
				type="button"
				{disabled}
				popovertarget={panelId}
				popovertargetaction={triggerAction}
				onclick={() => {
					activeField = 'end';
				}}
				aria-expanded={open}
				aria-haspopup="dialog"
				aria-controls={panelId}
				class={[
					'flex min-w-0 flex-1 flex-col gap-0.5 px-3.5 py-2.5 text-left transition-colors',
					'hover:bg-surface-overlay focus-visible:outline-none',
					activeField === 'end' && open && 'bg-surface-overlay'
				]}
			>
				<span class="text-[11px] font-medium tracking-wide text-muted uppercase">{endLabel}</span>
				<span class={['truncate text-sm', end ? 'text-primary' : 'text-muted']}>
					{end ? formatIso(end) : endPlaceholder}
				</span>
			</button>
			{#if hasValue && !disabled}
				<button
					type="button"
					onclick={clear}
					class="px-3 text-muted hover:text-primary"
					aria-label={i18n.t('clearAll')}
				>
					<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			{/if}
		</div>
	{:else}
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
				onclick={() => {
					activeField = 'value';
				}}
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
						d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
				<span class={['min-w-0 flex-1 truncate', hasValue ? 'text-primary' : 'text-muted']}>
					{fieldLabel}
				</span>
			</button>
			{#if hasValue && !disabled}
				<button
					type="button"
					onclick={clear}
					class="h-full px-3 text-muted hover:bg-surface-overlay hover:text-primary"
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
	{/if}

	<!-- Native popover (top layer + light dismiss). Not <dialog>: date picker is non-modal. -->
	<div
		bind:this={panelEl}
		id={panelId}
		popover="auto"
		role="dialog"
		aria-label="Choose date"
		onbeforetoggle={handleBeforeToggle}
		ontoggle={handleToggle}
		data-placed={placed ? true : undefined}
		class={[
			'datepicker-popover m-0 w-max rounded-2xl border border-border bg-surface-elevated p-2 shadow-xl outline-none',
			months === 2 ? 'max-w-[min(42rem,calc(100vw-1rem))]' : 'max-w-[20rem]'
		]}
	>
		{#key `${open}:${start}:${value}`}
			{#if mode === 'single'}
				<Calendar
					mode="single"
					{months}
					bind:value
					{min}
					{max}
					{disabledDates}
					{enabledDates}
					{dots}
					framed={false}
					locale={dateLocale}
					onchange={handleChange}
				/>
			{:else if mode === 'multiple'}
				<Calendar
					mode="multiple"
					{months}
					bind:values
					{min}
					{max}
					{disabledDates}
					{enabledDates}
					{dots}
					framed={false}
					locale={dateLocale}
					onchange={handleChange}
				/>
			{:else}
				<Calendar
					mode="range"
					{months}
					bind:start
					bind:end
					{min}
					{max}
					{disabledDates}
					{enabledDates}
					{dots}
					framed={false}
					locale={dateLocale}
					onchange={handleChange}
				/>
			{/if}
		{/key}
	</div>
</div>

<style>
	/* UA popover is inset:0 + margin:auto (viewport-centered and stretched). */
	.datepicker-popover {
		position: fixed;
		inset: unset;
		margin: 0;
		width: max-content;
		height: max-content;
	}

	.datepicker-popover:popover-open {
		display: block;
	}

	.datepicker-popover:popover-open:not([data-placed]) {
		visibility: hidden;
		pointer-events: none;
	}

	.datepicker-popover:not(:popover-open) {
		display: none;
	}
</style>
