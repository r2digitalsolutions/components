<script lang="ts">
	import UploadQueue from './UploadQueue.svelte';
	import type { UploadQueueFile } from './UploadQueue.svelte';

	let files = $state<UploadQueueFile[]>([
		{ id: '1', name: 'screenshot.png', progress: 78, status: 'uploading' },
		{ id: '2', name: 'report.pdf', progress: 100, status: 'done' },
		{
			id: '3',
			name: 'archive.zip',
			progress: 34,
			status: 'error',
			error: 'Network timeout — try again'
		}
	]);
</script>

<div class="max-w-md space-y-3">
	<p class="text-sm font-semibold text-primary">Upload queue</p>
	<UploadQueue
		{files}
		onretry={(id) => {
			files = files.map((f) =>
				f.id === id ? { ...f, status: 'uploading' as const, progress: 0, error: undefined } : f
			);
		}}
		onremove={(id) => (files = files.filter((f) => f.id !== id))}
	/>
</div>
