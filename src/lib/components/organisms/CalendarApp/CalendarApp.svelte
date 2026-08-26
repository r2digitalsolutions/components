<script lang="ts">
	import { onDestroy, type Snippet } from 'svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Checkbox from '$lib/components/atoms/Checkbox/Checkbox.svelte';
	import SegmentedControl from '$lib/components/molecules/SegmentedControl/SegmentedControl.svelte';
	import SearchInput from '$lib/components/molecules/SearchInput/SearchInput.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';
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

	export interface CalendarAppLabels {
		create?: string;
		myCalendars?: string;
		today?: string;
		search?: string;
		month?: string;
		week?: string;
		day?: string;
		agenda?: string;
		allDay?: string;
		eventsVisible?: string;
		noEvents?: string;
		dayEvents?: string;
		close?: string;
		previous?: string;
		next?: string;
		back?: string;
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
		/** Right detail panel (day agenda / event detail) on lg+ */
		showDetailPanel?: boolean;
		/** i18n-friendly UI strings; English defaults when omitted */
		labels?: CalendarAppLabels;
		/** Locale for toLocaleDateString (default `'en'`) */
		locale?: string;
		weekStartsOn?: 0 | 1;
		/** Allow resizing timed events in week / day views */
		resizable?: boolean;
		/** Allow dragging timed events to a new time / day */
		draggableEvents?: boolean;
		/** Snap interval while resizing / dragging (minutes) */
		resizeSnapMinutes?: number;
		/** Minimum event duration when resizing (minutes) */
		resizeMinMinutes?: number;
		class?: string;
		/** Host actions (Edit / Delete / Open) under event detail */
		eventActions?: Snippet<[CalendarAppEvent]>;
		onviewchange?: (view: CalendarView) => void;
		ondatechange?: (date: Date) => void;
		oneventclick?: (event: CalendarAppEvent) => void;
		ondayclick?: (date: string) => void;
		oncreate?: (date: string) => void;
		oncalendartoggle?: (id: string, visible: boolean) => void;
		onresize?: (
			event: CalendarAppEvent,
			detail: { startTime: string; endTime: string }
		) => void;
		onmove?: (
			event: CalendarAppEvent,
			detail: { date: string; startTime: string; endTime: string }
		) => void;
	}

	const DEFAULT_LABELS: Required<CalendarAppLabels> = {
		create: 'Create',
		myCalendars: 'My calendars',
		today: 'Today',
		search: 'Search events…',
		month: 'Month',
		week: 'Week',
		day: 'Day',
		agenda: 'Agenda',
		allDay: 'All day',
		eventsVisible: '{n} events visible',
		noEvents: 'No events',
		dayEvents: 'Day events',
		close: 'Close',
		previous: 'Previous',
		next: 'Next',
		back: 'Back'
	};

	let {
		events = $bindable([] as CalendarAppEvent[]),
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
		showDetailPanel = true,
		labels = undefined,
		locale = 'en',
		weekStartsOn = 1,
		resizable = true,
		draggableEvents = true,
		resizeSnapMinutes = 15,
		resizeMinMinutes = 15,
		class: className = '',
		eventActions,
		onviewchange,
		ondatechange,
		oneventclick,
		ondayclick,
		oncreate,
		oncalendartoggle,
		onresize,
		onmove
	}: CalendarAppProps = $props();

	const ui = $derived({ ...DEFAULT_LABELS, ...labels });

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
		date.toLocaleDateString(locale, { month: 'long', year: 'numeric' })
	);

	const headerTitle = $derived.by(() => {
		if (view === 'day') {
			return date.toLocaleDateString(locale, {
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
				return `${start.toLocaleDateString(locale, { month: 'long' })} ${start.getDate()}–${end.getDate()}, ${end.getFullYear()}`;
			}
			return `${start.toLocaleDateString(locale, { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}`;
		}
		if (view === 'agenda') return ui.agenda;
		return monthTitle;
	});

	const focusDayHeading = $derived(
		date.toLocaleDateString(locale, {
			weekday: 'long',
			month: 'long',
			day: 'numeric'
		})
	);

	const focusDayEvents = $derived(eventsOn(focusKey));

	const eventsVisibleLabel = $derived(ui.eventsVisible.replace('{n}', String(filteredEvents.length)));

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
				label: parseIso(key).toLocaleDateString(locale, {
					weekday: 'long',
					month: 'short',
					day: 'numeric'
				}),
				events: eventsOn(key)
			}))
			.filter((g) => g.events.length > 0);
	});

	let selectedEvent = $state<CalendarAppEvent | null>(null);

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
		selectedEvent = {
			id: e.id,
			title: e.title,
			date: e.date,
			endDate: e.endDate,
			startTime: e.startTime,
			endTime: e.endTime,
			allDay: e.allDay,
			calendarId: e.calendarId,
			color: e.color,
			location: e.location,
			description: e.description
		};
		selectedEventId = e.id;
		oneventclick?.(e);
	}

	function clearSelectedEvent() {
		selectedEvent = null;
		selectedEventId = null;
	}
	function toggleCal(id: string, visible: boolean) {
		calendars = calendars.map((c) => (c.id === id ? { ...c, visible } : c));
		oncalendartoggle?.(id, visible);
	}

	function timeLabel(e: CalendarAppEvent) {
		if (e.allDay || (!e.startTime && !e.endTime)) return ui.allDay;
		if (e.startTime && e.endTime) return `${e.startTime}–${e.endTime}`;
		return e.startTime ?? '';
	}

	function hourTop(time?: string) {
		if (!time) return 0;
		const [h, m] = time.split(':').map(Number);
		return ((h - HOUR_START) * 60 + (m || 0)) / 60;
	}

	function hourSpan(e: CalendarAppEvent) {
		if (!e.startTime) return 1;
		const start = hourTop(e.startTime);
		const end = e.endTime ? hourTop(e.endTime) : start + 1;
		return Math.max(0.75, end - start);
	}

	const HOUR_START = 8;
	const HOUR_END = 20;
	const HOUR_PX = 56; // h-14
	const DRAG_THRESHOLD = 4;

	type ResizeEdge = 'start' | 'end';

	interface LiveDraft {
		id: string;
		date: string;
		startTime: string;
		endTime: string;
	}

	interface ResizeSession {
		id: string;
		edge: ResizeEdge;
		column: HTMLElement;
		origDate: string;
		origStart: number;
		origEnd: number;
		pointerId: number;
	}

	interface DragSession {
		id: string;
		pointerId: number;
		origDate: string;
		origStart: number;
		origEnd: number;
		duration: number;
		grabOffset: number;
		grid: HTMLElement;
		startX: number;
		startY: number;
		active: boolean;
	}

	let resizeSession = $state<ResizeSession | null>(null);
	let dragSession = $state<DragSession | null>(null);
	/** Live preview while resizing or dragging */
	let liveDraft = $state<LiveDraft | null>(null);
	let suppressClick = $state(false);

	function parseMinutes(time: string) {
		const [h, m] = time.split(':').map(Number);
		return h * 60 + (m || 0);
	}

	function formatMinutes(total: number) {
		const clamped = Math.min(HOUR_END * 60, Math.max(HOUR_START * 60, total));
		const h = Math.floor(clamped / 60);
		const m = clamped % 60;
		return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
	}

	function snapMinutes(total: number) {
		const step = Math.max(5, resizeSnapMinutes);
		return Math.round(total / step) * step;
	}

	function displayEvent(e: CalendarAppEvent): CalendarAppEvent {
		if (liveDraft?.id === e.id) {
			return {
				...e,
				date: liveDraft.date,
				startTime: liveDraft.startTime,
				endTime: liveDraft.endTime
			};
		}
		return e;
	}

	function timedEventsOn(key: string) {
		return filteredEvents
			.filter((e) => !e.allDay && e.startTime)
			.filter((e) => {
				if (liveDraft?.id === e.id) return liveDraft.date === key;
				return e.date === key || coversDate(e, key);
			})
			.sort((a, b) => {
				const aStart = liveDraft?.id === a.id ? liveDraft.startTime : (a.startTime ?? '');
				const bStart = liveDraft?.id === b.id ? liveDraft.startTime : (b.startTime ?? '');
				return aStart.localeCompare(bStart);
			});
	}

	function yToMinutes(clientY: number, column: HTMLElement) {
		const top = column.getBoundingClientRect().top;
		const y = clientY - top;
		const raw = HOUR_START * 60 + (y / HOUR_PX) * 60;
		return snapMinutes(raw);
	}

	function columnKeyAt(clientX: number, grid: HTMLElement): string | null {
		const cols = [...grid.querySelectorAll<HTMLElement>('[data-cal-day]')];
		for (const col of cols) {
			const r = col.getBoundingClientRect();
			if (clientX >= r.left && clientX < r.right) return col.dataset.calDay ?? null;
		}
		// Clamp to nearest column when dragging past edges
		if (!cols.length) return null;
		const first = cols[0].getBoundingClientRect();
		const last = cols[cols.length - 1].getBoundingClientRect();
		if (clientX < first.left) return cols[0].dataset.calDay ?? null;
		if (clientX >= last.right) return cols[cols.length - 1].dataset.calDay ?? null;
		return null;
	}

	function columnEl(grid: HTMLElement, key: string) {
		return grid.querySelector<HTMLElement>(`[data-cal-day="${key}"]`);
	}

	function beginResize(e: PointerEvent, ev: CalendarAppEvent, edge: ResizeEdge) {
		if (!resizable || dragSession || ev.allDay || !ev.startTime) return;
		e.preventDefault();
		e.stopPropagation();
		const handle = e.currentTarget as HTMLElement;
		const column = handle.closest('[data-cal-day]') as HTMLElement | null;
		if (!column) return;
		const start = parseMinutes(ev.startTime);
		const end = parseMinutes(ev.endTime ?? formatMinutes(start + 60));
		resizeSession = {
			id: ev.id,
			edge,
			column,
			origDate: ev.date,
			origStart: start,
			origEnd: end,
			pointerId: e.pointerId
		};
		liveDraft = {
			id: ev.id,
			date: ev.date,
			startTime: ev.startTime,
			endTime: ev.endTime ?? formatMinutes(start + 60)
		};
		handle.setPointerCapture(e.pointerId);
	}

	function moveResize(e: PointerEvent) {
		const session = resizeSession;
		if (!session || e.pointerId !== session.pointerId) return;
		const minDur = Math.max(5, resizeMinMinutes);
		let start = session.origStart;
		let end = session.origEnd;
		const at = yToMinutes(e.clientY, session.column);
		if (session.edge === 'start') {
			start = Math.min(at, end - minDur);
			start = Math.max(HOUR_START * 60, start);
		} else {
			end = Math.max(at, start + minDur);
			end = Math.min(HOUR_END * 60, end);
		}
		liveDraft = {
			id: session.id,
			date: session.origDate,
			startTime: formatMinutes(start),
			endTime: formatMinutes(end)
		};
	}

	function endResize(e: PointerEvent) {
		const session = resizeSession;
		if (!session || e.pointerId !== session.pointerId) return;
		const draft = liveDraft;
		const changed =
			!!draft &&
			(draft.startTime !== formatMinutes(session.origStart) ||
				draft.endTime !== formatMinutes(session.origEnd));
		resizeSession = null;
		if (!draft) return;
		if (changed) {
			suppressClick = true;
			const next = events.map((ev) =>
				ev.id === draft.id
					? { ...ev, startTime: draft.startTime, endTime: draft.endTime, allDay: false }
					: ev
			);
			events = next;
			const updated = next.find((ev) => ev.id === draft.id);
			if (updated) {
				onresize?.(updated, { startTime: draft.startTime, endTime: draft.endTime });
			}
		}
		liveDraft = null;
	}

	function cancelResize() {
		resizeSession = null;
		if (!dragSession) liveDraft = null;
	}

	function beginDrag(e: PointerEvent, ev: CalendarAppEvent) {
		if (!draggableEvents || resizeSession || ev.allDay || !ev.startTime) return;
		if ((e.target as HTMLElement | null)?.closest?.('[data-resize-handle]')) return;
		e.preventDefault();
		const el = e.currentTarget as HTMLElement;
		const column = el.closest('[data-cal-day]') as HTMLElement | null;
		const grid = el.closest('[data-cal-grid]') as HTMLElement | null;
		if (!column || !grid) return;
		const start = parseMinutes(ev.startTime);
		const end = parseMinutes(ev.endTime ?? formatMinutes(start + 60));
		const at = yToMinutes(e.clientY, column);
		detachDragListeners();
		dragSession = {
			id: ev.id,
			pointerId: e.pointerId,
			origDate: ev.date,
			origStart: start,
			origEnd: end,
			duration: Math.max(resizeMinMinutes, end - start),
			grabOffset: at - start,
			grid,
			startX: e.clientX,
			startY: e.clientY,
			active: false
		};
		// Document listeners: the event node remounts when crossing days,
		// which drops element pointer capture mid-drag.
		attachDragListeners();
	}

	function onDocDragMove(e: PointerEvent) {
		moveDrag(e);
	}

	function onDocDragUp(e: PointerEvent) {
		endDrag(e);
		detachDragListeners();
	}

	function onDocDragCancel() {
		cancelDrag();
		detachDragListeners();
	}

	function attachDragListeners() {
		if (typeof document === 'undefined') return;
		document.addEventListener('pointermove', onDocDragMove, true);
		document.addEventListener('pointerup', onDocDragUp, true);
		document.addEventListener('pointercancel', onDocDragCancel, true);
	}

	function detachDragListeners() {
		if (typeof document === 'undefined') return;
		document.removeEventListener('pointermove', onDocDragMove, true);
		document.removeEventListener('pointerup', onDocDragUp, true);
		document.removeEventListener('pointercancel', onDocDragCancel, true);
	}

	function moveDrag(e: PointerEvent) {
		const session = dragSession;
		if (!session || e.pointerId !== session.pointerId) return;

		if (!session.active) {
			const dist = Math.hypot(e.clientX - session.startX, e.clientY - session.startY);
			if (dist < DRAG_THRESHOLD) return;
			dragSession = { ...session, active: true };
			liveDraft = {
				id: session.id,
				date: session.origDate,
				startTime: formatMinutes(session.origStart),
				endTime: formatMinutes(session.origEnd)
			};
		}

		const current = dragSession;
		if (!current?.active) return;

		const dateKey = columnKeyAt(e.clientX, current.grid) ?? current.origDate;
		const col = columnEl(current.grid, dateKey) ?? columnEl(current.grid, current.origDate);
		if (!col) return;

		let start = yToMinutes(e.clientY, col) - current.grabOffset;
		start = snapMinutes(start);
		start = Math.max(HOUR_START * 60, Math.min(start, HOUR_END * 60 - current.duration));
		const end = start + current.duration;

		liveDraft = {
			id: current.id,
			date: dateKey,
			startTime: formatMinutes(start),
			endTime: formatMinutes(end)
		};
	}

	function endDrag(e: PointerEvent) {
		const session = dragSession;
		if (!session || e.pointerId !== session.pointerId) return;
		const draft = liveDraft;
		const wasActive = session.active;
		dragSession = null;

		if (!wasActive || !draft) {
			liveDraft = null;
			return;
		}

		const changed =
			draft.date !== session.origDate ||
			draft.startTime !== formatMinutes(session.origStart) ||
			draft.endTime !== formatMinutes(session.origEnd);

		if (changed) {
			suppressClick = true;
			const next = events.map((ev) => {
				if (ev.id !== draft.id) return ev;
				const updated: CalendarAppEvent = {
					...ev,
					date: draft.date,
					startTime: draft.startTime,
					endTime: draft.endTime,
					allDay: false
				};
				if (ev.endDate && ev.endDate === ev.date) updated.endDate = draft.date;
				else if (ev.endDate) updated.endDate = undefined;
				return updated;
			});
			events = next;
			const updated = next.find((ev) => ev.id === draft.id);
			if (updated) {
				onmove?.(updated, {
					date: draft.date,
					startTime: draft.startTime,
					endTime: draft.endTime
				});
			}
		}
		liveDraft = null;
	}

	function cancelDrag() {
		dragSession = null;
		if (!resizeSession) liveDraft = null;
	}

	onDestroy(() => {
		detachDragListeners();
	});
