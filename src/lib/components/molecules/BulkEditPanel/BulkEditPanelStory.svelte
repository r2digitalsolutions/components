<script lang="ts">
	import BulkEditPanel from './BulkEditPanel.svelte';
</script>

<div class="mx-auto max-w-lg p-4">
	<BulkEditPanel
		selectedCount={12}
		fields={[
			{ id: 'status', label: 'Status', type: 'select', options: [
				{ value: 'active', label: 'Active' },
				{ value: 'draft', label: 'Draft' }
			]},
			{ id: 'priority', label: 'Priority', type: 'number' },
			{ id: 'featured', label: 'Featured', type: 'boolean' }
		]}
		onapply={(v) => console.log(v)}
	/>
</div>
