<script lang="ts">
	import VersionHistoryPanel from './VersionHistoryPanel.svelte';

	const revisions = [
		{
			id: 'v3',
			label: '3.0.0',
			author: 'Rafa',
			createdAt: Date.now() - 3600_000,
			summary: 'Tweaked intro copy',
			previousContent: 'Hello world\nLine two',
			content: 'Hello world\nLine two\nLine three'
		},
		{
			id: 'v2',
			label: '2.1.0',
			author: 'Alex',
			createdAt: Date.now() - 86400_000,
			summary: 'Added section',
			previousContent: 'Hello world',
			content: 'Hello world\nLine two'
		},
		{
			id: 'v1',
			label: '1.0.0',
			author: 'Alex',
			createdAt: Date.now() - 7 * 86400_000,
			summary: 'Initial',
			content: 'Hello world'
		}
	];
</script>

<div class="p-4">
	<VersionHistoryPanel {revisions} currentContent="Hello world\nLine two\nLine three\nFinal" />
</div>
