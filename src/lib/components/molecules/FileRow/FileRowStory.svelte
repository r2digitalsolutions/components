<script lang="ts">
	import FileRow from './FileRow.svelte';
	import type { FileRowData } from './FileRow.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';

	let files = $state<FileRowData[]>([
		{ id: '1', name: 'brand-guidelines.pdf', size: '2.4 MB', type: 'PDF', status: 'ready' },
		{ id: '2', name: 'hero.png', size: '840 KB', type: 'PNG', status: 'uploading', progress: 62 },
		{ id: '3', name: 'corrupted.zip', size: '12 MB', type: 'ZIP', status: 'error' }
	]);
</script>

<div class="max-w-md">
	<Stack gap="sm">
		{#each files as file (file.id)}
			<FileRow
				{file}
				ondownload={() => {}}
				onremove={(f) => (files = files.filter((x) => x.id !== f.id))}
			/>
		{/each}
	</Stack>
</div>
