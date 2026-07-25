<script lang="ts">
	import EventCalendar from './EventCalendar.svelte';
	import type { CalendarEvent } from './EventCalendar.svelte';

	const now = new Date();
	const y = now.getFullYear();
	const m = String(now.getMonth() + 1).padStart(2, '0');

	const events: CalendarEvent[] = [
		{ id: '1', title: 'Design sync', date: `${y}-${m}-03`, time: '10:00', color: 'brand' },
		{ id: '2', title: 'Release', date: `${y}-${m}-03`, time: '16:00', color: 'success' },
		{ id: '3', title: 'Billing review', date: `${y}-${m}-12`, color: 'warning' },
		{ id: '4', title: 'Offsite', date: `${y}-${m}-18`, color: 'info' }
	];

	let month = $state(new Date(y, now.getMonth(), 1));
	let last = $state('');
</script>

<div class="max-w-3xl space-y-2">
	<EventCalendar
		bind:month
		{events}
		ondayclick={(d) => (last = `day ${d}`)}
		oneventclick={(e) => (last = e.title)}
	/>
	{#if last}
		<p class="text-xs text-muted">Last interaction: {last}</p>
	{/if}
</div>
