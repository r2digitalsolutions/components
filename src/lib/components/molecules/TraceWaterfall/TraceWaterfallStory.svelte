<script lang="ts">
	import TraceWaterfall from './TraceWaterfall.svelte';
	import type { TraceSpan } from './TraceWaterfall.svelte';

	const spans: TraceSpan[] = [
		{
			id: '1',
			name: 'HTTP GET /api/orders',
			service: 'api-gateway',
			startMs: 0,
			durationMs: 240,
			status: 'ok',
			children: [
				{
					id: '2',
					name: 'auth.verify',
					service: 'auth',
					startMs: 8,
					durationMs: 32,
					status: 'ok'
				},
				{
					id: '3',
					name: 'db.query orders',
					service: 'postgres',
					startMs: 48,
					durationMs: 120,
					status: 'ok',
					children: [
						{
							id: '4',
							name: 'cache.lookup',
							service: 'redis',
							startMs: 52,
							durationMs: 12,
							status: 'ok'
						}
					]
				},
				{
					id: '5',
					name: 'billing.enrich',
					service: 'billing',
					startMs: 180,
					durationMs: 45,
					status: 'error'
				}
			]
		}
	];
</script>

<div class="p-4">
	<TraceWaterfall {spans} />
</div>
