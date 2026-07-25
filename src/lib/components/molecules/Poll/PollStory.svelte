<script lang="ts">
	import Poll from './Poll.svelte';

	let options = $state([
		{ id: 'a', label: 'Ship weekly', votes: 12 },
		{ id: 'b', label: 'Ship when ready', votes: 28 },
		{ id: 'c', label: 'Continuous deploy', votes: 19 }
	]);
	let value = $state<string | null>(null);
	let totalVotes = $state(59);
</script>

<div class="max-w-sm">
	<Poll
		question="Preferred release cadence?"
		bind:options
		bind:value
		bind:totalVotes
	/>
</div>
