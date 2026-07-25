<script lang="ts">
	import OrgChart from './OrgChart.svelte';
	import type { OrgNode } from './OrgChart.svelte';

	const root: OrgNode = {
		id: '1',
		name: 'Maya Chen',
		role: 'CEO',
		children: [
			{
				id: '2',
				name: 'Luis Ortega',
				role: 'CTO',
				children: [
					{ id: '4', name: 'Priya Nair', role: 'Engineering' },
					{ id: '5', name: 'Sam Wright', role: 'Platform' }
				]
			},
			{
				id: '3',
				name: 'Elena Rossi',
				role: 'CPO',
				children: [
					{ id: '6', name: 'Jordan Lee', role: 'Design' },
					{ id: '7', name: 'Ava Kim', role: 'Research' }
				]
			}
		]
	};
</script>

<div class="rounded-2xl border border-border bg-surface-elevated p-4">
	<p class="mb-4 text-sm font-semibold text-primary">Organization</p>
	<OrgChart {root} />
</div>
