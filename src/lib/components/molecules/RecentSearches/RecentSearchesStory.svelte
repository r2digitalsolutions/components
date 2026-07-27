<script lang="ts">
	import RecentSearches from './RecentSearches.svelte';

	let items = $state(['design tokens', 'is:open assignee:maya', 'upload queue']);
	let last = $state('');
</script>

<div class="max-w-sm space-y-3">
	<p class="text-sm font-semibold text-primary">Recent searches</p>
	<div class="rounded-xl border border-border bg-surface-elevated p-3">
		<RecentSearches
			{items}
			onselect={(q) => (last = `select: ${q}`)}
			onremove={(q) => (items = items.filter((i) => i !== q))}
			onclear={() => (items = [])}
		/>
	</div>
	{#if last}
		<p class="text-[11px] text-muted">{last}</p>
	{/if}
</div>
