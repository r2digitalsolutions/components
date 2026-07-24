<script lang="ts">
	import NotificationCenter, { type NotificationItem } from './NotificationCenter.svelte';

	let {
		example = 'default'
	}: {
		example?: 'default' | 'empty';
	} = $props();

	const defaultItems: NotificationItem[] = [
		{
			id: '1',
			title: 'Deployment successful',
			description: 'Your app was deployed to production without errors.',
			time: '2 min ago',
			read: false,
			type: 'success'
		},
		{
			id: '2',
			title: 'New team member',
			description: 'Ana García joined your workspace as an editor.',
			time: '15 min ago',
			read: false,
			type: 'info',
			avatar: 'https://i.pravatar.cc/40?img=47'
		},
		{
			id: '3',
			title: 'Storage warning',
			description: 'You are using 85% of your storage quota.',
			time: '1 hour ago',
			read: false,
			type: 'warning'
		},
		{
			id: '4',
			title: 'Payment failed',
			description: 'Your subscription renewal could not be processed.',
			time: '3 hours ago',
			read: true,
			type: 'error'
		},
		{
			id: '5',
			title: 'Weekly report ready',
			description: 'Your analytics report for last week is available.',
			time: 'Yesterday',
			read: true,
			type: 'info'
		}
	];

	let items = $state<NotificationItem[]>(example === 'empty' ? [] : [...defaultItems]);
	let open = $state(false);
</script>

<div class="flex items-center gap-4 p-4 rounded-xl bg-surface-elevated border border-border">
	<span class="text-sm text-secondary">Click the bell icon:</span>
	<NotificationCenter
		bind:items
		bind:open
	/>
	<span class="text-xs text-muted">
		{items.filter(n => !n.read).length} sin leer / {items.length} total
	</span>
</div>
