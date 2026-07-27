<script lang="ts">
	import NotificationPreferencesPage from './NotificationPreferencesPage.svelte';
	import type { NotificationPreferenceGroup } from './NotificationPreferencesPage.svelte';

	let groups = $state<NotificationPreferenceGroup[]>([
		{
			id: 'email',
			title: 'Email',
			description: 'Messages delivered to your inbox.',
			items: [
				{
					id: 'mentions',
					title: 'Mentions',
					description: 'When someone @mentions you.',
					checked: true
				},
				{
					id: 'comments',
					title: 'Comments',
					description: 'Replies on threads you follow.',
					checked: true
				},
				{
					id: 'digest',
					title: 'Weekly digest',
					description: 'Summary every Monday morning.',
					checked: false
				}
			]
		},
		{
			id: 'push',
			title: 'Push',
			description: 'Alerts on your devices.',
			items: [
				{
					id: 'assignments',
					title: 'Task assignments',
					description: 'When a task is assigned to you.',
					checked: true
				},
				{
					id: 'deadlines',
					title: 'Due date reminders',
					description: 'One day before something is due.',
					checked: false
				}
			]
		},
		{
			id: 'in-app',
			title: 'In-app',
			description: 'Badges and banners in the product.',
			items: [
				{
					id: 'activity',
					title: 'Activity feed',
					description: 'Updates in your notification center.',
					checked: true
				},
				{
					id: 'tips',
					title: 'Product tips',
					description: 'Occasional tips and updates.',
					checked: false
				}
			]
		}
	]);

	let last = $state('');

	function handleChange(groupId: string, itemId: string, checked: boolean) {
		groups = groups.map((group) =>
			group.id === groupId
				? {
						...group,
						items: group.items.map((item) =>
							item.id === itemId ? { ...item, checked } : item
						)
					}
				: group
		);
		last = `${groupId}/${itemId}: ${checked}`;
	}
</script>

<div class="p-4">
	<NotificationPreferencesPage {groups} onchange={handleChange} />
</div>

{#if last}
	<p class="pb-4 text-center text-xs text-muted">Changed: {last}</p>
{/if}
