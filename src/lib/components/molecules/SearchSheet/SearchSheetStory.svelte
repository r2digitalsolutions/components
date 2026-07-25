<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import SearchSheet from './SearchSheet.svelte';
	import type { SearchSheetItem } from './SearchSheet.svelte';

	let open = $state(false);
	let query = $state('');
	let loading = $state(false);

	let recent = $state<SearchSheetItem[]>([
		{ id: 'r1', label: 'Barcelona', description: 'City · Spain' },
		{ id: 'r2', label: 'Berlin Design Week', description: 'Event' },
		{ id: 'r3', label: 'Boston loft', description: 'Stay' }
	]);

	const suggestions: SearchSheetItem[] = [
		{ id: '1', label: 'Barcelona', description: 'Catalonia, Spain', meta: 'City' },
		{ id: '2', label: 'Berlin', description: 'Germany', meta: 'City' },
		{ id: '3', label: 'Boston', description: 'Massachusetts, USA', meta: 'City' },
		{ id: '4', label: 'Buenos Aires', description: 'Argentina', meta: 'City' },
		{ id: '5', label: 'Brussels', description: 'Belgium', meta: 'City' },
		{ id: '6', label: 'Bali retreat', description: 'Travel guide', meta: 'Guide' },
		{ id: '7', label: 'Boutique hotels', description: 'Collection', meta: 'List' }
	];

	function simulateLoading() {
		loading = true;
		open = true;
		query = 'bo';
		setTimeout(() => (loading = false), 900);
	}
</script>

<div class="space-y-2">
	<div class="flex flex-wrap gap-2">
		<Button onclick={() => (open = true)}>Open search</Button>
		<Button variant="secondary" onclick={simulateLoading}>Open with loading</Button>
	</div>
	<p class="text-xs text-muted">
		Wrapped with the shared <code class="text-primary">Sheet</code> — handle, drag snaps, pull to close.
	</p>
</div>

<SearchSheet
	bind:open
	bind:query
	{loading}
	{suggestions}
	{recent}
	trending={['Lisbon', 'Tokyo', 'Cape Town', 'Reykjavík']}
	placeholder="Search destinations…"
	onclearrecent={() => (recent = [])}
	onremoverecent={(id) => (recent = recent.filter((r) => r.id !== id))}
	onselect={(item) => {
		recent = [{ ...item, id: `r-${item.id}` }, ...recent.filter((r) => r.label !== item.label)].slice(
			0,
			5
		);
	}}
/>
