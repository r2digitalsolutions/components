<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Clock from '@lucide/svelte/icons/clock';
	import MapPin from '@lucide/svelte/icons/map-pin';

	export type CalendarEventColor =
		| 'brand'
		| 'success'
		| 'warning'
		| 'error'
		| 'info'
		| 'violet'
		| 'rose';

	export interface CalendarEvent {
		id: string;
		title: string;
		/** YYYY-MM-DD */
		date: string;
		endDate?: string;
		time?: string;
		endTime?: string;
		allDay?: boolean;
		color?: CalendarEventColor;
		calendar?: string;
		location?: string;
	}

	interface EventCalendarProps {
		events?: CalendarEvent[];
		month?: Date;
		/** Selected day YYYY-MM-DD */
		selectedDate?: string;
		maxPerDay?: number;
		showTodayButton?: boolean;
		showAgenda?: boolean;
		showLegend?: boolean;
		weekStartsOn?: 0 | 1;
		class?: string;
		ondayclick?: (date: string) => void;
		oneventclick?: (event: CalendarEvent) => void;
		onmoreclick?: (date: string, events: CalendarEvent[]) => void;
		onmonthchange?: (month: Date) => void;
	}

	let {
		events = [],
		month = $bindable(new Date()),
		selectedDate = $bindable(''),
		maxPerDay = 3,
		showTodayButton = true,
		showAgenda = true,
		showLegend = true,
		weekStartsOn = 1,
		class: className = '',
		ondayclick,
		oneventclick,
		onmoreclick,
		onmonthchange
	}: EventCalendarProps = $props();

	const weekdays = $derived(
		weekStartsOn === 1
			? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
			: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
	);

	const year = $derived(month.getFullYear());
	const monthIndex = $derived(month.getMonth());
	const title = $derived(month.toLocaleDateString('en', { month: 'long', year: 'numeric' }));
	const monthPrefix = $derived(`${year}-${String(monthIndex + 1).padStart(2, '0')}`);

	function toKey(y: number, m: number, d: number) {
		return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
	}

	const todayKey = $derived.by(() => {
		const t = new Date();
		return toKey(t.getFullYear(), t.getMonth(), t.getDate());
	});

	function covers(e: CalendarEvent, key: string) {
		const end = e.endDate ?? e.date;
		return key >= e.date && key <= end;
	}

	const cells = $derived.by(() => {
		const first = new Date(year, monthIndex, 1);
		const startPad = weekStartsOn === 1 ? (first.getDay() + 6) % 7 : first.getDay();
		const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
		const out: Array<{ day: number | null; key: string | null }> = [];
		for (let i = 0; i < startPad; i++) out.push({ day: null, key: null });
		for (let d = 1; d <= daysInMonth; d++) {
			out.push({ day: d, key: toKey(year, monthIndex, d) });
		}
		while (out.length % 7 !== 0) out.push({ day: null, key: null });
		return out;
	});

	function dayEvents(key: string) {
		return events
			.filter((e) => covers(e, key))
			.sort((a, b) => {
				if (a.allDay && !b.allDay) return -1;
				if (!a.allDay && b.allDay) return 1;
				return (a.time ?? '').localeCompare(b.time ?? '');
			});
	}

	/** Keep selection inside the visible month so agenda matches the grid */
	$effect(() => {
		const prefix = monthPrefix;
		if (!selectedDate || !selectedDate.startsWith(prefix)) {
			selectedDate = todayKey.startsWith(prefix) ? todayKey : `${prefix}-01`;
		}
	});

	const activeKey = $derived(
		selectedDate && selectedDate.startsWith(monthPrefix)
			? selectedDate
			: todayKey.startsWith(monthPrefix)
				? todayKey
				: `${monthPrefix}-01`
	);

	const agenda = $derived(dayEvents(activeKey));
	const agendaLabel = $derived.by(() => {
		const [y, m, d] = activeKey.split('-').map(Number);
		return new Date(y, m - 1, d).toLocaleDateString('en', {
			weekday: 'long',
			month: 'short',
			day: 'numeric'
		});
	});

	const monthEventCount = $derived(
		events.filter((e) => {
			const start = e.date.slice(0, 7);
			const end = (e.endDate ?? e.date).slice(0, 7);
			return start <= monthPrefix && end >= monthPrefix;
		}).length
	);

	const calendars = $derived(
		[...new Set(events.map((e) => e.calendar).filter(Boolean))] as string[]
	);

	const bar: Record<CalendarEventColor, string> = {
		brand: 'bg-brand-500',
		success: 'bg-green-500',
		warning: 'bg-amber-500',
		error: 'bg-red-500',
		info: 'bg-sky-500',
		violet: 'bg-violet-500',
		rose: 'bg-rose-500'
	};

	const soft: Record<CalendarEventColor, string> = {
		brand: 'bg-brand-500/12 text-brand-800 dark:text-brand-200',
		success: 'bg-green-500/12 text-green-800 dark:text-green-200',
		warning: 'bg-amber-500/12 text-amber-900 dark:text-amber-200',
		error: 'bg-red-500/12 text-red-800 dark:text-red-200',
		info: 'bg-sky-500/12 text-sky-900 dark:text-sky-200',
		violet: 'bg-violet-500/12 text-violet-900 dark:text-violet-200',
		rose: 'bg-rose-500/12 text-rose-900 dark:text-rose-200'
	};

	function setMonth(next: Date) {
		month = next;
		onmonthchange?.(next);
	}

	function prev() {
		setMonth(new Date(year, monthIndex - 1, 1));
	}
	function next() {
		setMonth(new Date(year, monthIndex + 1, 1));
	}
	function goToday() {
		const t = new Date();
		setMonth(new Date(t.getFullYear(), t.getMonth(), 1));
		selectedDate = todayKey;
		ondayclick?.(todayKey);
	}

	function selectDay(key: string) {
		selectedDate = key;
		ondayclick?.(key);
	}

	function timeOf(e: CalendarEvent) {
		if (e.allDay || !e.time) return 'All day';
		if (e.endTime) return `${e.time}–${e.endTime}`;
		return e.time;
	}
