<script lang="ts">
	import QuietHoursRow from './QuietHoursRow.svelte';

	let enabled = $state(true);
	let start = $state('22:00');
	let end = $state('07:00');
	let last = $state('');
</script>

<div class="mx-auto max-w-lg space-y-6 p-4">
	<QuietHoursRow
		bind:enabled
		bind:start
		bind:end
		minuteStep={15}
		onchange={(v) => (last = JSON.stringify(v))}
	/>

	<QuietHoursRow
		enabled={true}
		start="21:30"
		end="06:00"
		format="12h"
		minuteStep={30}
		title="Do not disturb"
		description="Silence push alerts overnight (12-hour clock)."
	/>

	{#if last}
		<p class="text-center text-xs text-muted">{last}</p>
	{/if}
</div>
