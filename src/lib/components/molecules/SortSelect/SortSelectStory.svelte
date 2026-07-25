<script lang="ts">
	import SortSelect from './SortSelect.svelte';

	let value = $state('relevance');
</script>

<div class="flex items-end gap-4">
	<SortSelect bind:value />
	<span class="pb-2 text-xs text-muted">Selected: {value}</span>
</div>
