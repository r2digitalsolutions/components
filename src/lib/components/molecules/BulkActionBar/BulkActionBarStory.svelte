<script lang="ts">
	import BulkActionBar from './BulkActionBar.svelte';
	import Checkbox from '$lib/components/atoms/Checkbox/Checkbox.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';

	let selected = $state(['1', '3']);
	const items = [
		{ id: '1', label: 'Design review.pdf' },
		{ id: '2', label: 'Q3 forecast.xlsx' },
		{ id: '3', label: 'Brand kit.zip' }
	];

	function toggle(id: string, checked: boolean) {
		selected = checked ? [...selected, id] : selected.filter((x) => x !== id);
	}
</script>

<div class="relative max-w-md space-y-3 rounded-2xl border border-border bg-surface p-4 pb-16">
	<Stack gap="sm">
		{#each items as item (item.id)}
			<Checkbox
				label={item.label}
				checked={selected.includes(item.id)}
				onchange={(c) => toggle(item.id, c)}
			/>
		{/each}
	</Stack>
	<BulkActionBar
		count={selected.length}
		onaction={() => {}}
		onclear={() => (selected = [])}
	/>
</div>
