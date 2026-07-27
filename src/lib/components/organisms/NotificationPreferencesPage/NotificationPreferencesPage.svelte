<script lang="ts">
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import NotificationSettingsGroup from '$lib/components/molecules/NotificationSettingsGroup/NotificationSettingsGroup.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';

	export interface NotificationPreferenceItem {
		id: string;
		title: string;
		description?: string;
		checked: boolean;
	}

	export interface NotificationPreferenceGroup {
		id: string;
		title: string;
		description?: string;
		items: NotificationPreferenceItem[];
	}

	interface NotificationPreferencesPageProps {
		title?: string;
		description?: string;
		groups?: NotificationPreferenceGroup[];
		class?: string;
		onchange?: (groupId: string, itemId: string, checked: boolean) => void;
	}

	const DEFAULT_GROUPS: NotificationPreferenceGroup[] = [
		{
			id: 'email',
			title: 'Email',
			description: 'Messages delivered to your inbox.',
			items: [
				{
					id: 'mentions',
					title: 'Mentions',
					description: 'When someone @mentions you in a comment or doc.',
					checked: true
				},
				{
					id: 'comments',
					title: 'Comments',
					description: 'Replies on threads you follow or participate in.',
					checked: true
				},
				{
					id: 'digest',
					title: 'Weekly digest',
					description: 'A summary of workspace activity every Monday.',
					checked: false
				}
			]
		},
		{
			id: 'push',
			title: 'Push',
			description: 'Alerts on your phone and desktop.',
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
					description: 'Reminders one day before something is due.',
					checked: true
				},
				{
					id: 'approvals',
					title: 'Approval requests',
					description: 'When someone requests your review.',
					checked: false
				}
			]
		},
		{
			id: 'in-app',
			title: 'In-app',
			description: 'Badges and banners while you are using the product.',
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
					description: 'Occasional tips to help you get more done.',
					checked: false
				}
			]
		}
	];

	let {
		title = 'Notification preferences',
		description = 'Choose how and when we notify you across email, push, and in-app.',
		groups = DEFAULT_GROUPS,
		class: className = '',
		onchange
	}: NotificationPreferencesPageProps = $props();
</script>

<div class={['mx-auto w-full max-w-2xl space-y-6', className]}>
	<PageHeader {title} {description} />

	<Stack gap="lg">
		{#each groups as group (group.id)}
			<NotificationSettingsGroup
				title={group.title}
				description={group.description}
				items={group.items}
				onchange={(itemId, checked) => onchange?.(group.id, itemId, checked)}
			/>
		{/each}
	</Stack>
</div>
