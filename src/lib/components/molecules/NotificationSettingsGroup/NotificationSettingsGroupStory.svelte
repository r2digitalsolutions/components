<script lang="ts">
	import NotificationSettingsGroup from './NotificationSettingsGroup.svelte';

	let items = $state([
		{ id: 'mentions', title: 'Mentions', description: 'When someone @mentions you.', checked: true },
		{ id: 'comments', title: 'Comments', description: 'Replies on threads you follow.', checked: true },
		{ id: 'digest', title: 'Weekly digest', description: 'Summary of activity every Monday.', checked: false }
	]);

	let last = $state('');

	function handleChange(id: string, checked: boolean) {
		items = items.map((item) => (item.id === id ? { ...item, checked } : item));
		last = `${id}: ${checked}`;
	}
</script>

<div class="mx-auto max-w-lg p-4">
	<NotificationSettingsGroup
		title="Email notifications"
		description="Choose what you want to receive in your inbox."
		{items}
		onchange={handleChange}
	/>
	{#if last}
		<p class="mt-4 text-center text-xs text-muted">Changed: {last}</p>
	{/if}
</div>
