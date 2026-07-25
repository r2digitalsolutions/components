<script lang="ts">
	import LogViewer from './LogViewer.svelte';
	import type { LogEntry } from './LogViewer.svelte';

	const now = Date.now();
	const entries: LogEntry[] = [
		{ id: '1', level: 'info', message: 'Server listening on :5173', time: now - 60000, source: 'vite' },
		{ id: '2', level: 'debug', message: 'HMR update /src/lib/index.ts', time: now - 45000, source: 'hmr' },
		{ id: '3', level: 'warn', message: 'Deprecated prop `variant` on Card', time: now - 20000, source: 'svelte' },
		{ id: '4', level: 'error', message: 'Failed to fetch /api/metrics (503)', time: now - 5000, source: 'api' }
	];
</script>

<div class="max-w-xl">
	<LogViewer {entries} />
</div>
