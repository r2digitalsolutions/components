<script lang="ts">
	import type { Snippet } from 'svelte';
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import Calendar from '$lib/components/molecules/Calendar/Calendar.svelte';
	import SegmentedControl from '$lib/components/molecules/SegmentedControl/SegmentedControl.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';
	import Clock from '@lucide/svelte/icons/clock';
	import Globe from '@lucide/svelte/icons/globe';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Video from '@lucide/svelte/icons/video';
	import Phone from '@lucide/svelte/icons/phone';
	import Users from '@lucide/svelte/icons/users';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import CalendarDays from '@lucide/svelte/icons/calendar-days';

	export type ScheduleDuration = 15 | 30 | 45 | 60;
	export type ScheduleMeetingType = 'video' | 'phone' | 'inperson';
	export type SchedulerSlotLayout = 'list' | 'grid';
	export type SchedulePeriod = 'morning' | 'afternoon' | 'evening';
	export type SchedulerMode = 'single' | 'range';

	export interface ScheduleHost {
		name: string;
		title?: string;
		avatar?: string;
	}

	export interface ScheduleSlot {
		id: string;
		/** Display time, e.g. 09:00 */
		time: string;
		/** Optional end time, e.g. 09:30 */
		endTime?: string;
		/** YYYY-MM-DD — if omitted, slot applies to any selected day */
		date?: string;
		available?: boolean;
		period?: SchedulePeriod;
	}

	export interface ScheduleBooking {
		id: string;
		slotId: string;
		title: string;
		with?: string;
		avatar?: string;
	}

	export interface ScheduleConfirmDetail {
		mode: SchedulerMode;
		slotId: string | null;
		/** Active / start day */
		date: string;
		start: string;
		end: string;
		duration: ScheduleDuration;
		/** Inclusive nights between start and end (0 for single day) */
		nights: number;
	}

	interface SchedulerProps {
		title?: string;
		description?: string;
		/** @deprecated Prefer bind:date — kept for simple labels */
		dateLabel?: string;
		/** single day or date range */
		mode?: SchedulerMode;
		/** Selected day YYYY-MM-DD (single mode, or focus day in range) */
		date?: string;
		/** Range start YYYY-MM-DD */
		start?: string;
		/** Range end YYYY-MM-DD */
		end?: string;
		/** Months shown in calendar (2 is typical for range) */
		months?: 1 | 2;
		slots?: ScheduleSlot[];
		bookings?: ScheduleBooking[];
		selectedSlotId?: string | null;
		host?: ScheduleHost | null;
		duration?: ScheduleDuration;
		durations?: ScheduleDuration[];
		timezone?: string;
		meetingType?: ScheduleMeetingType;
		location?: string;
		slotLayout?: SchedulerSlotLayout;
		/** Show embedded month calendar */
		showCalendar?: boolean;
		/** Show quick week strip */
		showWeekStrip?: boolean;
		/** Group slots into morning / afternoon / evening */
		groupByPeriod?: boolean;
		/** Confirm CTA when selection is ready */
		showConfirm?: boolean;
		confirmLabel?: string;
		/**
		 * In range mode, allow confirming with only dates (no time slot).
		 * Default: false — still requires a start-time slot when slots exist.
		 */
		allowDateOnly?: boolean;
		minDate?: string;
		maxDate?: string;
		locale?: string;
		class?: string;
		actions?: Snippet;
		ondatechange?: (date: string) => void;
		onrangechange?: (detail: { start: string; end: string }) => void;
		ondurationchange?: (duration: ScheduleDuration) => void;
		onselect?: (slotId: string) => void;
		onconfirm?: (detail: ScheduleConfirmDetail) => void;
		onclear?: () => void;
	}

	function todayIso(d = new Date()) {
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
	}

	function addDaysIso(iso: string, delta: number) {
		const [y, m, d] = iso.split('-').map(Number);
		const dt = new Date(y, m - 1, d + delta);
		return todayIso(dt);
	}

	function periodOf(time: string): SchedulePeriod {
		const h = Number(time.slice(0, 2));
		if (h < 12) return 'morning';
		if (h < 17) return 'afternoon';
		return 'evening';
	}

	function endFrom(time: string, mins: number) {
		const [h, m] = time.split(':').map(Number);
		const total = h * 60 + m + mins;
		const eh = Math.floor(total / 60) % 24;
		const em = total % 60;
		return `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`;
	}

	const defaultSlots: ScheduleSlot[] = (() => {
		const base = todayIso();
		const days = [0, 1, 2, 3, 5].map((d) => addDaysIso(base, d));
		const times = ['09:00', '09:30', '10:00', '11:00', '13:00', '14:00', '14:30', '15:30', '16:00', '17:00'];
		const out: ScheduleSlot[] = [];
		for (const date of days) {
			for (const time of times) {
				const id = `${date}-${time}`;
				out.push({
					id,
					date,
					time,
					endTime: endFrom(time, 30),
					period: periodOf(time),
					available: !(time === '11:00' && date === days[0])
				});
			}
		}
		return out;
	})();

	let {
		title = 'Book a meeting',
		description = 'Choose a day and time that works for you.',
		dateLabel,
		mode = 'single' as SchedulerMode,
		date = $bindable(todayIso()),
		start = $bindable(todayIso()),
		end = $bindable(''),
		months,
		slots = defaultSlots,
		bookings = $bindable([
			{
				id: 'b1',
				slotId: `${todayIso()}-10:00`,
				title: 'Design review',
				with: 'Maya Chen'
			},
			{
				id: 'b2',
				slotId: `${addDaysIso(todayIso(), 1)}-14:00`,
				title: 'Customer call',
				with: 'Luis Ortega'
			}
		] as ScheduleBooking[]),
		selectedSlotId = $bindable(null as string | null),
		host = {
			name: 'Alex Rivera',
			title: 'Product Specialist',
			avatar: undefined
		} as ScheduleHost,
		duration = $bindable(30 as ScheduleDuration),
		durations = [15, 30, 45, 60] as ScheduleDuration[],
		timezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
		meetingType = 'video' as ScheduleMeetingType,
		location = 'Google Meet',
		slotLayout = $bindable('grid' as SchedulerSlotLayout),
		showCalendar = true,
		showWeekStrip = true,
		groupByPeriod = true,
		showConfirm = true,
		confirmLabel = 'Confirm',
		allowDateOnly = false,
		minDate,
		maxDate,
		locale = 'en',
		class: className = '',
		actions,
		ondatechange,
		onrangechange,
		ondurationchange,
		onselect,
		onconfirm,
		onclear
	}: SchedulerProps = $props();

	const isRange = $derived(mode === 'range');
	const calendarMonths = $derived(months ?? (isRange ? 2 : 1));
	/** Day used to load time slots */
	const focusDate = $derived(isRange ? start || date : date);

	const durationItems = $derived(durations.map((d) => ({ id: String(d), label: `${d}m` })));
	const layoutItems = [
		{ id: 'grid', label: 'Grid' },
		{ id: 'list', label: 'List' }
	];

	const MeetingIcon = $derived(
		meetingType === 'phone' ? Phone : meetingType === 'inperson' ? MapPin : Video
	);

	const datesWithSlots = $derived(
		[
			...new Set(
				slots
					.filter((s) => s.available !== false)
					.map((s) => s.date)
					.filter((d): d is string => !!d)
			)
		].sort()
	);

	const calendarDots = $derived(datesWithSlots.map((d) => ({ date: d, color: 'var(--color-brand-500, #6366f1)' })));

	function formatDay(iso: string, opts: Intl.DateTimeFormatOptions) {
		if (!iso) return '';
		const [y, m, d] = iso.split('-').map(Number);
		return new Date(y, m - 1, d).toLocaleDateString(locale, opts);
	}

	function nightsBetween(a: string, b: string) {
		if (!a || !b) return 0;
		const [y1, m1, d1] = a.split('-').map(Number);
		const [y2, m2, d2] = b.split('-').map(Number);
		const ms = new Date(y2, m2 - 1, d2).getTime() - new Date(y1, m1 - 1, d1).getTime();
		return Math.max(0, Math.round(ms / 86400000));
	}

	function inRange(iso: string, from: string, to: string) {
		if (!from) return false;
		if (!to) return iso === from;
		const lo = from <= to ? from : to;
		const hi = from <= to ? to : from;
		return iso >= lo && iso <= hi;
	}

	const weekDays = $derived.by(() => {
		const anchorIso = focusDate || todayIso();
		const [y, m, d] = anchorIso.split('-').map(Number);
		const dow = (new Date(y, m - 1, d).getDay() + 6) % 7; // Mon=0
		const monday = new Date(y, m - 1, d - dow);
		return Array.from({ length: 7 }, (_, i) => {
			const dt = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
			const iso = todayIso(dt);
			return {
				iso,
				label: dt.toLocaleDateString(locale, { weekday: 'short' }),
				day: dt.getDate(),
				hasSlots: datesWithSlots.includes(iso) || slots.some((s) => !s.date && s.available !== false),
				isToday: iso === todayIso(),
				inSelection: isRange ? inRange(iso, start, end) : iso === date,
				isStart: isRange && iso === start,
				isEnd: isRange && !!end && iso === end
			};
		});
	});

	const rangeComplete = $derived(!isRange || (!!start && !!end));

	const nights = $derived(isRange && start && end ? nightsBetween(start, end) : 0);

	const formattedDate = $derived.by(() => {
		if (dateLabel) return dateLabel;
		if (isRange) {
			if (start && end) {
				const sameMonth =
					start.slice(0, 7) === end.slice(0, 7);
				const left = formatDay(start, { month: 'short', day: 'numeric', weekday: 'short' });
				const right = formatDay(
					end,
					sameMonth
						? { day: 'numeric', weekday: 'short' }
						: { month: 'short', day: 'numeric', weekday: 'short' }
				);
				return `${left} – ${right}`;
			}
			if (start) {
				return `${formatDay(start, { weekday: 'long', month: 'short', day: 'numeric' })} → …`;
			}
			return 'Select dates';
		}
		return formatDay(date, { weekday: 'long', month: 'short', day: 'numeric' });
	});

	function bookingFor(slotId: string) {
		return bookings.find((b) => b.slotId === slotId);
	}

	const daySlots = $derived(
		slots
			.filter((s) => !s.date || s.date === focusDate)
			.map((s) => ({
				...s,
				endTime: s.endTime ?? endFrom(s.time, duration),
				period: s.period ?? periodOf(s.time)
			}))
			.sort((a, b) => a.time.localeCompare(b.time))
	);

	const openCount = $derived(
		daySlots.filter((s) => s.available !== false && !bookingFor(s.id)).length
	);

	const selectedSlot = $derived(daySlots.find((s) => s.id === selectedSlotId) ?? null);

	const canConfirm = $derived.by(() => {
		if (!rangeComplete) return false;
		if (selectedSlotId) return true;
		if (allowDateOnly && isRange) return true;
		return false;
	});

	const periodGroups = $derived.by(() => {
		const order: SchedulePeriod[] = ['morning', 'afternoon', 'evening'];
		const labels: Record<SchedulePeriod, string> = {
			morning: 'Morning',
			afternoon: 'Afternoon',
			evening: 'Evening'
		};
		return order
			.map((period) => ({
				period,
				label: labels[period],
				slots: daySlots.filter((s) => s.period === period)
			}))
			.filter((g) => g.slots.length > 0);
	});

	function setDate(next: string) {
		if (minDate && next < minDate) return;
		if (maxDate && next > maxDate) return;
		date = next;
		if (isRange) {
			// Week-strip / focus: move start; clear end so user completes range again
			start = next;
			end = '';
			onrangechange?.({ start: next, end: '' });
		}
		selectedSlotId = null;
		ondatechange?.(next);
	}

	function setRange(nextStart: string, nextEnd: string) {
		start = nextStart;
		end = nextEnd;
		if (nextStart) {
			date = nextStart;
			ondatechange?.(nextStart);
		}
		selectedSlotId = null;
		onrangechange?.({ start: nextStart, end: nextEnd });
	}

	function shiftWeek(delta: number) {
		setDate(addDaysIso(focusDate || todayIso(), delta * 7));
	}

	function setDuration(id: string) {
		duration = Number(id) as ScheduleDuration;
		ondurationchange?.(duration);
	}

	function select(slot: ScheduleSlot) {
		if (slot.available === false || bookingFor(slot.id)) return;
		if (isRange && !rangeComplete) return;
		selectedSlotId = slot.id;
		onselect?.(slot.id);
	}

	function confirm() {
		if (!canConfirm) return;
		const s = isRange ? start : date;
		const e = isRange ? end || start : date;
		onconfirm?.({
			mode,
			slotId: selectedSlotId,
			date: s,
			start: s,
			end: e,
			duration,
			nights: nightsBetween(s, e)
		});
	}

	function clearSelection() {
		selectedSlotId = null;
		if (isRange) {
			end = '';
			onrangechange?.({ start, end: '' });
		}
		onclear?.();
	}

	function isTaken(slot: ScheduleSlot) {
		return !!bookingFor(slot.id) || slot.available === false;
	}
