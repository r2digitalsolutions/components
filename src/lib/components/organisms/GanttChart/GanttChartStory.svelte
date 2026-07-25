<script lang="ts">
	import GanttChart from './GanttChart.svelte';
</script>

<div class="max-w-4xl rounded-2xl border border-border bg-surface p-4">
	<p class="mb-3 text-sm font-semibold text-primary">Sprint roadmap</p>
	<GanttChart
		rangeStart="2026-07-01"
		rangeEnd="2026-09-30"
		tasks={[
			{
				id: '1',
				label: 'Discovery',
				start: '2026-07-01',
				end: '2026-07-18',
				progress: 100
			},
			{
				id: '2',
				label: 'Design system',
				start: '2026-07-10',
				end: '2026-08-05',
				progress: 70
			},
			{
				id: '3',
				label: 'API v2',
				start: '2026-07-20',
				end: '2026-08-25',
				progress: 45
			},
			{
				id: '4',
				label: 'Beta launch',
				start: '2026-08-15',
				end: '2026-09-10',
				progress: 15
			},
			{
				id: '5',
				label: 'Marketing site',
				start: '2026-08-01',
				end: '2026-09-20',
				progress: 30
			}
		]}
	/>
</div>
