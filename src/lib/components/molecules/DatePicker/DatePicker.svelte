<script lang="ts">
	import Calendar, {
		type CalendarDot,
		type CalendarMode
	} from '../Calendar/Calendar.svelte';
	import { i18n } from '$lib/utils/i18n.svelte.js';
	import { resolveLocaleTag } from '$lib/utils/i18n.js';

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

	let rootEl = $state<HTMLDivElement | null>(null);
	let panelEl = $state<HTMLDivElement | null>(null);
	let activeField = $state<'start' | 'end' | 'value'>('value');
	let resolved = $state<{ side: 'top' | 'bottom'; align: 'start' | 'center' | 'end' | 'stretch' }>({
		side: 'bottom',
		align: months === 1 ? 'stretch' : 'center'
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
		return {
			side,
			align: (align ?? (months === 1 ? 'stretch' : 'center')) as
				| 'start'
				| 'center'
				| 'end'
				| 'stretch'
		};
	}

	function updatePlacement() {
		if (!rootEl || !panelEl) return;

		const fixed = parsePlacement(placement);
		if (fixed) {
			resolved = {
				side: fixed.side,
				align: months === 1 && fixed.align === 'center' ? 'stretch' : fixed.align
			};
			return;
		}

		const trigger = rootEl.getBoundingClientRect();
		const panel = panelEl.getBoundingClientRect();
		const gap = 8;
		const vw = window.innerWidth;
		const vh = window.innerHeight;

		const spaceBelow = vh - trigger.bottom - gap;
		const spaceAbove = trigger.top - gap;
		const side: 'top' | 'bottom' =
			spaceBelow < panel.height && spaceAbove > spaceBelow ? 'top' : 'bottom';

		let align: 'start' | 'center' | 'end' | 'stretch' = months === 1 ? 'stretch' : 'center';

		if (months === 2 || align !== 'stretch') {
			const centerLeft = trigger.left + trigger.width / 2 - panel.width / 2;
			const startLeft = trigger.left;
			const endLeft = trigger.right - panel.width;

			const fits = (left: number) => left >= gap && left + panel.width <= vw - gap;

			if (fits(centerLeft)) align = 'center';
			else if (fits(startLeft)) align = 'start';
			else if (fits(endLeft)) align = 'end';
			else {
				// pick least overflow
				const overflows = [
					{ align: 'center' as const, overflow: Math.max(0, -centerLeft) + Math.max(0, centerLeft + panel.width - vw) },
					{ align: 'start' as const, overflow: Math.max(0, -startLeft) + Math.max(0, startLeft + panel.width - vw) },
					{ align: 'end' as const, overflow: Math.max(0, -endLeft) + Math.max(0, endLeft + panel.width - vw) }
				];
				overflows.sort((a, b) => a.overflow - b.overflow);
				align = overflows[0].align;
			}
		}

		resolved = { side, align };
	}

	$effect(() => {
		if (!open) return;
		const id = requestAnimationFrame(() => updatePlacement());
		const onWin = () => updatePlacement();
		window.addEventListener('resize', onWin);
		window.addEventListener('scroll', onWin, true);
		return () => {
			cancelAnimationFrame(id);
			window.removeEventListener('resize', onWin);
			window.removeEventListener('scroll', onWin, true);
		};
	});

	function setOpen(next: boolean) {
		if (disabled) return;
		open = next;
	}

	function openField(field: 'start' | 'end' | 'value') {
		if (disabled) return;
		activeField = field;
		open = true;
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
		mode === 'single'
			? !!value
			: mode === 'multiple'
				? values.length > 0
				: !!(start || end)
	);

	const panelClass = $derived.by(() => {
		const { side, align } = resolved;
		const vertical =
			side === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2';

		const horizontal =
			align === 'stretch'
				? 'left-0 right-0'
				: align === 'center'
					? 'left-1/2 -translate-x-1/2'
					: align === 'end'
						? 'right-0'
						: 'left-0';

		return [
			'absolute z-50 rounded-2xl border border-border bg-surface-elevated p-2 shadow-xl',
			vertical,
			horizontal,
			months === 2 && align !== 'stretch' ? 'w-max max-w-[min(100vw-1rem,42rem)]' : '',
			months === 1 || align === 'stretch' ? 'w-auto' : ''
		];
	});
</script>

<svelte:document onpointerdown={onDocPointerDown} onkeydown={onKey} />

<div
	class={[
		'relative',
		variant === 'split'
			? 'w-full'
			: months === 2
				? 'w-full max-w-xl'
				: 'w-full min-w-[18rem] max-w-[20rem]',
		className
	]}
	bind:this={rootEl}
>
	{#if label && variant === 'field'}
		<span class="mb-1.5 block text-sm font-medium text-primary">{label}</span>
	{/if}

	{#if variant === 'split' && mode === 'range'}
		<div
			class={[
				'flex overflow-hidden rounded-xl border border-border bg-surface-elevated',
				open && 'border-brand-500 ring-2 ring-brand-500/20',
				disabled && 'opacity-60'
			]}
		>
			<button
				type="button"
				{disabled}
				onclick={() => openField('start')}
				class={[
					'flex min-w-0 flex-1 flex-col gap-0.5 px-3.5 py-2.5 text-left transition-colors',
					'hover:bg-surface-overlay focus-visible:outline-none',
					activeField === 'start' && open && 'bg-surface-overlay'
				]}
			>
				<span class="text-[11px] font-medium uppercase tracking-wide text-muted">{startLabel}</span>
				<span class={['truncate text-sm', start ? 'text-primary' : 'text-muted']}>
					{start ? formatIso(start) : startPlaceholder}
				</span>
			</button>
			<div class="w-px self-stretch bg-border" aria-hidden="true"></div>
			<button
				type="button"
				{disabled}
				onclick={() => openField('end')}
				class={[
					'flex min-w-0 flex-1 flex-col gap-0.5 px-3.5 py-2.5 text-left transition-colors',
					'hover:bg-surface-overlay focus-visible:outline-none',
					activeField === 'end' && open && 'bg-surface-overlay'
				]}
			>
				<span class="text-[11px] font-medium uppercase tracking-wide text-muted">{endLabel}</span>
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
			class={[
				'flex h-10 w-full items-center overflow-hidden rounded-xl border border-border bg-surface-elevated transition-colors',
				open && 'border-brand-500 ring-2 ring-brand-500/20',
				disabled && 'opacity-60'
			]}
		>
			<button
				type="button"
				{disabled}
				onclick={() => (open ? setOpen(false) : openField('value'))}
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
					<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			{/if}
		</div>
	{/if}

	{#if open}
		<div
			bind:this={panelEl}
			role="dialog"
			aria-label="Choose date"
			class={panelClass}
			onpointerdown={(e) => e.stopPropagation()}
		>
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
		</div>
	{/if}
</div>
