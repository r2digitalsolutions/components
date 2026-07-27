<script lang="ts">
	import TaskRow from './TaskRow.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';

	let done1 = $state(false);
	let done2 = $state(true);
	let last = $state('');
</script>

<div class="max-w-md space-y-3">
	<p class="text-sm font-semibold text-primary">Tasks</p>
	<Stack gap="sm">
		<TaskRow
			title="Review PR #482"
			bind:completed={done1}
			priority="high"
			due="Today"
			assignee="Maya Chen"
			ontoggle={() => {}}
			onclick={() => (last = 'Review PR #482')}
		/>
		<TaskRow
			title="Update changelog"
			bind:completed={done2}
			priority="low"
			due="Fri"
			assignee="Alex Rivera"
			ontoggle={() => {}}
			onclick={() => (last = 'Update changelog')}
		/>
	</Stack>
	{#if last}
		<p class="text-[11px] text-muted">Opened: {last}</p>
	{/if}
</div>