</script>

<div
	class={[
		'flex h-full min-h-0 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm',
		className
	]}
>
	{#if showSidebar}
		<aside
			class="hidden w-56 shrink-0 flex-col overflow-hidden border-r border-border bg-surface-elevated md:flex"
		>
			<div class="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3">
				{#if showCreate}
					<Button
						size="sm"
						class="mb-4 w-full"
						onclick={() => oncreate?.(focusKey)}
					>
						<Plus class="h-4 w-4" strokeWidth={2} />
						{ui.create}
					</Button>
				{/if}

				<Text
					as="p"
					size="xs"
					tone="muted"
					class="mb-2 px-1 font-semibold tracking-wider uppercase"
				>
					{ui.myCalendars}
				</Text>
				<ul class="space-y-0.5">
					{#each calendars as cal (cal.id)}
						<li>
							<div
								class="flex cursor-pointer items-center gap-2.5 rounded-lg px-1.5 py-1.5 hover:bg-surface-overlay"
								role="button"
								tabindex="0"
								onclick={() => toggleCal(cal.id, cal.visible === false)}
								onkeydown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										toggleCal(cal.id, cal.visible === false);
									}
								}}
							>
								<Checkbox
									size="md"
									checked={cal.visible !== false}
									aria-label={cal.label}
									onchange={(v) => toggleCal(cal.id, v)}
									onclick={(e) => e.stopPropagation()}
								/>
								<span
									class={['h-2.5 w-2.5 shrink-0 rounded-full', toneClass[cal.color ?? 'brand']]}
									aria-hidden="true"
								></span>
								<Text as="span" size="sm" tone="primary" class="min-w-0 flex-1 truncate font-medium">
									{cal.label}
								</Text>
							</div>
						</li>
					{/each}
				</ul>
			</div>

			<div class="shrink-0 border-t border-border px-3 py-3">
				<Text size="sm" tone="muted">{eventsVisibleLabel}</Text>
			</div>
		</aside>
	{/if}

	<div class="flex min-h-0 min-w-0 flex-1 flex-col">
		<!-- Header -->
		<header
			class="flex shrink-0 flex-wrap items-center gap-2 border-b border-border bg-surface-elevated px-3 py-2.5 sm:gap-3 sm:px-4"
		>
			<div class="flex items-center gap-1">
				<Button size="xs" variant="secondary" onclick={goToday}>{ui.today}</Button>
				<IconButton label={ui.previous} size="sm" variant="ghost" onclick={() => shift(-1)}>
					<ChevronLeft class="h-4 w-4" />
				</IconButton>
				<IconButton label={ui.next} size="sm" variant="ghost" onclick={() => shift(1)}>
					<ChevronRight class="h-4 w-4" />
				</IconButton>
			</div>

			<h2 class="min-w-0 flex-1 truncate text-sm font-semibold text-primary sm:text-base">
				{headerTitle}
			</h2>

			{#if showSearch}
				<div class="order-last w-full sm:order-none sm:w-44 lg:w-56">
					<SearchInput bind:value={query} size="sm" placeholder={ui.search} />
				</div>
			{/if}

			<SegmentedControl
				size="sm"
				bind:value={view}
				items={[
					{ id: 'month', label: ui.month },
					{ id: 'week', label: ui.week },
					{ id: 'day', label: ui.day },
					{ id: 'agenda', label: ui.agenda }
				]}
				onchange={(v) => onviewchange?.(v as CalendarView)}
			/>
		</header>

		<div class="flex min-h-0 flex-1">
			<!-- Main views -->
			<div
				class={[
					'min-h-0 min-w-0 flex-1 p-2 sm:p-3',
					view === 'month' ? 'overflow-hidden' : 'overflow-auto'
				]}
			>
				{#if view === 'month'}
					<div
						class="grid h-full min-h-0 grid-cols-7 gap-px overflow-hidden rounded-xl border border-border bg-border"
						style={`grid-template-rows: auto repeat(${Math.ceil(monthCells.length / 7)}, minmax(0, 1fr));`}
					>
						{#each weekdayLabels as wd}
							<div
								class="bg-surface-overlay/80 px-1 py-1.5 text-center text-xs font-semibold tracking-wide text-muted uppercase"
							>
								{wd}
							</div>
						{/each}
						{#each monthCells as cell}
							{@const dayEvents = eventsOn(cell.key)}
							<div
								class={[
									'flex min-h-0 flex-col gap-0.5 overflow-hidden bg-surface p-1',
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
										clearSelectedEvent();
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
										{(col.date ?? parseIso(col.key)).toLocaleDateString(locale, { weekday: 'short' })}
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
							data-cal-grid
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
								<div class="relative border-l border-border" data-cal-day={col.key}>
									{#each hours as _}
										<div class="h-14 border-b border-border/60"></div>
									{/each}
									{#each timedEventsOn(col.key) as raw (raw.id)}
										{@const ev = displayEvent(raw)}
										{@const tone = eventTone(ev)}
										{@const resizing = resizeSession?.id === ev.id}
										{@const dragging = dragSession?.id === ev.id && dragSession.active}
										<!-- svelte-ignore a11y_no_static_element_interactions -->
										<div
											role="button"
											tabindex="0"
											class={[
												'group/cal-event absolute right-1 left-1 z-[1] overflow-hidden rounded-md border px-1.5 py-1 text-left text-[10px] font-medium shadow-sm',
												'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
												toneSoft[tone],
												(resizing || dragging) && 'z-[3] ring-2 ring-brand-500/35',
												dragging && 'cursor-grabbing opacity-90 shadow-md',
												draggableEvents && !resizing && 'cursor-grab',
												(resizable || draggableEvents) && 'touch-none'
											]}
											style:top={`${hourTop(ev.startTime) * 3.5}rem`}
											style:height={`${hourSpan(ev) * 3.5}rem`}
											onpointerdown={(e) => beginDrag(e, raw)}
											onpointermove={(e) => {
												moveDrag(e);
												moveResize(e);
											}}
											onpointerup={(e) => {
												endDrag(e);
												endResize(e);
											}}
											onpointercancel={() => {
												cancelDrag();
												cancelResize();
											}}
											onclick={() => {
												if (suppressClick) {
													suppressClick = false;
													return;
												}
												selectEvent(ev);
											}}
											onkeydown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													selectEvent(ev);
												}
											}}
										>
											{#if resizable}
												<!-- Top resize handle -->
												<div
													data-resize-handle
													role="separator"
													aria-orientation="horizontal"
													aria-label="Resize start time"
													class="group/resize absolute inset-x-0 top-0 z-10 flex h-2.5 cursor-ns-resize items-start justify-center"
													onpointerdown={(e) => beginResize(e, raw, 'start')}
													onpointermove={moveResize}
													onpointerup={endResize}
													onpointercancel={cancelResize}
												>
													<span
														class={[
															'mt-0.5 h-0.5 w-8 rounded-full transition-[background-color,width,opacity,box-shadow] duration-150',
															'bg-brand-500/0 group-hover/cal-event:bg-brand-500/45',
															'group-hover/resize:w-10 group-hover/resize:bg-brand-500 group-hover/resize:shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-brand-500)_25%,transparent)]',
															resizing &&
																resizeSession?.edge === 'start' &&
																'w-10 bg-brand-500 shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-brand-500)_25%,transparent)]'
														]}
													></span>
												</div>
											{/if}

											<p class="truncate pr-0.5 font-semibold">{ev.title}</p>
											<p class="truncate opacity-80">{timeLabel(ev)}</p>

											{#if resizable}
												<!-- Bottom resize handle -->
												<div
													data-resize-handle
													role="separator"
													aria-orientation="horizontal"
													aria-label="Resize end time"
													class="group/resize absolute inset-x-0 bottom-0 z-10 flex h-2.5 cursor-ns-resize items-end justify-center"
													onpointerdown={(e) => beginResize(e, raw, 'end')}
													onpointermove={moveResize}
													onpointerup={endResize}
													onpointercancel={cancelResize}
												>
													<span
														class={[
															'mb-0.5 h-0.5 w-8 rounded-full transition-[background-color,width,opacity,box-shadow] duration-150',
															'bg-brand-500/0 group-hover/cal-event:bg-brand-500/45',
															'group-hover/resize:w-10 group-hover/resize:bg-brand-500 group-hover/resize:shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-brand-500)_25%,transparent)]',
															resizing &&
																resizeSession?.edge === 'end' &&
																'w-10 bg-brand-500 shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-brand-500)_25%,transparent)]'
														]}
													></span>
												</div>
											{/if}
										</div>
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
							<Text size="sm" tone="muted">{ui.noEvents}</Text>
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
											<Badge size="sm" variant="primary" class="ml-1">{ui.today}</Badge>
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

			<!-- Detail panel: day agenda (default) or selected event -->
			{#if showDetailPanel}
				<aside
					class="hidden min-h-0 w-80 shrink-0 flex-col overflow-hidden border-l border-border bg-surface-elevated lg:flex"
				>
					{#if selectedEvent}
						{@const tone = eventTone(selectedEvent)}
						{@const cal = selectedEvent.calendarId
							? calendars.find((c) => c.id === selectedEvent.calendarId)
							: undefined}
						<div class="flex min-h-0 flex-1 flex-col">
							<div class="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
								<div class="mb-3 flex items-center gap-1">
									<IconButton
										label={ui.back}
										size="sm"
										variant="ghost"
										onclick={clearSelectedEvent}
									>
										<ChevronLeft class="h-4 w-4" />
									</IconButton>
									<Text as="span" size="xs" tone="muted" class="font-medium">
										{ui.back}
									</Text>
									<div class="flex-1"></div>
									<IconButton
										label={ui.close}
										size="sm"
										variant="ghost"
										onclick={clearSelectedEvent}
									>
										<X class="h-4 w-4" />
									</IconButton>
								</div>

								<div class={['mb-4 rounded-xl px-3.5 py-3', toneSoft[tone]]}>
									<h3 class="text-base font-semibold text-primary">{selectedEvent.title}</h3>
									<p class="mt-1 text-xs opacity-80">
										{parseIso(selectedEvent.date).toLocaleDateString(locale, {
											weekday: 'short',
											month: 'short',
											day: 'numeric'
										})}
										{#if selectedEvent.endDate && selectedEvent.endDate !== selectedEvent.date}
											– {parseIso(selectedEvent.endDate).toLocaleDateString(locale, {
												month: 'short',
												day: 'numeric'
											})}
										{/if}
									</p>
								</div>

								<Stack gap="sm">
									<div class="flex items-center gap-2 text-sm text-secondary">
										<Clock class="h-4 w-4 shrink-0 text-muted" />
										<span>{timeLabel(selectedEvent)}</span>
									</div>
									{#if selectedEvent.location}
										<div class="flex items-center gap-2 text-sm text-secondary">
											<MapPin class="h-4 w-4 shrink-0 text-muted" />
											<span class="min-w-0 truncate">{selectedEvent.location}</span>
										</div>
									{/if}
									{#if cal}
										<div class="flex items-center gap-2">
											<span
												class={['h-2.5 w-2.5 shrink-0 rounded-full', toneClass[cal.color ?? 'brand']]}
												aria-hidden="true"
											></span>
											<Badge size="sm" variant="secondary">{cal.label}</Badge>
										</div>
									{/if}
									{#if selectedEvent.description}
										<Text as="p" size="sm" tone="secondary" class="leading-relaxed">
											{selectedEvent.description}
										</Text>
									{/if}
								</Stack>
							</div>

							{#if eventActions}
								<div class="shrink-0 border-t border-border bg-surface-elevated p-4">
									{@render eventActions(selectedEvent)}
								</div>
							{/if}
						</div>
					{:else}
						<div class="flex min-h-0 flex-1 flex-col p-4">
							<div class="mb-3 flex shrink-0 items-start justify-between gap-2">
								<div class="min-w-0 flex-1">
									<p class="text-xs font-semibold tracking-wider text-muted uppercase">
										{ui.dayEvents}
									</p>
									<h3 class="mt-0.5 text-sm font-semibold text-primary">{focusDayHeading}</h3>
								</div>
								{#if showCreate}
									<Button size="xs" variant="secondary" onclick={() => oncreate?.(focusKey)}>
										<Plus class="h-3.5 w-3.5" strokeWidth={2} />
										{ui.create}
									</Button>
								{/if}
							</div>

							{#if focusDayEvents.length === 0}
								<div class="flex min-h-0 flex-1 items-center justify-center px-3 py-8">
									<Text size="sm" tone="muted">{ui.noEvents}</Text>
								</div>
							{:else}
								<ul class="min-h-0 flex-1 space-y-1.5 overflow-auto overscroll-contain">
									{#each focusDayEvents as ev (ev.id)}
										<li>
											<button
												type="button"
												class={[
													'flex w-full flex-col gap-0.5 rounded-lg px-2.5 py-2 text-left transition hover:opacity-90',
													toneSoft[eventTone(ev)]
												]}
												onclick={() => selectEvent(ev)}
											>
												<span class="text-xs tabular-nums opacity-80">{timeLabel(ev)}</span>
												<span class="text-sm font-semibold">{ev.title}</span>
												{#if ev.location}
													<span class="truncate text-xs opacity-70">{ev.location}</span>
												{/if}
											</button>
										</li>
									{/each}
								</ul>
							{/if}
						</div>
					{/if}
				</aside>
			{/if}
		</div>
	</div>
</div>