</script>

<div
	class={[
		'flex w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm',
		className
	]}
>
	<!-- Header -->
	<div class="flex w-full flex-wrap items-center gap-2 border-b border-border px-4 py-3">
		<div class="min-w-0 flex-1">
			<h3 class="text-base font-semibold tracking-tight text-primary">{title}</h3>
			<p class="text-xs text-muted">
				{monthEventCount} event{monthEventCount === 1 ? '' : 's'} this month
			</p>
		</div>
		<div class="flex shrink-0 items-center gap-1">
			{#if showTodayButton}
				<Button size="xs" variant="secondary" onclick={goToday}>Today</Button>
			{/if}
			<div class="flex items-center rounded-lg border border-border bg-surface p-0.5">
				<IconButton label="Previous month" size="sm" variant="ghost" onclick={prev}>
					<ChevronLeft class="h-4 w-4" strokeWidth={2} />
				</IconButton>
				<IconButton label="Next month" size="sm" variant="ghost" onclick={next}>
					<ChevronRight class="h-4 w-4" strokeWidth={2} />
				</IconButton>
			</div>
		</div>
	</div>

	<div
		class={[
			'grid w-full min-w-0',
			showAgenda && 'lg:grid-cols-[minmax(0,1fr)_18rem]'
		]}
	>
		<!-- Month grid: never shrink below usable width -->
		<div class="min-w-0 w-full p-3 sm:p-4">
			<div
				class="grid w-full gap-px overflow-hidden rounded-xl border border-border bg-border"
				style="grid-template-columns: repeat(7, minmax(0, 1fr));"
			>
				{#each weekdays as day}
					<div
						class="bg-surface-overlay/70 py-2 text-center text-[10px] font-semibold tracking-wider text-muted uppercase"
					>
						{day}
					</div>
				{/each}

				{#each cells as cell}
					{#if cell.day == null}
						<div class="aspect-square min-h-[4.5rem] bg-surface-overlay/25 sm:min-h-[5.25rem] sm:aspect-auto"></div>
					{:else}
						{@const list = dayEvents(cell.key!)}
						{@const isToday = cell.key === todayKey}
						{@const isSelected = cell.key === activeKey}
						<button
							type="button"
							class={[
								'flex min-h-[4.5rem] w-full min-w-0 flex-col gap-0.5 bg-surface p-1 text-left transition sm:min-h-[5.25rem] sm:p-1.5',
								'hover:bg-surface-overlay/60',
								isSelected && 'bg-brand-500/[0.06] ring-1 ring-inset ring-brand-500/35',
								isToday && !isSelected && 'bg-surface-overlay/40'
							]}
							onclick={() => selectDay(cell.key!)}
						>
							<span
								class={[
									'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums',
									isToday && 'bg-brand-500 text-white',
									isSelected && !isToday && 'bg-brand-500/15 text-brand-700 dark:text-brand-300',
									!isToday && !isSelected && 'text-primary'
								]}
							>
								{cell.day}
							</span>

							<div class="flex min-h-0 w-full flex-1 flex-col gap-0.5 overflow-hidden">
								{#each list.slice(0, maxPerDay) as ev (ev.id)}
									<span
										class={[
											'flex w-full min-w-0 items-center gap-1 truncate rounded-md px-1 py-0.5 text-[10px] font-medium leading-tight',
											soft[ev.color ?? 'brand']
										]}
										role="presentation"
									>
										<span
											class={['h-1.5 w-1.5 shrink-0 rounded-full', bar[ev.color ?? 'brand']]}
										></span>
										<span class="min-w-0 truncate">
											{#if ev.time && !ev.allDay}{ev.time} {/if}{ev.title}
										</span>
									</span>
								{/each}
								{#if list.length > maxPerDay}
									<span class="px-0.5 text-[10px] font-semibold text-muted">
										+{list.length - maxPerDay}
									</span>
								{/if}
							</div>
						</button>
					{/if}
				{/each}
			</div>

			{#if showLegend && calendars.length > 0}
				<div class="mt-3 flex flex-wrap gap-2">
					{#each calendars as cal}
						<span
							class="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2 py-0.5 text-[11px] font-medium text-secondary"
						>
							<span class="h-1.5 w-1.5 rounded-full bg-brand-500"></span>
							{cal}
						</span>
					{/each}
				</div>
			{/if}
		</div>

		{#if showAgenda}
			<aside
				class="w-full shrink-0 border-t border-border bg-surface-overlay/30 lg:w-[18rem] lg:border-t-0 lg:border-l"
			>
				<div class="border-b border-border px-4 py-3">
					<p class="text-[10px] font-semibold tracking-wider text-muted uppercase">Selected day</p>
					<p class="mt-0.5 text-sm font-semibold text-primary">{agendaLabel}</p>
				</div>

				{#if agenda.length === 0}
					<div class="px-4 py-8 text-center">
						<Text size="xs" tone="muted">No events</Text>
						<p class="mt-1 text-[11px] text-muted">Pick another day on the grid</p>
					</div>
				{:else}
					<ul class="max-h-[32rem] space-y-1 overflow-y-auto p-2">
						{#each agenda as ev (ev.id)}
							<li>
								<button
									type="button"
									class="flex w-full gap-2.5 rounded-xl border border-transparent px-2.5 py-2 text-left transition hover:border-border hover:bg-surface-elevated"
									onclick={() => {
										oneventclick?.(ev);
										if (agenda.length > maxPerDay) onmoreclick?.(activeKey, agenda);
									}}
								>
									<span
										class={['mt-1 h-8 w-1 shrink-0 rounded-full', bar[ev.color ?? 'brand']]}
										aria-hidden="true"
									></span>
									<div class="min-w-0 flex-1">
										<p class="truncate text-sm font-semibold text-primary">{ev.title}</p>
										<p class="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-muted">
											<span class="inline-flex items-center gap-1">
												<Clock class="h-3 w-3" />
												{timeOf(ev)}
											</span>
											{#if ev.location}
												<span class="inline-flex items-center gap-1">
													<MapPin class="h-3 w-3" />
													{ev.location}
												</span>
											{/if}
										</p>
										{#if ev.calendar}
											<p class="mt-1 text-[10px] font-medium text-secondary">{ev.calendar}</p>
										{/if}
									</div>
								</button>
							</li>
						{/each}
					</ul>
				{/if}
			</aside>
		{/if}
	</div>
</div>
