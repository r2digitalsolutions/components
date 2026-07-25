<script lang="ts">
	import BulkActionBar from './BulkActionBar.svelte';
	import type {
		BulkAction,
		BulkActionBarPlacement,
		BulkActionBarSize,
		BulkActionBarTone
	} from './BulkActionBar.svelte';
	import Checkbox from '$lib/components/atoms/Checkbox/Checkbox.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Archive from '@lucide/svelte/icons/archive';
	import FolderInput from '@lucide/svelte/icons/folder-input';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import Share2 from '@lucide/svelte/icons/share-2';
	import Tag from '@lucide/svelte/icons/tag';
	import Download from '@lucide/svelte/icons/download';

	type Example = 'default' | 'inline' | 'icons' | 'loading' | 'neutral' | 'compact';

	let {
		example = 'default',
		size = 'sm',
		placement = 'dock',
		tone = 'brand',
		maxPrimary = 3
	}: {
		example?: Example;
		size?: BulkActionBarSize;
		placement?: BulkActionBarPlacement;
		tone?: BulkActionBarTone;
		maxPrimary?: number;
	} = $props();

	let selected = $state(['1', '3']);
	let lastAction = $state('—');
	let loadingId = $state<string | null>(null);

	const items = [
		{ id: '1', label: 'Design review.pdf', meta: 'PDF · 2.4 MB' },
		{ id: '2', label: 'Q3 forecast.xlsx', meta: 'Sheet · 890 KB' },
		{ id: '3', label: 'Brand kit.zip', meta: 'Archive · 18 MB' },
		{ id: '4', label: 'Kickoff notes.md', meta: 'Doc · 12 KB' },
		{ id: '5', label: 'Hero mock.png', meta: 'Image · 3.1 MB' }
	];

	const baseActions: BulkAction[] = [
		{ id: 'move', label: 'Move', variant: 'secondary', icon: FolderInput },
		{ id: 'archive', label: 'Archive', variant: 'secondary', icon: Archive },
		{ id: 'share', label: 'Share', variant: 'ghost', icon: Share2, overflow: true },
		{ id: 'tag', label: 'Add tag', variant: 'ghost', icon: Tag, overflow: true },
		{ id: 'download', label: 'Download', variant: 'ghost', icon: Download, overflow: true },
		{
			id: 'delete',
			label: 'Delete',
			variant: 'destructive',
			icon: Trash2,
			confirm: true,
			confirmLabel: 'Delete forever'
		}
	];

	const iconOnlyActions: BulkAction[] = [
		{ id: 'move', label: 'Move', variant: 'secondary', icon: FolderInput, iconOnly: true },
		{ id: 'archive', label: 'Archive', variant: 'secondary', icon: Archive, iconOnly: true },
		{ id: 'download', label: 'Download', variant: 'ghost', icon: Download, iconOnly: true },
		{
			id: 'delete',
			label: 'Delete',
			variant: 'destructive',
			icon: Trash2,
			iconOnly: true,
			confirm: true,
			confirmLabel: 'Delete'
		}
	];

	const actions = $derived.by((): BulkAction[] => {
		if (example === 'icons') return iconOnlyActions;
		if (example === 'loading') {
			return baseActions.map((a) =>
				a.id === 'archive' ? { ...a, loading: loadingId === 'archive' } : a
			);
		}
		return baseActions;
	});

	const resolvedSize = $derived(example === 'compact' ? 'xs' : size);
	const resolvedPlacement = $derived(example === 'inline' ? 'inline' : placement);
	const resolvedTone = $derived(example === 'neutral' ? 'neutral' : tone);

	function toggle(id: string, checked: boolean) {
		selected = checked ? [...selected, id] : selected.filter((x) => x !== id);
	}

	function selectAll() {
		selected = items.map((i) => i.id);
	}

	function selectNone() {
		selected = [];
	}

	async function onAction(id: string) {
		lastAction = id;
		if (example === 'loading' && id === 'archive') {
			loadingId = 'archive';
			await new Promise((r) => setTimeout(r, 1200));
			loadingId = null;
		}
		if (id === 'delete') selected = [];
	}
</script>

<div
	class={[
		'relative mx-auto max-w-2xl space-y-4 rounded-2xl border border-border bg-surface p-5',
		resolvedPlacement === 'dock' ? 'pb-24' : 'pb-4'
	]}
>
	<div class="flex items-end justify-between gap-3">
		<div>
			<p class="text-sm font-semibold text-primary">Files</p>
			<Text size="xs" tone="muted">
				{#if example === 'icons'}Icon-only actions
				{:else if example === 'loading'}Archive shows loading
				{:else if example === 'inline'}Inline sticky footer
				{:else if example === 'compact'}Extra compact (xs)
				{:else if example === 'neutral'}Neutral tone
				{:else}Select items to open the bar{/if}
			</Text>
		</div>
		<div class="flex items-center gap-2">
			<Badge size="sm" variant="secondary">{selected.length} selected</Badge>
			<button
				type="button"
				class="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
				onclick={selectAll}
			>
				Select all
			</button>
		</div>
	</div>

	<ul class="divide-y divide-border rounded-xl border border-border bg-surface-elevated">
		{#each items as item (item.id)}
			<li class="flex items-center gap-3 px-3 py-2.5">
				<Checkbox
					size="sm"
					checked={selected.includes(item.id)}
					onchange={(c) => toggle(item.id, c)}
					label={item.label}
				/>
				<span class="ml-auto hidden text-xs text-muted sm:inline">{item.meta}</span>
			</li>
		{/each}
	</ul>

	{#if lastAction !== '—'}
		<Text size="xs" tone="muted">Last action: <span class="font-mono">{lastAction}</span></Text>
	{/if}

	{#if example === 'icons'}
		{#snippet extra()}
			<Badge size="sm" variant="info">Pro</Badge>
		{/snippet}
		<BulkActionBar
			count={selected.length}
			total={items.length}
			itemLabel="file"
			itemLabelPlural="files"
			actions={actions}
			size={resolvedSize}
			placement={resolvedPlacement}
			tone={resolvedTone}
			{maxPrimary}
			description="Bulk edit workspace files"
			extra={extra}
			onselectall={selectAll}
			onselectnone={selectNone}
			onaction={onAction}
			onclear={selectNone}
		/>
	{:else}
		<BulkActionBar
			count={selected.length}
			total={items.length}
			itemLabel="file"
			itemLabelPlural="files"
			actions={actions}
			size={resolvedSize}
			placement={resolvedPlacement}
			tone={resolvedTone}
			{maxPrimary}
			hint={example === 'loading' ? 'Actions may take a moment' : undefined}
			onselectall={selectAll}
			onselectnone={selectNone}
			onaction={onAction}
			onclear={selectNone}
		/>
	{/if}
</div>
