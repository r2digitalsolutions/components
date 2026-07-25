<script lang="ts">
	import InlineEdit from './InlineEdit.svelte';

	let value = $state('Product launch notes');
</script>

<div class="space-y-3">
	<p class="text-xs text-muted">Click the text to edit · Enter to save · Esc to cancel</p>
	<InlineEdit bind:value />
	<p class="text-sm text-secondary">Current value: <strong class="text-primary">{value}</strong></p>
</div>
