<script lang="ts">
	import AnalyticsPage from './AnalyticsPage.svelte';

	interface Props {
		variant?: 'default' | 'empty' | 'with-logs';
	}

	let { variant = 'default' }: Props = $props();

	let period = $state('7d');
	let last = $state('');
</script>

<div class="mx-auto max-w-6xl p-4">
	{#if variant === 'empty'}
		<AnalyticsPage empty bind:period />
	{:else}
		<AnalyticsPage
			bind:period
			onperiodchange={(id) => (last = `period:${id}`)}
			onexport={() => (last = 'export')}
			logs={variant === 'with-logs'
				? [
						{
							id: '1',
							level: 'info',
							message: 'ETL job completed',
							time: Date.now() - 120000,
							source: 'jobs'
						},
						{
							id: '2',
							level: 'warn',
							message: 'Sampling rate raised to 5%',
							time: Date.now() - 60000,
							source: 'ingest'
						},
						{
							id: '3',
							level: 'info',
							message: 'Warehouse sync finished (12.4k rows)',
							time: Date.now() - 30000,
							source: 'warehouse'
						}
					]
				: []}
		/>
	{/if}
	{#if last}
		<p class="mt-3 text-center text-xs text-muted">Action: {last}</p>
	{/if}
</div>
