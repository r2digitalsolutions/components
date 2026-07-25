<script lang="ts">
	type Panel = 'weeks' | 'months' | 'years';

	interface WeekPickerProps {
		/** Monday of the selected ISO week */
		value?: Date;
		locale?: string;
		minYear?: number;
		maxYear?: number;
		class?: string;
		onchange?: (weekStart: Date, weekEnd: Date) => void;
	}

	let {
		value = $bindable(startOfIsoWeek(new Date())),
		locale = 'en',
		minYear = new Date().getFullYear() - 80,
		maxYear = new Date().getFullYear() + 20,
		class: className = '',
		onchange
	}: WeekPickerProps = $props();

	let view = $state(new Date(value.getFullYear(), value.getMonth(), 1));
	let panel = $state<Panel>('weeks');
	let decadeAnchor = $state(Math.floor(value.getFullYear() / 12) * 12);

	function atMidnight(d: Date) {
		return new Date(d.getFullYear(), d.getMonth(), d.getDate());
	}

	function startOfIsoWeek(d: Date) {
		const date = atMidnight(d);
		const day = (date.getDay() + 6) % 7; // Mon=0 … Sun=6
		date.setDate(date.getDate() - day);
		return date;
	}

	function addDays(d: Date, n: number) {
		return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
	}

	function sameDay(a: Date, b: Date) {
		return (
			a.getFullYear() === b.getFullYear() &&
			a.getMonth() === b.getMonth() &&
			a.getDate() === b.getDate()
		);
	}

	const today = atMidnight(new Date());
	const viewYear = $derived(view.getFullYear());
	const viewMonth = $derived(view.getMonth());
	const monthName = $derived(view.toLocaleString(locale, { month: 'long' }));
	const weekStart = $derived(startOfIsoWeek(value));
	const weekEnd = $derived(addDays(weekStart, 6));
	const rangeLabel = $derived(
		`${weekStart.toLocaleDateString(locale, { month: 'short', day: 'numeric' })} – ${weekEnd.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}`
	);

	const weekDays = $derived(
		Array.from({ length: 7 }, (_, i) => {
			// 2023-01-02 is a Monday
			return new Date(2023, 0, 2 + i).toLocaleString(locale, { weekday: 'short' }).slice(0, 2);
		})
	);

	const monthLabels = $derived(
		Array.from({ length: 12 }, (_, i) => ({
			index: i,
			label: new Date(2000, i, 1).toLocaleString(locale, { month: 'short' }),
			full: new Date(2000, i, 1).toLocaleString(locale, { month: 'long' })
		}))
	);

	const years = $derived(Array.from({ length: 12 }, (_, i) => decadeAnchor + i));
	const decadeLabel = $derived(`${decadeAnchor} – ${decadeAnchor + 11}`);

	const weeks = $derived.by(() => {
		const first = new Date(viewYear, viewMonth, 1);
		const start = startOfIsoWeek(first);
		const result: Date[][] = [];
		let cursor = new Date(start);
		for (let w = 0; w < 6; w++) {
			const row: Date[] = [];
			for (let d = 0; d < 7; d++) {
				row.push(new Date(cursor));
				cursor = addDays(cursor, 1);
			}
			const inMonth = row.some((day) => day.getMonth() === viewMonth);
			if (w > 0 && !inMonth) break;
			result.push(row);
		}
		return result;
	});

	function inSelectedWeek(day: Date) {
		const t = atMidnight(day).getTime();
		return t >= weekStart.getTime() && t <= weekEnd.getTime();
	}

	function isWeekSelected(week: Date[]) {
		return sameDay(week[0], weekStart);
	}

	function selectWeek(monday: Date) {
		const next = startOfIsoWeek(monday);
		value = next;
		const mid = addDays(next, 3);
		view = new Date(mid.getFullYear(), mid.getMonth(), 1);
		panel = 'weeks';
		onchange?.(next, addDays(next, 6));
	}

	function selectMonth(month: number) {
		view = new Date(viewYear, month, 1);
		panel = 'weeks';
	}

	function selectYear(year: number) {
		if (year < minYear || year > maxYear) return;
		view = new Date(year, viewMonth, 1);
		panel = 'months';
	}

	function openMonths() {
		panel = 'months';
	}

	function openYears() {
		decadeAnchor = Math.floor(viewYear / 12) * 12;
		panel = 'years';
	}

	function goToday() {
		selectWeek(new Date());
	}

	function shift(delta: number) {
		if (panel === 'weeks') {
			view = new Date(viewYear, viewMonth + delta, 1);
			return;
		}
		if (panel === 'months') {
			view = new Date(viewYear + delta, viewMonth, 1);
			return;
		}
		decadeAnchor += delta * 12;
	}

	function gridButtonClass(selected: boolean, current: boolean, disabled = false) {
		return [
			'relative rounded-xl px-2 py-3 text-sm transition-colors',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
			disabled && 'cursor-not-allowed opacity-30',
			!disabled && selected && 'bg-brand-500 font-semibold text-white shadow-sm',
			!disabled &&
				!selected &&
				current &&
				'bg-brand-50 font-medium text-brand-700 dark:bg-brand-950/40 dark:text-brand-300',
			!disabled &&
				!selected &&
				!current &&
				'text-secondary hover:bg-surface-overlay hover:text-primary'
		];
	}
</script>

<div
	class={[
		'w-full max-w-[20rem] overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm',
		className
	]}
