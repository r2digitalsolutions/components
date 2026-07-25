<script lang="ts">
	import Scheduler from './Scheduler.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	let selectedSlotId = $state<string | null>(null);
</script>

<div class="space-y-3">
	<Scheduler
		bind:selectedSlotId
		dateLabel="Fri, Jul 25"
		slots={[
			{ id: '9', time: '09:00' },
			{ id: '10', time: '10:00' },
			{ id: '11', time: '11:00' },
			{ id: '12', time: '12:00', available: false },
			{ id: '14', time: '14:00' },
			{ id: '15', time: '15:00' },
			{ id: '16', time: '16:00' }
		]}
		bookings={[
			{ id: 'b1', slotId: '10', title: 'Design review', with: 'Maya' },
			{ id: 'b2', slotId: '15', title: 'Customer call', with: 'Luis' }
		]}
	/>
	{#if selectedSlotId}
		<Text size="xs" tone="muted">Selected slot: {selectedSlotId}</Text>
	{/if}
</div>
