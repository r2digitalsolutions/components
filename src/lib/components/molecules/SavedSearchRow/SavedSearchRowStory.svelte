<script lang="ts">
	import SavedSearchRow from './SavedSearchRow.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';

	let pinned1 = $state(true);
	let pinned2 = $state(false);
	let last = $state('');
</script>

<div class="max-w-md space-y-3">
	<p class="text-sm font-semibold text-primary">Saved searches</p>
	<Stack gap="sm">
		<SavedSearchRow
			name="Open bugs in prod"
			query="status:open env:production"
			count={12}
			bind:pinned={pinned1}
			onselect={() => (last = 'Open bugs in prod')}
			onpin={() => {}}
			ondelete={() => (last = 'deleted: Open bugs')}
		/>
		<SavedSearchRow
			name="My reviews"
			query="reviewer:@me is:pending"
			count={3}
			bind:pinned={pinned2}
			onselect={() => (last = 'My reviews')}
			onpin={() => {}}
			ondelete={() => (last = 'deleted: My reviews')}
		/>
	</Stack>
	{#if last}
		<p class="text-[11px] text-muted">Last action: {last}</p>
	{/if}
</div>
