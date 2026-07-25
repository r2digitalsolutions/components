<script lang="ts">
	import ActivityFeed, { type ActivityItem } from './ActivityFeed.svelte';

	const items: ActivityItem[] = [
		{
			id: '1',
			actor: 'Alex',
			action: 'published',
			target: 'Footer',
			date: Date.now() - 1000 * 60 * 5,
			meta: 'organisms'
		},
		{
			id: '2',
			actor: 'Sam',
			action: 'commented on',
			target: 'Wizard',
			date: Date.now() - 1000 * 60 * 40
		},
		{
			id: '3',
			actor: 'Jordan',
			action: 'merged PR',
			target: '#482',
			date: Date.now() - 1000 * 60 * 120,
			meta: 'feature/catalog'
		}
	];
</script>

<ActivityFeed {items} class="w-full max-w-md pl-2" />
