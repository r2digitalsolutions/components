<script lang="ts">
	import DragHandle from './DragHandle.svelte';
</script>

<div class="flex flex-col gap-6">
	<div class="flex items-center gap-3 rounded-lg border border-border bg-surface-elevated p-3">
		<DragHandle />
		<span class="text-sm text-primary">Sortable list item</span>
	</div>

	<div class="flex flex-wrap items-center gap-4">
		<DragHandle size="sm" />
		<DragHandle size="md" />
		<DragHandle size="lg" />
		<DragHandle orientation="horizontal" />
		<DragHandle disabled />
	</div>
</div>
