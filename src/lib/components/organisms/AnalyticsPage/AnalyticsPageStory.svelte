<script lang="ts">
	import AnalyticsPage from './AnalyticsPage.svelte';
</script>

<div class="mx-auto max-w-5xl p-4">
	<AnalyticsPage
		logs={[
			{ id: '1', level: 'info', message: 'ETL job completed', time: Date.now() - 120000, source: 'jobs' },
			{ id: '2', level: 'warn', message: 'Sampling rate raised to 5%', time: Date.now() - 60000, source: 'ingest' }
		]}
	/>
</div>
