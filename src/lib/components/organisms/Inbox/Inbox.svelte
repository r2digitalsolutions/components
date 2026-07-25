<script lang="ts">
	import type { Snippet } from 'svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import FilterBar from '$lib/components/molecules/FilterBar/FilterBar.svelte';
	import type { FilterChip } from '$lib/components/molecules/FilterBar/FilterBar.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import NotificationRow from '$lib/components/molecules/NotificationRow/NotificationRow.svelte';
	import type { NotificationRowData } from '$lib/components/molecules/NotificationRow/NotificationRow.svelte';
	import CountBadge from '$lib/components/atoms/CountBadge/CountBadge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import ScrollArea from '$lib/components/atoms/ScrollArea/ScrollArea.svelte';

	interface InboxProps {
		title?: string;
		items?: NotificationRowData[];
		query?: string;
		filters?: FilterChip[];
		loading?: boolean;
		class?: string;
		headerActions?: Snippet;
		onitemclick?: (item: NotificationRowData) => void;
		onmarkallread?: () => void;
		onquerychange?: (query: string) => void;
	}

	let {
		title = 'Inbox',
		items = $bindable<NotificationRowData[]>([]),
		query = $bindable(''),
		filters = $bindable<FilterChip[]>([]),
		loading = false,
		class: className = '',
		headerActions,
		onitemclick,
		onmarkallread,
		onquerychange
	}: InboxProps = $props();

	const unread = $derived(items.filter((i) => !i.read).length);

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return items;
		return items.filter(
			(i) =>
				i.title.toLowerCase().includes(q) ||
				(i.description?.toLowerCase().includes(q) ?? false)
		);
	});

	function markAllRead() {
		items = items.map((i) => ({ ...i, read: true }));
		onmarkallread?.();
	}

	function handleClick(item: NotificationRowData) {
		items = items.map((n) => (n.id === item.id ? { ...n, read: true } : n));
		onitemclick?.(item);
	}
</script>

<Card class={className} padding="sm" chrome={false}>
	{#snippet header()}
		<div class="flex items-center justify-between gap-3">
			<div class="flex items-center gap-2">
				<h2 class="text-sm font-semibold text-primary">{title}</h2>
				<CountBadge count={unread} variant="primary" />
			</div>
			<div class="flex items-center gap-2">
				{#if unread > 0}
					<Button size="xs" variant="ghost" onclick={markAllRead}>Mark all read</Button>
				{/if}
				{#if headerActions}
					{@render headerActions()}
				{/if}
			</div>
		</div>
	{/snippet}

	<div class="space-y-3">
		<FilterBar bind:query bind:filters searchable {onquerychange} />

		{#if loading}
			<p class="py-10 text-center text-sm text-muted">Loading…</p>
		{:else if filtered.length === 0}
			<EmptyState
				title="Inbox zero"
				description="You're all caught up. New messages will show up here."
				class="border-0 bg-transparent"
			/>
		{:else}
			<ScrollArea maxHeight="24rem" class="pr-1">
				<div class="flex flex-col gap-0.5">
					{#each filtered as item (item.id)}
						<NotificationRow {item} onclick={handleClick} />
					{/each}
				</div>
			</ScrollArea>
		{/if}
	</div>
</Card>
