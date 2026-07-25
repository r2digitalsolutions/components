<script lang="ts">
	import NotificationRow from './NotificationRow.svelte';
	import type { NotificationRowData } from './NotificationRow.svelte';

	const items: NotificationRowData[] = [
		{
			id: '1',
			title: 'Deploy succeeded',
			description: 'Production release v2.4.1 is live.',
			time: Date.now() - 1000 * 60 * 4,
			type: 'success',
			read: false
		},
		{
			id: '2',
			title: 'New comment',
			description: 'Maya left feedback on your PR.',
			time: Date.now() - 1000 * 60 * 60,
			type: 'info',
			read: true,
			avatar: 'https://i.pravatar.cc/80?img=5'
		},
		{
			id: '3',
			title: 'Quota warning',
			description: 'You have used 90% of your API quota.',
			time: Date.now() - 1000 * 60 * 60 * 5,
			type: 'warning',
			read: false
		}
	];

	let last = $state('');
</script>

<div class="max-w-md divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface-elevated">
	{#each items as item (item.id)}
		<NotificationRow {item} onclick={(n) => (last = n.id)} />
	{/each}
</div>
{#if last}
	<p class="mt-2 text-xs text-muted">Clicked: {last}</p>
{/if}