</script>

<div class={['mx-auto w-full max-w-6xl space-y-5', className]}>
	<PageHeader {title} {description}>
		{#snippet actions()}
			{#if actions}
				{@render actions()}
			{/if}
		{/snippet}
	</PageHeader>

	{#if host}
		<div
			class="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface-elevated p-3 sm:p-4"
		>
			<Avatar name={host.name} src={host.avatar} size="lg" status="online" />
			<div class="min-w-0 flex-1">
				<p class="text-sm font-semibold text-primary">{host.name}</p>
				{#if host.title}
					<p class="text-xs text-muted">{host.title}</p>
				{/if}
				<div class="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-muted">
					<span class="inline-flex items-center gap-1">
						<Clock class="h-3 w-3" strokeWidth={2} />
						{duration} min
					</span>
					<span class="inline-flex items-center gap-1">
						<MeetingIcon class="h-3 w-3" strokeWidth={2} />
						{location}
					</span>
					<span class="inline-flex items-center gap-1">
						<Globe class="h-3 w-3" strokeWidth={2} />
						{timezone}
					</span>
				</div>
			</div>
			<div class="flex flex-wrap items-center gap-2">
				{#if durations.length > 1}
					<SegmentedControl
						items={durationItems}
						value={String(duration)}
						size="sm"
						onchange={setDuration}
					/>
				{/if}
			</div>
		</div>
	{/if}

	<div
		class={[
			'grid gap-5',
			showCalendar && calendarMonths === 2
				? 'xl:grid-cols-[minmax(28rem,36rem)_minmax(0,1fr)]'
				: showCalendar
					? 'lg:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)]'
					: ''
		]}
	>
		{#if showCalendar}
			<aside class="min-w-0 space-y-3">
				{#if isRange}
					<Calendar
						mode="range"
						months={calendarMonths}
						start={start}
						end={end}
						min={minDate}
						max={maxDate}
						dots={calendarDots}
						framed
						onchange={(detail) => {
							setRange(detail.start, detail.end);
						}}
					/>
					<p class="px-1 text-[11px] text-muted">
						Select check-in and check-out. Then pick a start time.
					</p>
				{:else}
					<Calendar
						mode="single"
						months={calendarMonths}
						value={date}
						min={minDate}
						max={maxDate}
						dots={calendarDots}
						enabledDates={datesWithSlots.length ? datesWithSlots : undefined}
						framed
						onchange={(detail) => {
							if (detail.value) setDate(detail.value);
						}}
					/>
					<p class="px-1 text-[11px] text-muted">
						Days with a brand dot have open times.
					</p>
				{/if}
			</aside>
		{/if}

		<section class="min-w-0 space-y-4">
			{#if showWeekStrip}
				<div class="flex items-center gap-1">
					<IconButton size="sm" variant="ghost" label="Previous week" onclick={() => shiftWeek(-1)}>
						<ChevronLeft class="h-4 w-4" strokeWidth={2} />
					</IconButton>
					<div class="grid min-w-0 flex-1 grid-cols-7 gap-1">
						{#each weekDays as day (day.iso)}
							<button
								type="button"
								disabled={!isRange && !day.hasSlots && datesWithSlots.length > 0}
								onclick={() => setDate(day.iso)}
								class={[
									'flex flex-col items-center rounded-xl px-1 py-2 text-center transition-colors',
									'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
									day.inSelection && !day.isStart && !day.isEnd && isRange
										? 'bg-brand-500/15 text-brand-800 dark:text-brand-200'
										: '',
									(day.isStart || (!isRange && day.iso === date) || day.isEnd)
										? 'bg-brand-500 text-white shadow-sm'
										: !day.inSelection && day.hasSlots
											? 'bg-surface-elevated text-primary hover:bg-surface-overlay'
											: !day.inSelection
												? 'text-muted'
												: '',
									!isRange && !day.hasSlots && datesWithSlots.length > 0 && 'cursor-not-allowed opacity-40',
									day.isToday && !day.inSelection && 'ring-1 ring-brand-500/40'
								]}
							>
								<span class="text-[10px] font-medium uppercase tracking-wide opacity-80"
									>{day.label}</span
								>
								<span class="text-sm font-semibold tabular-nums">{day.day}</span>
							</button>
						{/each}
					</div>
					<IconButton size="sm" variant="ghost" label="Next week" onclick={() => shiftWeek(1)}>
						<ChevronRight class="h-4 w-4" strokeWidth={2} />
					</IconButton>
				</div>
			{/if}

			<div class="flex flex-wrap items-center justify-between gap-2">
				<div class="min-w-0">
					<p class="text-sm font-semibold text-primary">{formattedDate}</p>
					<p class="text-xs text-muted">
						{#if isRange && !rangeComplete}
							<span>Pick an end date to continue</span>
						{:else}
							<span class="inline-flex items-center gap-1">
								<CalendarDays class="h-3 w-3" strokeWidth={2} />
								{#if isRange && nights > 0}
									{nights} night{nights === 1 ? '' : 's'} ·
								{/if}
								{openCount} open slot{openCount === 1 ? '' : 's'}
								{#if isRange}
									on start day
								{/if}
							</span>
						{/if}
					</p>
				</div>
				<div class="flex flex-wrap items-center gap-2">
					{#if isRange && nights > 0}
						<Badge size="sm" variant="info">{nights} night{nights === 1 ? '' : 's'}</Badge>
					{/if}
					<Badge size="sm" variant="secondary">{duration} min</Badge>
					<SegmentedControl
						items={layoutItems}
						bind:value={slotLayout}
						size="sm"
					/>
				</div>
			</div>

			{#if isRange && !rangeComplete}
				<EmptyState
					title="Finish your date range"
					description="Choose a check-out day on the calendar. Start time slots unlock after that."
				/>
			{:else if daySlots.length === 0}
				<EmptyState
					title="No times this day"
					description={isRange
						? 'No start times on the check-in day. Try another start date.'
						: 'Pick another day from the calendar or week strip.'}
				>
					{#snippet action()}
						{#if allowDateOnly && isRange && rangeComplete}
							<Button size="sm" onclick={confirm}>Continue without time</Button>
						{/if}
					{/snippet}
				</EmptyState>
			{:else if groupByPeriod}
				<div class="space-y-4">
					{#each periodGroups as group (group.period)}
						<div class="space-y-2">
							<p
								class="px-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted"
							>
								{group.label}
							</p>
							{#if slotLayout === 'grid'}
								<ul class="grid grid-cols-2 gap-2 sm:grid-cols-3">
									{#each group.slots as slot (slot.id)}
										{@const booking = bookingFor(slot.id)}
										{@const taken = isTaken(slot)}
										{@const selected = selectedSlotId === slot.id}
										<li>
											<button
												type="button"
												disabled={taken}
												onclick={() => select(slot)}
												class={[
													'flex w-full flex-col items-start gap-0.5 rounded-xl border px-3 py-2.5 text-left transition-colors',
													'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
													selected && 'border-brand-500/50 bg-brand-500/10 ring-1 ring-brand-500/20',
													!selected &&
														!taken &&
														'border-border bg-surface-elevated hover:border-brand-500/35 hover:bg-surface-overlay',
													taken && 'cursor-not-allowed border-border/60 bg-surface opacity-55'
												]}
											>
												<span class="font-mono text-sm font-semibold tabular-nums text-primary"
													>{slot.time}</span
												>
												{#if booking}
													<span class="w-full truncate text-[11px] text-secondary"
														>{booking.title}</span
													>
												{:else if taken}
													<span class="text-[11px] text-muted">Unavailable</span>
												{:else}
													<span class="text-[11px] text-muted"
														>{slot.endTime ?? endFrom(slot.time, duration)}</span
													>
												{/if}
											</button>
										</li>
									{/each}
								</ul>
							{:else}
								<ul class="space-y-1.5">
									{#each group.slots as slot (slot.id)}
										{@const booking = bookingFor(slot.id)}
										{@const taken = isTaken(slot)}
										{@const selected = selectedSlotId === slot.id}
										<li>
											<button
												type="button"
												disabled={taken}
												onclick={() => select(slot)}
												class={[
													'flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors',
													'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
													selected && 'border-brand-500/50 bg-brand-500/10',
													!selected &&
														!taken &&
														'border-border bg-surface-elevated hover:border-brand-500/30 hover:bg-surface-overlay',
													taken && 'cursor-not-allowed border-border/60 bg-surface opacity-60'
												]}
											>
												<span class="w-24 shrink-0 font-mono text-xs font-semibold tabular-nums text-primary">
													{slot.time}
													{#if slot.endTime}
														<span class="font-normal text-muted">– {slot.endTime}</span>
													{/if}
												</span>
												{#if booking}
													<span class="flex min-w-0 flex-1 items-center gap-2">
														{#if booking.avatar || booking.with}
															<Avatar
																name={booking.with ?? booking.title}
																src={booking.avatar}
																size="xs"
																ringed={false}
															/>
														{:else}
															<span
																class="flex h-6 w-6 items-center justify-center rounded-full bg-surface-overlay text-muted"
															>
																<Users class="h-3 w-3" strokeWidth={2} />
															</span>
														{/if}
														<span class="min-w-0 truncate text-xs text-secondary">
															{booking.title}{#if booking.with}
																· {booking.with}{/if}
														</span>
													</span>
												{:else if taken}
													<Text size="xs" tone="muted" as="span">Unavailable</Text>
												{:else if selected}
													<span class="text-xs font-medium text-brand-700 dark:text-brand-300"
														>Selected</span
													>
												{:else}
													<span class="text-xs text-muted">Available</span>
												{/if}
											</button>
										</li>
									{/each}
								</ul>
							{/if}
						</div>
					{/each}
				</div>
			{:else}
				<!-- flat list without period groups -->
				{#if slotLayout === 'grid'}
					<ul class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
						{#each daySlots as slot (slot.id)}
							{@const booking = bookingFor(slot.id)}
							{@const taken = isTaken(slot)}
							{@const selected = selectedSlotId === slot.id}
							<li>
								<button
									type="button"
									disabled={taken}
									onclick={() => select(slot)}
									class={[
										'flex w-full flex-col items-start gap-0.5 rounded-xl border px-3 py-2.5 text-left transition-colors',
										selected && 'border-brand-500/50 bg-brand-500/10 ring-1 ring-brand-500/20',
										!selected &&
											!taken &&
											'border-border bg-surface-elevated hover:border-brand-500/35',
										taken && 'cursor-not-allowed opacity-55'
									]}
								>
									<span class="font-mono text-sm font-semibold tabular-nums">{slot.time}</span>
									<span class="text-[11px] text-muted">
										{booking ? booking.title : taken ? 'Unavailable' : (slot.endTime ?? '')}
									</span>
								</button>
							</li>
						{/each}
					</ul>
				{:else}
					<ul class="space-y-1.5">
						{#each daySlots as slot (slot.id)}
							{@const booking = bookingFor(slot.id)}
							{@const taken = isTaken(slot)}
							{@const selected = selectedSlotId === slot.id}
							<li>
								<button
									type="button"
									disabled={taken}
									onclick={() => select(slot)}
									class={[
										'flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors',
										selected && 'border-brand-500/50 bg-brand-500/10',
										!selected && !taken && 'border-border bg-surface-elevated hover:border-brand-500/30',
										taken && 'cursor-not-allowed opacity-60'
									]}
								>
									<span class="font-mono text-xs font-medium text-primary">{slot.time}</span>
									{#if booking}
										<span class="min-w-0 truncate text-xs text-secondary">
											{booking.title}{#if booking.with} · {booking.with}{/if}
										</span>
									{:else if taken}
										<Text size="xs" tone="muted" as="span">Unavailable</Text>
									{:else if selected}
										<span class="text-xs font-medium text-brand-700 dark:text-brand-300"
											>Selected</span
										>
									{:else}
										<span class="text-xs text-muted">Available</span>
									{/if}
								</button>
							</li>
						{/each}
					</ul>
				{/if}
			{/if}

			{#if showConfirm && canConfirm}
				<div
					class="sticky bottom-0 flex flex-col gap-3 rounded-2xl border border-brand-500/30 bg-surface-elevated p-3 shadow-lg sm:flex-row sm:items-center"
				>
					<div class="min-w-0 flex-1">
						<p class="text-sm font-semibold text-primary">
							{formattedDate}
							{#if selectedSlot}
								· {selectedSlot.time}
								{#if selectedSlot.endTime}
									– {selectedSlot.endTime}
								{/if}
							{/if}
						</p>
						<p class="text-xs text-muted">
							{#if isRange && nights > 0}
								{nights} night{nights === 1 ? '' : 's'} ·
							{/if}
							{duration} min · {timezone}
							{#if host}· with {host.name}{/if}
						</p>
					</div>
					<div class="flex shrink-0 gap-2">
						<Button size="sm" variant="ghost" onclick={clearSelection}>Clear</Button>
						<Button size="sm" onclick={confirm}>{confirmLabel}</Button>
					</div>
				</div>
			{/if}
		</section>
	</div>
</div>
