<script lang="ts">
	import UsageBreakdown from './UsageBreakdown.svelte';

	const items = [
		{ id: 'api', label: 'API calls', value: 42000, max: 100000 },
		{ id: 'storage', label: 'Storage', value: 12, max: 50 },
		{ id: 'bandwidth', label: 'Bandwidth', value: 8, max: 20 },
		{ id: 'seats', label: 'Active seats', value: 7, max: 10 }
	];
</script>

<div class="mx-auto max-w-lg p-4">
	<UsageBreakdown {items} unit=" GB" />
</div>
