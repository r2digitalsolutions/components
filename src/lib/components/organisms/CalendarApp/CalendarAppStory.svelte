<script lang="ts">
	import CalendarApp from './CalendarApp.svelte';
	import type { CalendarAppEvent, CalendarSource } from './CalendarApp.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	const now = new Date();
	const y = now.getFullYear();
	const m = now.getMonth();

	function d(day: number, offsetMonth = 0) {
		const dt = new Date(y, m + offsetMonth, day);
		return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
	}

	let calendars = $state<CalendarSource[]>([
		{ id: 'work', label: 'Work', color: 'brand', visible: true },
		{ id: 'personal', label: 'Personal', color: 'violet', visible: true },
		{ id: 'focus', label: 'Focus time', color: 'success', visible: true }
	]);

	let events = $state<CalendarAppEvent[]>([
		{
			id: '1',
			title: 'Design sync',
			date: d(3),
			startTime: '10:00',
			endTime: '10:45',
			calendarId: 'work',
			location: 'Zoom',
			description: 'Weekly product + design stand-up.'
		},
		{
			id: '2',
			title: 'Ship charts',
			date: d(3),
			startTime: '16:00',
			endTime: '17:30',
			calendarId: 'work',
			color: 'info'
		},
		{
			id: '3',
			title: 'Lunch with Maya',
			date: d(5),
			startTime: '13:00',
			endTime: '14:00',
			calendarId: 'personal',
			location: 'Cafe Norte'
		},
		{
			id: '4',
			title: 'Deep work',
			date: d(5),
			startTime: '09:00',
			endTime: '11:30',
			calendarId: 'focus',
			allDay: false
		},
		{
			id: '5',
			title: 'Offsite',
			date: d(12),
			endDate: d(13),
			allDay: true,
			calendarId: 'work',
			color: 'warning',
			location: 'Valencia'
		},
		{
			id: '6',
			title: 'Dentist',
			date: d(18),
			startTime: '11:15',
			endTime: '11:45',
			calendarId: 'personal',
			color: 'rose'
		},
		{
			id: '7',
			title: 'Sprint planning',
			date: d(20),
			startTime: '09:30',
			endTime: '11:00',
			calendarId: 'work'
		},
		{
			id: '8',
			title: 'Focus block',
			date: d(20),
			startTime: '14:00',
			endTime: '16:00',
			calendarId: 'focus'
		},
		{
			id: '9',
			title: 'Family dinner',
			date: d(22),
			startTime: '20:00',
			endTime: '22:00',
			calendarId: 'personal'
		}
	]);

	let view = $state<'month' | 'week' | 'day' | 'agenda'>('month');
	let date = $state(new Date(y, m, Math.min(now.getDate(), 28)));
	let query = $state('');
	let selectedEventId = $state<string | null>(null);
	let last = $state('');
</script>

<div class="space-y-2">
	<CalendarApp
		bind:calendars
		bind:view
		bind:date
		bind:query
		bind:selectedEventId
		{events}
		oncreate={(day) => (last = `create on ${day}`)}
		ondayclick={(day) => (last = `day ${day}`)}
		oneventclick={(e) => (last = e.title)}
	/>
	{#if last}
		<Text size="xs" tone="muted">Last: {last}</Text>
	{/if}
</div>
