<script lang="ts">
	import TaskSummaryCard from './TaskSummaryCard.svelte';
</script>

<div class="max-w-sm space-y-3">
	<p class="text-sm font-semibold text-primary">Task summary</p>
	<TaskSummaryCard title="Sprint 24" total={18} done={11} overdue={2} onclick={() => {}} />
</div>
