<script lang="ts">
	import Inbox from './Inbox.svelte';
	import type { NotificationRowData } from '$lib/components/molecules/NotificationRow/NotificationRow.svelte';

	let items = $state<NotificationRowData[]>([
		{
			id: '1',
			title: 'PR approved',
			description: 'Jordan approved your changes on design-system.',
			time: Date.now() - 1000 * 60 * 8,
			type: 'success',
			read: false
		},
		{
			id: '2',
			title: 'Mention in #product',
			description: '@you what do you think about the new StatCard?',
			time: Date.now() - 1000 * 60 * 45,
			type: 'info',
			read: false,
			avatar: 'https://i.pravatar.cc/80?img=12'
		},
		{
			id: '3',
			title: 'Invoice paid',
			description: 'Payment for March invoice was received.',
			time: Date.now() - 1000 * 60 * 60 * 26,
			type: 'success',
			read: true
		},
		{
			id: '4',
			title: 'Build failed',
			description: 'CI failed on main — check the pipeline logs.',
			time: Date.now() - 1000 * 60 * 60 * 50,
			type: 'error',
			read: true
		}
	]);
</script>

<div class="mx-auto max-w-md p-4">
	<Inbox bind:items />
</div>
