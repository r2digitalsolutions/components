<script lang="ts">
	import SortableList, { type SortableItem } from './SortableList.svelte';

	let props = $props<{
		variant?: 'card' | 'plain';
		size?: 'sm' | 'md';
		showIndex?: boolean;
	}>();

	let items = $state<SortableItem[]>([
		{ id: '1', label: 'Inbox', description: 'Primary conversations', meta: '128' },
		{ id: '2', label: 'Starred', description: 'Marked as important', meta: '12' },
		{ id: '3', label: 'Snoozed', description: 'Come back later', meta: '4' },
		{ id: '4', label: 'Archive', description: 'Stored messages', meta: '2.1k' },
		{ id: '5', label: 'Trash', description: 'Deleted items', meta: '36' }
	]);

	const order = $derived(items.map((i) => i.label).join(' → '));
</script>

<div class="w-full max-w-md space-y-3">
	<div class="rounded-2xl border border-border bg-surface p-4 shadow-sm">
		<div class="mb-4">
			<p class="text-sm font-semibold text-primary">Mailbox sections</p>
			<p class="text-xs text-muted">Drag the handle or use ↑ ↓ with focus on the grip.</p>
		</div>

		<SortableList
			bind:items
			variant={props.variant ?? 'card'}
			size={props.size ?? 'md'}
			showIndex={props.showIndex ?? true}
		/>
	</div>

	<p class="px-1 text-xs text-muted">
		Order: <span class="font-medium text-secondary">{order}</span>
	</p>
</div>