>
	<div class="flex items-center justify-between gap-2 border-b border-border px-3 py-2.5">
		<button
			type="button"
			class="flex h-8 w-8 items-center justify-center rounded-lg text-secondary transition-colors hover:bg-surface-overlay hover:text-primary"
			onclick={() => shift(-1)}
			aria-label={panel === 'years' ? 'Previous years' : panel === 'months' ? 'Previous year' : 'Previous month'}
		>
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
			</svg>
		</button>

		<div class="flex min-w-0 flex-1 items-center justify-center gap-0.5">
			{#if panel === 'weeks'}
				<button
					type="button"
					class="rounded-md px-1.5 py-0.5 text-sm font-semibold text-primary transition-colors hover:bg-surface-overlay"
					onclick={openMonths}
					aria-label="Choose month"
				>
					{monthName}
				</button>
				<button
					type="button"
					class="rounded-md px-1.5 py-0.5 text-sm font-semibold tabular-nums text-primary transition-colors hover:bg-surface-overlay"
					onclick={openYears}
					aria-label="Choose year"
				>
					{viewYear}
				</button>
			{:else if panel === 'months'}
				<button
					type="button"
					class="rounded-md px-1.5 py-0.5 text-sm font-semibold tabular-nums text-primary transition-colors hover:bg-surface-overlay"
					onclick={openYears}
					aria-label="Choose year"
				>
					{viewYear}
				</button>
			{:else}
				<span class="text-sm font-semibold tabular-nums text-primary">{decadeLabel}</span>
			{/if}
		</div>

		<button
			type="button"
			class="flex h-8 w-8 items-center justify-center rounded-lg text-secondary transition-colors hover:bg-surface-overlay hover:text-primary"
			onclick={() => shift(1)}
			aria-label={panel === 'years' ? 'Next years' : panel === 'months' ? 'Next year' : 'Next month'}
		>
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
			</svg>
		</button>
	</div>

	{#if panel === 'weeks'}
		<div class="p-3">
			<div
				class="mb-1 grid grid-cols-7 gap-y-1 text-center text-[10px] font-medium uppercase tracking-wide text-muted"
			>
				{#each weekDays as d}
					<span>{d}</span>
				{/each}
			</div>

			<div class="space-y-1" role="listbox" aria-label="Select week">
				{#each weeks as week (week[0].getTime())}
					{@const selected = isWeekSelected(week)}
					<button
						type="button"
						role="option"
						aria-selected={selected}
						class={[
							'grid w-full grid-cols-7 items-stretch rounded-xl p-0.5 transition-colors',
							'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
							!selected && 'hover:bg-surface-overlay'
						]}
						onclick={() => selectWeek(week[0])}
					>
						{#each week as day, i}
							{@const inWeek = inSelectedWeek(day)}
							{@const outside = day.getMonth() !== viewMonth}
							{@const isToday = sameDay(day, today)}
							<span
								class={[
									'relative flex h-8 items-center justify-center text-xs tabular-nums',
									inWeek && 'bg-brand-500 font-medium text-white',
									inWeek && i === 0 && 'rounded-l-lg',
									inWeek && i === 6 && 'rounded-r-lg',
									!inWeek && outside && 'text-muted/40',
									!inWeek && !outside && 'text-secondary',
									isToday && !inWeek && 'font-semibold text-brand-600 dark:text-brand-400'
								]}
							>
								{#if isToday && !inWeek}
									<span
										class="absolute bottom-1 h-1 w-1 rounded-full bg-brand-500"
										aria-hidden="true"
									></span>
								{/if}
								{day.getDate()}
							</span>
						{/each}
					</button>
				{/each}
			</div>
		</div>
	{:else if panel === 'months'}
		<div class="p-3">
			<div class="grid grid-cols-3 gap-2" role="listbox" aria-label="Select month">
				{#each monthLabels as month (month.index)}
					{@const selected = viewMonth === month.index}
					{@const current = today.getFullYear() === viewYear && today.getMonth() === month.index}
					<button
						type="button"
						role="option"
						aria-selected={selected}
						aria-label={month.full}
						onclick={() => selectMonth(month.index)}
						class={gridButtonClass(selected, current)}
					>
						{month.label}
						{#if current && !selected}
							<span
								class="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-brand-500"
								aria-hidden="true"
							></span>
						{/if}
					</button>
				{/each}
			</div>
		</div>
	{:else}
		<div class="p-3">
			<div class="grid grid-cols-3 gap-2" role="listbox" aria-label="Select year">
				{#each years as year (year)}
					{@const selected = viewYear === year}
					{@const current = today.getFullYear() === year}
					{@const disabled = year < minYear || year > maxYear}
					<button
						type="button"
						role="option"
						aria-selected={selected}
						{disabled}
						onclick={() => selectYear(year)}
						class={[gridButtonClass(selected, current, disabled), 'tabular-nums']}
					>
						{year}
						{#if current && !selected}
							<span
								class="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-brand-500"
								aria-hidden="true"
							></span>
						{/if}
					</button>
				{/each}
			</div>
		</div>
	{/if}

	<div class="flex items-center justify-between gap-2 border-t border-border px-3 py-2.5">
		<div class="min-w-0">
			<p class="truncate text-xs font-medium text-primary">{rangeLabel}</p>
		</div>
		<button
			type="button"
			class="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 transition-colors hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-950/40"
			onclick={goToday}
		>
			This week
		</button>
	</div>
</div>
