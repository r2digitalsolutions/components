<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Checkbox from '$lib/components/atoms/Checkbox/Checkbox.svelte';
	import SegmentedControl from '$lib/components/molecules/SegmentedControl/SegmentedControl.svelte';
	import SearchInput from '$lib/components/molecules/SearchInput/SearchInput.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Plus from '@lucide/svelte/icons/plus';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Clock from '@lucide/svelte/icons/clock';
	import X from '@lucide/svelte/icons/x';

	export type CalendarView = 'month' | 'week' | 'day' | 'agenda';
	export type CalendarTone = 'brand' | 'success' | 'warning' | 'error' | 'info' | 'violet' | 'rose';

	export interface CalendarSource {
		id: string;
		label: string;
		color?: CalendarTone;
		visible?: boolean;
	}

	export interface CalendarAppEvent {
		id: string;
		title: string;
		/** YYYY-MM-DD */
		date: string;
		/** Optional end date for multi-day (inclusive) */
		endDate?: string;
		startTime?: string;
		endTime?: string;
		allDay?: boolean;
		calendarId?: string;
		color?: CalendarTone;
		location?: string;
		description?: string;
	}

	interface CalendarAppProps {
		events?: CalendarAppEvent[];
		calendars?: CalendarSource[];
		view?: CalendarView;
		/** Anchor date for navigation */
		date?: Date;
		query?: string;
		selectedEventId?: string | null;
		showSidebar?: boolean;
		showSearch?: boolean;
		showCreate?: boolean;
		weekStartsOn?: 0 | 1;
		class?: string;
		onviewchange?: (view: CalendarView) => void;
		ondatechange?: (date: Date) => void;
		oneventclick?: (event: CalendarAppEvent) => void;
		ondayclick?: (date: string) => void;
		oncreate?: (date: string) => void;
		oncalendartoggle?: (id: string, visible: boolean) => void;
	}

	let {
		events = [],
		calendars = $bindable([
			{ id: 'work', label: 'Work', color: 'brand', visible: true },
			{ id: 'personal', label: 'Personal', color: 'violet', visible: true },
			{ id: 'focus', label: 'Focus time', color: 'success', visible: true }
		] as CalendarSource[]),
		view = $bindable<CalendarView>('month'),
		date = $bindable(new Date()),
		query = $bindable(''),
		selectedEventId = $bindable<string | null>(null),
		showSidebar = true,
		showSearch = true,
		showCreate = true,
		weekStartsOn = 1,
		class: className = '',
		onviewchange,
		ondatechange,
		oneventclick,
		ondayclick,
		oncreate,
		oncalendartoggle
	}: CalendarAppProps = $props();

	const weekdayLabels = $derived(
		weekStartsOn === 1
			? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
			: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
	);

	const toneClass: Record<CalendarTone, string> = {
		brand: 'bg-brand-500',
		success: 'bg-green-500',
		warning: 'bg-amber-500',
		error: 'bg-red-500',
		info: 'bg-sky-500',
		violet: 'bg-violet-500',
		rose: 'bg-rose-500'
	};

	const toneSoft: Record<CalendarTone, string> = {
		brand: 'bg-brand-500/15 text-brand-800 border-brand-500/25 dark:text-brand-200',
		success: 'bg-green-500/15 text-green-800 border-green-500/25 dark:text-green-200',
		warning: 'bg-amber-500/15 text-amber-900 border-amber-500/25 dark:text-amber-200',
		error: 'bg-red-500/15 text-red-800 border-red-500/25 dark:text-red-200',
		info: 'bg-sky-500/15 text-sky-900 border-sky-500/25 dark:text-sky-200',
		violet: 'bg-violet-500/15 text-violet-900 border-violet-500/25 dark:text-violet-200',
		rose: 'bg-rose-500/15 text-rose-900 border-rose-500/25 dark:text-rose-200'
	};

	function iso(d: Date) {
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
	}

	function parseIso(s: string) {
		const [y, m, d] = s.split('-').map(Number);
		return new Date(y, m - 1, d);
	}

	function addDays(d: Date, n: number) {
		const x = new Date(d);
		x.setDate(x.getDate() + n);
		return x;
	}

	function startOfWeek(d: Date) {
		const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
		const day = x.getDay();
		const diff = weekStartsOn === 1 ? (day + 6) % 7 : day;
		x.setDate(x.getDate() - diff);
		return x;
	}

	const todayKey = $derived(iso(new Date()));
	const focusKey = $derived(iso(date));

	const visibleCalendarIds = $derived(
		new Set(calendars.filter((c) => c.visible !== false).map((c) => c.id))
	);

	const filteredEvents = $derived.by(() => {
		const q = query.trim().toLowerCase();
		return events.filter((e) => {
			if (e.calendarId && !visibleCalendarIds.has(e.calendarId)) return false;
			if (!q) return true;
			return (
				e.title.toLowerCase().includes(q) ||
				(e.location ?? '').toLowerCase().includes(q) ||
				(e.description ?? '').toLowerCase().includes(q)
			);
		});
	});

	function eventTone(e: CalendarAppEvent): CalendarTone {
		if (e.color) return e.color;
		const cal = calendars.find((c) => c.id === e.calendarId);
		return cal?.color ?? 'brand';
	}

	function coversDate(e: CalendarAppEvent, key: string) {
		const end = e.endDate ?? e.date;
		return key >= e.date && key <= end;
	}

	function eventsOn(key: string) {
		return filteredEvents
			.filter((e) => coversDate(e, key))
			.sort((a, b) => (a.startTime ?? '').localeCompare(b.startTime ?? ''));
	}

	const monthTitle = $derived(
		date.toLocaleDateString('en', { month: 'long', year: 'numeric' })
	);

	const headerTitle = $derived.by(() => {
		if (view === 'day') {
			return date.toLocaleDateString('en', {
				weekday: 'long',
				month: 'long',
				day: 'numeric',
				year: 'numeric'
			});
		}
		if (view === 'week') {
			const start = startOfWeek(date);
			const end = addDays(start, 6);
			const sameMonth = start.getMonth() === end.getMonth();
			if (sameMonth) {
				return `${start.toLocaleDateString('en', { month: 'long' })} ${start.getDate()}–${end.getDate()}, ${end.getFullYear()}`;
			}
			return `${start.toLocaleDateString('en', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}`;
		}
		if (view === 'agenda') return 'Agenda';
		return monthTitle;
	});

	const monthCells = $derived.by(() => {
		const y = date.getFullYear();
		const m = date.getMonth();
		const first = new Date(y, m, 1);
		const startPad =
			weekStartsOn === 1 ? (first.getDay() + 6) % 7 : first.getDay();
		const daysInMonth = new Date(y, m + 1, 0).getDate();
		const out: Array<{ key: string; day: number; inMonth: boolean }> = [];
		const gridStart = addDays(first, -startPad);
		for (let i = 0; i < 42; i++) {
			const d = addDays(gridStart, i);
			out.push({
				key: iso(d),
				day: d.getDate(),
				inMonth: d.getMonth() === m
			});
		}
		return out;
	});

	const weekDays = $derived.by(() => {
		const start = startOfWeek(date);
		return Array.from({ length: 7 }, (_, i) => {
			const d = addDays(start, i);
			return { key: iso(d), date: d, label: weekdayLabels[i] };
		});
	});

	const hours = $derived(Array.from({ length: 12 }, (_, i) => i + 8)); // 08–19

	const agendaGroups = $derived.by(() => {
		const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
		const keys = Array.from({ length: 14 }, (_, i) => iso(addDays(start, i)));
		return keys
			.map((key) => ({
				key,
				label: parseIso(key).toLocaleDateString('en', {
					weekday: 'long',
					month: 'short',
					day: 'numeric'
				}),
				events: eventsOn(key)
			}))
			.filter((g) => g.events.length > 0);
	});

	const selectedEvent = $derived(
		filteredEvents.find((e) => e.id === selectedEventId) ?? null
	);

	function setView(v: CalendarView) {
		view = v;
		onviewchange?.(v);
	}

	function setDate(d: Date) {
		date = d;
		ondatechange?.(d);
	}

	function goToday() {
		setDate(new Date());
	}

	function shift(dir: -1 | 1) {
		if (view === 'month') {
			setDate(new Date(date.getFullYear(), date.getMonth() + dir, 1));
		} else if (view === 'week' || view === 'agenda') {
			setDate(addDays(date, dir * 7));
		} else {
			setDate(addDays(date, dir));
		}
	}

	function selectEvent(e: CalendarAppEvent) {
		selectedEventId = e.id;
		oneventclick?.(e);
	}

	function toggleCal(id: string, visible: boolean) {
		calendars = calendars.map((c) => (c.id === id ? { ...c, visible } : c));
		oncalendartoggle?.(id, visible);
	}

	function timeLabel(e: CalendarAppEvent) {
		if (e.allDay || (!e.startTime && !e.endTime)) return 'All day';
		if (e.startTime && e.endTime) return `${e.startTime}–${e.endTime}`;
		return e.startTime ?? '';
	}

	function hourTop(time?: string) {
		if (!time) return 0;
		const [h, m] = time.split(':').map(Number);
		return ((h - 8) * 60 + (m || 0)) / 60;
	}

	function hourSpan(e: CalendarAppEvent) {
		if (!e.startTime) return 1;
		const start = hourTop(e.startTime);
		const end = e.endTime ? hourTop(e.endTime) : start + 1;
		return Math.max(0.75, end - start);
	}
