<script lang="ts">
	export type CalendarMode = 'single' | 'multiple' | 'range';

	export type CalendarDot = string | { date: string; color?: string };

	type Panel = 'days' | 'months' | 'years';

	interface CalendarProps {
		mode?: CalendarMode;
		/** Number of month grids (1 or 2). Dual is typical for booking ranges. */
		months?: 1 | 2;
		/** Selected day (YYYY-MM-DD) when mode is `single`. */
		value?: string;
		/** Selected days when mode is `multiple`. */
		values?: string[];
		/** Range start (YYYY-MM-DD) when mode is `range`. */
		start?: string;
		/** Range end (YYYY-MM-DD) when mode is `range`. */
		end?: string;
		/** Inclusive lower bound. */
		min?: string;
		/** Inclusive upper bound. */
		max?: string;
		/** Explicitly disabled dates (YYYY-MM-DD). */
		disabledDates?: string[];
		/** If set, only these dates are selectable (whitelist). */
		enabledDates?: string[];
		/** Marker dots under days. */
		dots?: CalendarDot[];
		/** Show border/shadow chrome. */
		framed?: boolean;
		/** BCP 47 locale for weekday and month names. */
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
		framed = true,
		locale = 'en',
		class: className = '',
		onchange
	}: CalendarProps = $props();

	const today = new Date();
	const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

	function monthFromIso(iso: string | undefined) {
		if (!iso) return null;
		const [y, m] = iso.split('-').map(Number);
		if (!Number.isFinite(y) || !Number.isFinite(m)) return null;
		return new Date(y, m - 1, 1);
	}

	function selectionIso() {
		if (mode === 'range') return start;
		if (mode === 'multiple') return values[0];
		return value;
	}

	let view = $state(
		monthFromIso(selectionIso()) ?? new Date(today.getFullYear(), today.getMonth(), 1)
	);
	let panel = $state<Panel>('days');
	/** Which month column owns the month/year picker when months=2. */
	let pickerOffset = $state(0);
	/** Range drag: anchor day and live preview end (YYYY-MM-DD). */
	let dragAnchor = $state<string | null>(null);
	let dragPreviewEnd = $state<string | null>(null);
	let isDragging = $state(false);

	const weekDays = $derived(
		Array.from({ length: 7 }, (_, i) =>
			new Date(2024, 0, 1 + i).toLocaleDateString(locale, { weekday: 'short' })
		)
	);
	const monthNames = $derived(
		Array.from({ length: 12 }, (_, i) =>
			new Date(2000, i, 1).toLocaleString(locale, { month: 'short' })
		)
	);

	const viewYear = $derived(view.getFullYear());
	const viewMonth = $derived(view.getMonth());
	const dual = $derived(months === 2);

	const pickerBase = $derived(new Date(viewYear, viewMonth + pickerOffset, 1));
	const pickerYear = $derived(pickerBase.getFullYear());
	const pickerMonth = $derived(pickerBase.getMonth());

	const decadeStart = $derived(Math.floor((panel === 'days' ? viewYear : pickerYear) / 12) * 12);
	const minYear = $derived(min ? Number(min.slice(0, 4)) : today.getFullYear() - 80);
	const maxYear = $derived(max ? Number(max.slice(0, 4)) : today.getFullYear() + 20);

	const disabledSet = $derived(new Set(disabledDates));
	const enabledSet = $derived(enabledDates ? new Set(enabledDates) : null);

	const dotMap = $derived.by(() => {
		const map = new Map<string, string>();
		for (const item of dots) {
			if (typeof item === 'string') {
				map.set(item, 'var(--color-brand-500, #6366f1)');
			} else {
				map.set(item.date, item.color ?? 'var(--color-brand-500, #6366f1)');
			}
		}
		return map;
	});

	function monthDate(offset: number) {
		return new Date(viewYear, viewMonth + offset, 1);
	}

	function buildCells(year: number, month: number) {
		const first = new Date(year, month, 1);
		const startPad = (first.getDay() + 6) % 7;
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		const list: { date: string; day: number; inMonth: boolean }[] = [];

		for (let i = 0; i < startPad; i++) {
			list.push({ date: '', day: 0, inMonth: false });
		}
		for (let d = 1; d <= daysInMonth; d++) {
			const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
			list.push({ date: iso, day: d, inMonth: true });
		}
		return list;
	}

	const monthGrids = $derived(
		Array.from({ length: months }, (_, offset) => {
			const d = monthDate(offset);
			return {
				offset,
				year: d.getFullYear(),
				month: d.getMonth(),
				cells: buildCells(d.getFullYear(), d.getMonth())
			};
		})
	);

	const yearCells = $derived(Array.from({ length: 12 }, (_, i) => decadeStart + i));

	function headerYearsLabel() {
		return `${decadeStart} – ${decadeStart + 11}`;
	}

	function shift(delta: number) {
		if (panel === 'days') {
			view = new Date(viewYear, viewMonth + delta, 1);
			return;
		}
		if (panel === 'months') {
			view = new Date(viewYear + delta, viewMonth, 1);
			return;
		}
		view = new Date(viewYear + delta * 12, viewMonth, 1);
	}

	function openMonths(offset = 0) {
		pickerOffset = offset;
		panel = 'months';
	}

	function openYears(offset = 0) {
		pickerOffset = offset;
		panel = 'years';
	}

	function selectMonth(month: number) {
		view = new Date(pickerYear, month - pickerOffset, 1);
		panel = 'days';
	}

	function selectYear(year: number) {
		const target = new Date(year, pickerMonth, 1);
		view = new Date(target.getFullYear(), target.getMonth() - pickerOffset, 1);
		panel = 'months';
	}

	function isMonthDisabled(month: number) {
		const y = pickerYear;
		const monthStart = `${y}-${String(month + 1).padStart(2, '0')}-01`;
		const lastDay = new Date(y, month + 1, 0).getDate();
		const monthEnd = `${y}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
		if (min && monthEnd < min) return true;
		if (max && monthStart > max) return true;
		return false;
	}

	function isYearDisabled(year: number) {
		return year < minYear || year > maxYear;
	}

	function isDisabled(iso: string) {
		if (!iso) return true;
		if (min && iso < min) return true;
		if (max && iso > max) return true;
		if (disabledSet.has(iso)) return true;
		if (enabledSet && !enabledSet.has(iso)) return true;
		return false;
	}

	function rangeDisplayStart() {
		if (mode !== 'range') return start;
		if (isDragging && dragAnchor) {
			if (!dragPreviewEnd) return dragAnchor;
			return dragAnchor <= dragPreviewEnd ? dragAnchor : dragPreviewEnd;
		}
		return start;
	}

	function rangeDisplayEnd() {
		if (mode !== 'range') return end;
		if (isDragging && dragAnchor && dragPreviewEnd) {
			return dragAnchor <= dragPreviewEnd ? dragPreviewEnd : dragAnchor;
		}
		return end;
	}

	function isSelected(iso: string) {
		if (mode === 'single') return value === iso;
		if (mode === 'multiple') return values.includes(iso);
		const rangeStart = rangeDisplayStart();
		const rangeEnd = rangeDisplayEnd();
		if (!rangeStart) return false;
		if (!rangeEnd) return rangeStart === iso;
		return iso >= rangeStart && iso <= rangeEnd;
	}

	function isRangeEdge(iso: string) {
		if (mode !== 'range') return false;
		const rangeStart = rangeDisplayStart();
		const rangeEnd = rangeDisplayEnd();
		return iso === rangeStart || iso === rangeEnd;
	}

	function isInRange(iso: string) {
		if (mode !== 'range') return false;
		const rangeStart = rangeDisplayStart();
		const rangeEnd = rangeDisplayEnd();
		return !!rangeStart && !!rangeEnd && iso > rangeStart && iso < rangeEnd;
	}

	function dayFromTarget(target: EventTarget | null) {
		if (!(target instanceof Element)) return null;
		const button = target.closest('[data-calendar-day]');
		if (!(button instanceof HTMLElement)) return null;
		const iso = button.dataset.calendarDay;
		return iso && !isDisabled(iso) ? iso : null;
	}

	function beginRangeDrag(iso: string, event: PointerEvent) {
		if (mode !== 'range' || isDisabled(iso)) return;
		event.preventDefault();
		isDragging = true;
		dragAnchor = iso;
		dragPreviewEnd = null;
	}

	function finishRangeDrag(iso: string | null) {
		if (!dragAnchor) return;

		if (dragPreviewEnd && dragPreviewEnd !== dragAnchor) {
			const rangeStart = dragAnchor <= dragPreviewEnd ? dragAnchor : dragPreviewEnd;
			const rangeEnd = dragAnchor <= dragPreviewEnd ? dragPreviewEnd : dragAnchor;
			start = rangeStart;
			end = rangeEnd;
			emit();
		} else {
			pick(iso ?? dragAnchor);
		}

		isDragging = false;
		dragAnchor = null;
		dragPreviewEnd = null;
	}

	$effect(() => {
		if (!isDragging) return;

		const onMove = (event: PointerEvent) => {
			const iso = dayFromTarget(document.elementFromPoint(event.clientX, event.clientY));
			if (iso) dragPreviewEnd = iso;
		};

		const onUp = (event: PointerEvent) => {
			const iso =
				dayFromTarget(document.elementFromPoint(event.clientX, event.clientY)) ?? dragAnchor;
			finishRangeDrag(iso);
		};

		window.addEventListener('pointermove', onMove);
		window.addEventListener('pointerup', onUp);
		window.addEventListener('pointercancel', onUp);
		return () => {
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('pointerup', onUp);
			window.removeEventListener('pointercancel', onUp);
		};
	});

	function emit() {
		onchange?.({ mode, value, values, start, end });
	}

	function pick(iso: string) {
		if (!iso || isDisabled(iso)) return;

		if (mode === 'single') {
			value = iso;
			emit();
			return;
		}

		if (mode === 'multiple') {
			values = values.includes(iso)
				? values.filter((d) => d !== iso)
				: [...values, iso].sort();
			emit();
			return;
		}

		if (!start || (start && end)) {
			start = iso;
			end = '';
			emit();
			return;
		}

		if (iso < start) {
			end = start;
			start = iso;
		} else if (iso === start) {
			end = iso;
		} else {
			end = iso;
		}
		emit();
	}

	function dayClass(iso: string) {
		const selected = isSelected(iso);
		const edge = isRangeEdge(iso);
		const mid = isInRange(iso);
		const disabled = isDisabled(iso);
		const isToday = iso === todayIso;
		const rangeStart = rangeDisplayStart();
		const rangeEnd = rangeDisplayEnd();

		return [
			'relative flex size-9 items-center justify-center rounded-lg text-sm transition-colors',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
			mode === 'range' && !disabled && 'touch-none select-none',
			disabled && 'cursor-not-allowed opacity-30',
			!disabled && !selected && !mid && 'text-primary hover:bg-surface-overlay',
			mid && 'rounded-none bg-brand-500/15 text-primary',
			selected && mode !== 'range' && 'bg-brand-500 font-semibold text-white',
			edge && 'bg-brand-500 font-semibold text-white',
			selected &&
				mode === 'range' &&
				rangeStart &&
				rangeEnd &&
				iso === rangeStart &&
				rangeEnd !== rangeStart &&
				'rounded-r-none',
			selected &&
				mode === 'range' &&
				rangeStart &&
				rangeEnd &&
				iso === rangeEnd &&
				rangeEnd !== rangeStart &&
				'rounded-l-none',
			isToday && !selected && !mid && 'ring-1 ring-brand-500/40'
		];
	}

	function gridButtonClass(active: boolean, disabled: boolean) {
		return [
			'rounded-lg py-2.5 text-sm transition-colors',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
			disabled && 'cursor-not-allowed opacity-30',
			!disabled && !active && 'text-primary hover:bg-surface-overlay',
			active && 'bg-brand-500 font-semibold text-white'
		];
	}
</script>

<div
	class={[
		'max-w-full bg-surface-elevated',
		framed && 'rounded-2xl border border-border p-3 shadow-sm',
		!framed && 'p-0.5',
		dual && panel === 'days' ? 'w-fit' : 'w-80',
		isDragging && 'select-none',
		className
	]}
	onpointerleave={() => {
		if (isDragging) dragPreviewEnd = null;
	}}
>
	{#if panel === 'days'}
		<div class={['flex', dual ? 'flex-col gap-4 sm:flex-row sm:gap-2' : 'flex-col']}>
			{#each monthGrids as grid (grid.offset)}
				<div class={['max-w-full shrink-0 px-0.5', dual ? 'w-72' : 'w-full']}>
					<div class="mb-3 flex items-center justify-between gap-1">
						{#if grid.offset === 0}
							<button
								type="button"
								onclick={() => shift(-1)}
								class="rounded-lg p-1.5 text-secondary hover:bg-surface-overlay hover:text-primary"
								aria-label="Previous month"
							>
								<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
								</svg>
							</button>
						{:else}
							<span class="w-8"></span>
						{/if}

						<div class="flex min-w-0 flex-1 items-center justify-center gap-0.5">
							<button
								type="button"
								onclick={() => openMonths(grid.offset)}
								class="rounded-md px-1.5 py-0.5 text-sm font-semibold text-primary hover:bg-surface-overlay"
							>
								{monthNames[grid.month]}
							</button>
							<button
								type="button"
								onclick={() => openYears(grid.offset)}
								class="rounded-md px-1.5 py-0.5 text-sm font-semibold text-primary hover:bg-surface-overlay"
							>
								{grid.year}
							</button>
						</div>

						{#if grid.offset === months - 1}
							<button
								type="button"
								onclick={() => shift(1)}
								class="rounded-lg p-1.5 text-secondary hover:bg-surface-overlay hover:text-primary"
								aria-label="Next month"
							>
								<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
								</svg>
							</button>
						{:else}
							<span class="w-8"></span>
						{/if}
					</div>

					<div class="mb-1 grid grid-cols-7 gap-1.5">
						{#each weekDays as d (d)}
							<span class="py-1 text-center text-[11px] font-medium text-muted">{d}</span>
						{/each}
					</div>

					<div class="grid grid-cols-7 gap-1.5">
						{#each grid.cells as cell, i (cell.date || `e-${grid.offset}-${i}`)}
							{#if !cell.inMonth}
								<span class="size-9"></span>
							{:else}
								{@const color = dotMap.get(cell.date)}
								<button
									type="button"
									disabled={isDisabled(cell.date)}
									aria-pressed={isSelected(cell.date)}
									data-calendar-day={cell.date}
									onclick={() => {
										if (mode !== 'range') pick(cell.date);
									}}
									onpointerdown={
										mode === 'range'
											? (event) => beginRangeDrag(cell.date, event)
											: undefined
									}
									onpointerenter={
										mode === 'range' && isDragging && !isDisabled(cell.date)
											? () => {
													dragPreviewEnd = cell.date;
												}
											: undefined
									}
									class={dayClass(cell.date)}
								>
									<span class="relative z-10">{cell.day}</span>
									{#if color}
										<span
											class="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
											style:background-color={color}
											aria-hidden="true"
										></span>
									{/if}
								</button>
							{/if}
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="w-full max-w-full px-0.5">
			<div class="mb-3 flex items-center justify-between gap-1">
				<button
					type="button"
					onclick={() => shift(-1)}
					class="rounded-lg p-1.5 text-secondary hover:bg-surface-overlay hover:text-primary"
					aria-label={panel === 'years' ? 'Previous years' : 'Previous year'}
				>
					<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
					</svg>
				</button>

				<div class="flex min-w-0 flex-1 items-center justify-center gap-0.5">
					{#if panel === 'months'}
						<button
							type="button"
							onclick={() => openYears(pickerOffset)}
							class="rounded-md px-1.5 py-0.5 text-sm font-semibold text-primary hover:bg-surface-overlay"
						>
							{pickerYear}
						</button>
					{:else}
						<span class="text-sm font-semibold text-primary">{headerYearsLabel()}</span>
					{/if}
				</div>

				<button
					type="button"
					onclick={() => shift(1)}
					class="rounded-lg p-1.5 text-secondary hover:bg-surface-overlay hover:text-primary"
					aria-label={panel === 'years' ? 'Next years' : 'Next year'}
				>
					<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
					</svg>
				</button>
			</div>

			{#if panel === 'months'}
				<div class="grid grid-cols-3 gap-1 py-1">
					{#each monthNames as name, month (name)}
						<button
							type="button"
							disabled={isMonthDisabled(month)}
							onclick={() => selectMonth(month)}
							class={gridButtonClass(month === pickerMonth, isMonthDisabled(month))}
						>
							{name}
						</button>
					{/each}
				</div>
			{:else}
				<div class="grid grid-cols-3 gap-1 py-1">
					{#each yearCells as year (year)}
						<button
							type="button"
							disabled={isYearDisabled(year)}
							onclick={() => selectYear(year)}
							class={gridButtonClass(year === pickerYear, isYearDisabled(year))}
						>
							{year}
						</button>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>
