<script lang="ts">
	import FilterSummary from './FilterSummary.svelte';
	import type { FilterSummaryItem } from './FilterSummary.svelte';

	let items = $state<FilterSummaryItem[]>([
		{ id: 'status', label: 'Status: Open' },
		{ id: 'assignee', label: 'Assignee: Maya' },
		{ id: 'tag', label: 'Tag: design' }
	]);

	function clear(id: string) {
		items = items.filter((i) => i.id !== id);
	}
</script>

<div class="max-w-lg space-y-3">
	<p class="text-sm font-semibold text-primary">Filter summary</p>
	<FilterSummary
		{items}
		onclear={clear}
		onclearAll={() => (items = [])}
	/>
</div>