</script>

<div
	class={[
		'flex min-h-[36rem] overflow-hidden rounded-2xl border border-border bg-surface shadow-sm',
		className
	]}
>
	{#if showSidebar}
		<aside class="hidden w-56 shrink-0 flex-col border-r border-border bg-surface-elevated p-3 md:flex">
			{#if showCreate}
				<Button
					size="sm"
					class="mb-4 w-full"
					onclick={() => oncreate?.(focusKey)}
				>
					<Plus class="h-4 w-4" strokeWidth={2} />
					Create
				</Button>
			{/if}

			<p class="mb-2 px-1 text-[10px] font-semibold tracking-wider text-muted uppercase">
				My calendars
			</p>
			<ul class="space-y-1">
				{#each calendars as cal (cal.id)}
					<li>
						<label
							class="flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-1.5 hover:bg-surface-overlay"
						>
							<Checkbox
								size="sm"
								checked={cal.visible !== false}
								onchange={(v) => toggleCal(cal.id, v)}
							/>
							<span
								class={['h-2.5 w-2.5 rounded-full', toneClass[cal.color ?? 'brand']]}
								aria-hidden="true"
							></span>
							<span class="truncate text-xs font-medium text-primary">{cal.label}</span>
						</label>
					</li>
				{/each}
			</ul>

			<div class="mt-auto border-t border-border pt-3">
				<p class="px-1 text-[10px] text-muted">
					{filteredEvents.length} event{filteredEvents.length === 1 ? '' : 's'} visible
				</p>
			</div>
		</aside>
	{/if}

	<div class="flex min-w-0 flex-1 flex-col">
		<!-- Header -->
		<header
			class="flex flex-wrap items-center gap-2 border-b border-border bg-surface-elevated px-3 py-2.5 sm:gap-3 sm:px-4"
		>
			<div class="flex items-center gap-1">
				<Button size="xs" variant="secondary" onclick={goToday}>Today</Button>
				<IconButton label="Previous" size="sm" variant="ghost" onclick={() => shift(-1)}>
					<ChevronLeft class="h-4 w-4" />
				</IconButton>
				<IconButton label="Next" size="sm" variant="ghost" onclick={() => shift(1)}>
					<ChevronRight class="h-4 w-4" />
				</IconButton>
			</div>

			<h2 class="min-w-0 flex-1 truncate text-sm font-semibold text-primary sm:text-base">
				{headerTitle}
			</h2>

			{#if showSearch}
				<div class="order-last w-full sm:order-none sm:w-44 lg:w-56">
					<SearchInput bind:value={query} size="sm" placeholder="Search events…" />
				</div>
			{/if}

			<SegmentedControl
				size="sm"
				bind:value={view}
				items={[
					{ id: 'month', label: 'Month' },
					{ id: 'week', label: 'Week' },
					{ id: 'day', label: 'Day' },
					{ id: 'agenda', label: 'Agenda' }
				]}
				onchange={(v) => onviewchange?.(v as CalendarView)}
			/>
		</header>

		<div class="flex min-h-0 flex-1">
			<!-- Main views -->
			<div class="min-w-0 flex-1 overflow-auto p-2 sm:p-3">
				{#if view === 'month'}
					<div class="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-border bg-border">
						{#each weekdayLabels as wd}
							<div
								class="bg-surface-overlay/80 px-1 py-1.5 text-center text-[10px] font-semibold tracking-wide text-muted uppercase"
							>
								{wd}
							</div>
						{/each}
						{#each monthCells as cell}
							{@const dayEvents = eventsOn(cell.key)}
							<div
								class={[
									'flex min-h-[5.5rem] flex-col gap-0.5 bg-surface p-1 sm:min-h-[6.5rem]',
									!cell.inMonth && 'bg-surface-overlay/30 text-muted',
									cell.key === todayKey && 'ring-1 ring-inset ring-brand-500/40'
								]}
							>
								<button
									type="button"
									class={[
										'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold hover:bg-surface-overlay',
										cell.key === todayKey && 'bg-brand-500 text-white hover:bg-brand-600',
										cell.key === focusKey && cell.key !== todayKey && 'bg-surface-overlay'
									]}
									onclick={() => {
										setDate(parseIso(cell.key));
										ondayclick?.(cell.key);
									}}
								>
									{cell.day}
								</button>
								<div class="flex min-h-0 flex-1 flex-col gap-0.5 overflow-hidden">
									{#each dayEvents.slice(0, 3) as ev (ev.id)}
										<button
											type="button"
											class={[
												'w-full truncate rounded border px-1 py-0.5 text-left text-[10px] font-medium leading-tight',
												toneSoft[eventTone(ev)]
											]}
											onclick={() => selectEvent(ev)}
										>
											{#if ev.startTime}<span class="opacity-70">{ev.startTime} </span>{/if}
											{ev.title}
										</button>
									{/each}
									{#if dayEvents.length > 3}
										<button
											type="button"
											class="px-0.5 text-left text-[10px] font-medium text-muted hover:underline"
											onclick={() => {
												setDate(parseIso(cell.key));
												setView('day');
											}}
										>
											+{dayEvents.length - 3} more
										</button>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{:else if view === 'week' || view === 'day'}
					{@const cols =
						view === 'day'
							? [{ key: focusKey, date: new Date(date), label: '' }]
							: weekDays}
					<div class="overflow-hidden rounded-xl border border-border">
						<div
							class="grid border-b border-border bg-surface-overlay/50"
							style:grid-template-columns={`3.5rem repeat(${cols.length}, minmax(0, 1fr))`}
						>
							<div></div>
							{#each cols as col}
								<button
									type="button"
									class="border-l border-border px-1 py-2 text-center hover:bg-surface-overlay"
									onclick={() => {
										setDate(col.date ?? parseIso(col.key));
										setView('day');
									}}
								>
									<p class="text-[10px] font-semibold tracking-wide text-muted uppercase">
										{(col.date ?? parseIso(col.key)).toLocaleDateString('en', { weekday: 'short' })}
									</p>
									<p
										class={[
											'mx-auto mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold',
											col.key === todayKey ? 'bg-brand-500 text-white' : 'text-primary'
										]}
									>
										{(col.date ?? parseIso(col.key)).getDate()}
									</p>
								</button>
							{/each}
						</div>

						<div
							class="grid"
							style:grid-template-columns={`3.5rem repeat(${cols.length}, minmax(0, 1fr))`}
						>
							<div class="relative">
								{#each hours as h}
									<div class="h-14 border-b border-border/70 pr-1 text-right text-[10px] text-muted">
										{String(h).padStart(2, '0')}:00
									</div>
								{/each}
							</div>
							{#each cols as col}
								<div class="relative border-l border-border">
									{#each hours as _}
										<div class="h-14 border-b border-border/60"></div>
									{/each}
									{#each eventsOn(col.key).filter((e) => !e.allDay && e.startTime) as ev (ev.id)}
										<button
											type="button"
											class={[
												'absolute right-1 left-1 overflow-hidden rounded-md border px-1.5 py-1 text-left text-[10px] font-medium shadow-sm',
												toneSoft[eventTone(ev)]
											]}
											style:top={`${hourTop(ev.startTime) * 3.5}rem`}
											style:height={`${hourSpan(ev) * 3.5}rem`}
											onclick={() => selectEvent(ev)}
										>
											<p class="truncate font-semibold">{ev.title}</p>
											<p class="truncate opacity-80">{timeLabel(ev)}</p>
										</button>
									{/each}
									{#each eventsOn(col.key).filter((e) => e.allDay || !e.startTime) as ev (ev.id)}
										<button
											type="button"
											class={[
												'absolute top-0 right-1 left-1 z-10 truncate rounded px-1 py-0.5 text-[10px] font-medium',
												toneSoft[eventTone(ev)]
											]}
											onclick={() => selectEvent(ev)}
										>
											{ev.title}
										</button>
									{/each}
								</div>
							{/each}
						</div>
					</div>
				{:else}
					<!-- Agenda -->
					{#if agendaGroups.length === 0}
						<div class="flex h-48 items-center justify-center rounded-xl border border-dashed border-border">
							<Text size="sm" tone="muted">No upcoming events</Text>
						</div>
					{:else}
						<ul class="space-y-4">
							{#each agendaGroups as group (group.key)}
								<li>
									<p
										class={[
											'mb-2 text-xs font-semibold',
											group.key === todayKey ? 'text-brand-600 dark:text-brand-400' : 'text-secondary'
										]}
									>
										{group.label}
										{#if group.key === todayKey}
											<Badge size="sm" variant="primary" class="ml-1">Today</Badge>
										{/if}
									</p>
									<ul class="space-y-1.5">
										{#each group.events as ev (ev.id)}
											<button
												type="button"
												class={[
													'flex w-full items-start gap-3 rounded-xl border border-border bg-surface-elevated px-3 py-2.5 text-left transition hover:border-brand-500/30 hover:bg-surface-overlay',
													selectedEventId === ev.id && 'border-brand-500/40 ring-1 ring-brand-500/20'
												]}
												onclick={() => selectEvent(ev)}
											>
												<span
													class={['mt-1 h-2.5 w-2.5 shrink-0 rounded-full', toneClass[eventTone(ev)]]}
												></span>
												<div class="min-w-0 flex-1">
													<p class="truncate text-sm font-semibold text-primary">{ev.title}</p>
													<p class="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted">
														<span class="inline-flex items-center gap-1">
															<Clock class="h-3 w-3" />
															{timeLabel(ev)}
														</span>
														{#if ev.location}
															<span class="inline-flex items-center gap-1">
																<MapPin class="h-3 w-3" />
																{ev.location}
															</span>
														{/if}
													</p>
												</div>
											</button>
										{/each}
									</ul>
								</li>
							{/each}
						</ul>
					{/if}
				{/if}
			</div>

			<!-- Detail drawer -->
			{#if selectedEvent}
				<aside
					class="hidden w-64 shrink-0 flex-col border-l border-border bg-surface-elevated p-4 lg:flex"
				>
					<div class="mb-3 flex items-start justify-between gap-2">
						<span
							class={['mt-1 h-2.5 w-2.5 rounded-full', toneClass[eventTone(selectedEvent)]]}
						></span>
						<div class="min-w-0 flex-1">
							<h3 class="text-sm font-semibold text-primary">{selectedEvent.title}</h3>
							<p class="mt-1 text-xs text-muted">
								{parseIso(selectedEvent.date).toLocaleDateString('en', {
									weekday: 'short',
									month: 'short',
									day: 'numeric'
								})}
								{#if selectedEvent.endDate && selectedEvent.endDate !== selectedEvent.date}
									– {parseIso(selectedEvent.endDate).toLocaleDateString('en', {
										month: 'short',
										day: 'numeric'
									})}
								{/if}
							</p>
						</div>
						<IconButton
							label="Close"
							size="sm"
							variant="ghost"
							onclick={() => (selectedEventId = null)}
						>
							<X class="h-4 w-4" />
						</IconButton>
					</div>

					<div class="space-y-3 text-xs text-secondary">
						<p class="inline-flex items-center gap-1.5">
							<Clock class="h-3.5 w-3.5 text-muted" />
							{timeLabel(selectedEvent)}
						</p>
						{#if selectedEvent.location}
							<p class="inline-flex items-center gap-1.5">
								<MapPin class="h-3.5 w-3.5 text-muted" />
								{selectedEvent.location}
							</p>
						{/if}
						{#if selectedEvent.calendarId}
							{@const cal = calendars.find((c) => c.id === selectedEvent.calendarId)}
							{#if cal}
								<p class="inline-flex items-center gap-1.5">
									<span class={['h-2 w-2 rounded-full', toneClass[cal.color ?? 'brand']]}></span>
									{cal.label}
								</p>
							{/if}
						{/if}
						{#if selectedEvent.description}
							<p class="leading-relaxed text-secondary">{selectedEvent.description}</p>
						{/if}
					</div>
				</aside>
			{/if}
		</div>
	</div>
</div>
