<script lang="ts">
	import List, { type ListItem } from './List.svelte';

	let props = $props<{
		selectable?: boolean;
	}>();

	const items: ListItem[] = [
		{ id: 'inbox', label: 'Inbox', description: '12 unread' },
		{ id: 'starred', label: 'Starred', description: 'Favorites' },
		{ id: 'archive', label: 'Archive', description: 'Older mail' },
		{ id: 'spam', label: 'Spam', description: 'Blocked', disabled: true }
	];

	let value = $state('inbox');
</script>

<div class="w-72 max-w-full rounded-xl border border-border bg-surface-elevated p-2">
	<List
		{items}
		bind:value
		selectable={props.selectable ?? true}
	/>
</div>
