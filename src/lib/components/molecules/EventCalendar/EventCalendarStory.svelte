<script lang="ts">
	import EventCalendar from './EventCalendar.svelte';
	import type { CalendarEvent } from './EventCalendar.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	/** Build a dense set of events for whatever month is on screen */
	function eventsForMonth(anchor: Date): CalendarEvent[] {
		const y = anchor.getFullYear();
		const m = anchor.getMonth();
		const key = (day: number) =>
			`${y}-${String(m + 1).padStart(2, '0')}-${String(Math.min(day, new Date(y, m + 1, 0).getDate())).padStart(2, '0')}`;

		return [
			{ id: `${y}-${m}-1`, title: 'Design sync', date: key(3), time: '10:00', endTime: '10:45', color: 'brand', calendar: 'Work', location: 'Zoom' },
			{ id: `${y}-${m}-2`, title: 'Ship charts', date: key(3), time: '16:00', endTime: '17:00', color: 'success', calendar: 'Work' },
			{ id: `${y}-${m}-3`, title: '1:1 with Alex', date: key(5), time: '11:30', endTime: '12:00', color: 'violet', calendar: 'Work' },
			{ id: `${y}-${m}-4`, title: 'Lunch — Maya', date: key(5), time: '13:15', endTime: '14:00', color: 'rose', calendar: 'Personal', location: 'Cafe Norte' },
			{ id: `${y}-${m}-5`, title: 'Deep work', date: key(7), time: '09:00', endTime: '12:00', color: 'info', calendar: 'Focus' },
			{ id: `${y}-${m}-6`, title: 'Billing review', date: key(12), time: '15:00', color: 'warning', calendar: 'Work' },
			{ id: `${y}-${m}-7`, title: 'Offsite', date: key(18), endDate: key(19), allDay: true, color: 'info', calendar: 'Team', location: 'Valencia' },
			{ id: `${y}-${m}-8`, title: 'Dentist', date: key(18), time: '11:00', endTime: '11:30', color: 'rose', calendar: 'Personal' },
			{ id: `${y}-${m}-9`, title: 'Sprint planning', date: key(20), time: '09:30', endTime: '11:00', color: 'brand', calendar: 'Work' },
			{ id: `${y}-${m}-10`, title: 'Focus block', date: key(20), time: '14:00', endTime: '16:00', color: 'violet', calendar: 'Focus' },
			{ id: `${y}-${m}-11`, title: 'Family dinner', date: key(22), time: '20:00', endTime: '22:00', color: 'rose', calendar: 'Personal' },
			{ id: `${y}-${m}-12`, title: 'Retro', date: key(25), time: '16:30', endTime: '17:15', color: 'success', calendar: 'Work' },
			{ id: `${y}-${m}-13`, title: 'Yoga', date: key(27), time: '08:00', endTime: '08:45', color: 'violet', calendar: 'Personal' },
			{ id: `${y}-${m}-14`, title: 'Demo day', date: key(28), time: '15:00', endTime: '16:30', color: 'brand', calendar: 'Work', location: 'HQ' }
		];
	}

	const now = new Date();
	let month = $state(new Date(now.getFullYear(), now.getMonth(), 1));
	let selectedDate = $state('');
	let last = $state('');

	const events = $derived(eventsForMonth(month));
</script>

<div class="w-full max-w-5xl space-y-3 px-2 sm:px-4">
	<EventCalendar
		class="w-full"
		bind:month
		bind:selectedDate
		{events}
		maxPerDay={3}
		ondayclick={(d) => (last = `Selected ${d}`)}
		oneventclick={(e) => (last = e.title)}
	/>
	{#if last}
		<Text size="xs" tone="muted">{last}</Text>
	{/if}
	<Text size="xs" tone="muted">
		Week / day / agenda + filters →
		<span class="font-medium text-secondary">Organisms / CalendarApp</span>
	</Text>
</div>
