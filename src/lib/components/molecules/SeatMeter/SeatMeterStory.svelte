<script lang="ts">
	import SeatMeter from './SeatMeter.svelte';

	let last = $state('');
</script>

<div class="mx-auto grid max-w-xl gap-4 p-4">
	<SeatMeter used={3} total={10} planName="Starter" onmanage={() => (last = 'manage')} />
	<SeatMeter
		used={9}
		total={10}
		planName="Pro"
		onupgrade={() => (last = 'upgrade')}
		onmanage={() => (last = 'manage')}
	/>
	<SeatMeter used={12} total={12} planName="Team" onupgrade={() => (last = 'upgrade')} />
	{#if last}
		<p class="text-center text-xs text-muted">Action: {last}</p>
	{/if}
</div>
