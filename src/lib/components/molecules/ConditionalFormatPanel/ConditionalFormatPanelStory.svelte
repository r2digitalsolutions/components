<script lang="ts">
	import ConditionalFormatPanel from './ConditionalFormatPanel.svelte';
	import type { ConditionalFormatRule } from '$lib/components/organisms/DataGrid/types.js';

	let rules = $state<ConditionalFormatRule[]>([
		{
			id: 'r1',
			name: 'Overdue',
			enabled: true,
			target: 'row',
			when: { op: 'eq', columnId: 'status', value: 'overdue' },
			style: { background: '#fee2e2', color: '#991b1b' },
			priority: 1
		}
	]);
</script>

<div class="max-w-lg">
	<ConditionalFormatPanel
		bind:rules
		columns={[
			{ id: 'status', label: 'Status' },
			{ id: 'amount', label: 'Amount' },
			{ id: 'name', label: 'Name' }
		]}
	/>
</div>
