<script lang="ts">
	import type { Snippet } from 'svelte';
	import SearchBar from '$lib/components/molecules/SearchBar/SearchBar.svelte';
	import AttachmentChip from '$lib/components/molecules/AttachmentChip/AttachmentChip.svelte';
	import SelectCard from '$lib/components/molecules/SelectCard/SelectCard.svelte';
	import SegmentedControl from '$lib/components/molecules/SegmentedControl/SegmentedControl.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import FileText from '@lucide/svelte/icons/file-text';
	import FileSpreadsheet from '@lucide/svelte/icons/file-spreadsheet';
	import FileCode from '@lucide/svelte/icons/file-code';
	import Film from '@lucide/svelte/icons/film';
	import ImageIcon from '@lucide/svelte/icons/image';
	import type { Component } from 'svelte';

	export type AssetPickerView = 'grid' | 'list';

	export interface PickerAsset {
		id: string;
		name: string;
		url?: string;
		type?: string;
		size?: string;
		modified?: string;
		folder?: string;
		disabled?: boolean;
	}

	interface AssetPickerPageProps {
		title?: string;
		description?: string;
		assets?: PickerAsset[];
		selected?: string[];
		multiple?: boolean;
		query?: string;
		view?: AssetPickerView;
		loading?: boolean;
		confirmLabel?: string;
		cancelLabel?: string;
		emptyTitle?: string;
		emptyDescription?: string;
		showSelectedBar?: boolean;
		class?: string;
		actions?: Snippet;
		emptyAction?: Snippet;
		onconfirm?: (ids: string[]) => void;
		oncancel?: () => void;
		onupload?: () => void;
		onquerychange?: (query: string) => void;
		onviewchange?: (view: AssetPickerView) => void;
	}

	let {
		title = 'Choose assets',
		description = '',
		assets = [],
		selected = $bindable<string[]>([]),
		multiple = true,
		query = $bindable(''),
		view = $bindable<AssetPickerView>('grid'),
		loading = false,
		confirmLabel = 'Confirm',
		cancelLabel = 'Cancel',
		emptyTitle = 'No assets found',
		emptyDescription = 'Try another search term or upload new files.',
		showSelectedBar = true,
		class: className = '',
		actions,
		emptyAction,
		onconfirm,
		oncancel,
		onupload,
		onquerychange,
		onviewchange
	}: AssetPickerPageProps = $props();

	const typeIcon: Record<string, Component> = {
		PDF: FileText,
		DOC: FileText,
		DOCX: FileText,
		MD: FileCode,
		XLSX: FileSpreadsheet,
		CSV: FileSpreadsheet,
		MP4: Film,
		MOV: Film,
		PNG: ImageIcon,
		JPG: ImageIcon,
		JPEG: ImageIcon,
		WEBP: ImageIcon,
		SVG: ImageIcon,
		GIF: ImageIcon
	};

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return assets;
		return assets.filter(
			(a) =>
				a.name.toLowerCase().includes(q) ||
				a.type?.toLowerCase().includes(q) ||
				a.folder?.toLowerCase().includes(q)
		);
	});

	const selectedAssets = $derived(assets.filter((a) => selected.includes(a.id)));

	const subtitle = $derived(
		description ||
			`Select ${multiple ? 'one or more files' : 'a file'} to attach or insert.`
	);

	function isSelected(id: string) {
		return selected.includes(id);
	}

	function toggleAsset(id: string) {
		const asset = assets.find((a) => a.id === id);
		if (asset?.disabled) return;
		if (multiple) {
			selected = isSelected(id) ? selected.filter((x) => x !== id) : [...selected, id];
		} else {
			selected = isSelected(id) ? [] : [id];
		}
	}

	function removeSelected(id: string) {
		selected = selected.filter((x) => x !== id);
	}

	function clearSelected() {
		selected = [];
	}

	function confirm() {
		onconfirm?.([...selected]);
	}

	function handleView(id: string) {
		view = id as AssetPickerView;
		onviewchange?.(view);
	}

	function fileIcon(type?: string) {
		if (!type) return FileText;
		return typeIcon[type.toUpperCase()] ?? FileText;
	}
</script>

<div class={['mx-auto flex w-full max-w-3xl flex-col gap-5', className]}>
	<PageHeader {title} description={subtitle}>
		{#snippet actions()}
			{#if actions}
				{@render actions()}
			{:else if onupload}
				<Button size="sm" variant="secondary" onclick={() => onupload?.()}>Upload</Button>
			{/if}
		{/snippet}
	</PageHeader>

	<SearchBar
		bind:value={query}
		placeholder="Search by name, type, or folder…"
		size="lg"
		variant="soft"
		showButton={false}
		onclear={() => {
			query = '';
			onquerychange?.('');
		}}
		oninput={() => onquerychange?.(query)}
	/>

	<div class="flex flex-wrap items-center justify-between gap-3">
		<p class="text-sm text-secondary">
			<span class="font-semibold tabular-nums text-primary">{filtered.length}</span>
			asset{filtered.length === 1 ? '' : 's'}
			{#if selected.length}
				·
				<span class="font-medium text-brand-600 dark:text-brand-400">
					{selected.length} selected
				</span>
			{/if}
		</p>
		<div class="flex flex-wrap items-center gap-2">
			{#if selected.length}
				<button
					type="button"
					class="text-xs font-medium text-muted transition-colors hover:text-primary"
					onclick={clearSelected}
				>
					Clear
				</button>
			{/if}
			<SegmentedControl
				bind:value={view}
				size="sm"
				items={[
					{ id: 'grid', label: 'Grid' },
					{ id: 'list', label: 'List' }
				]}
				onchange={handleView}
			/>
		</div>
	</div>

	{#if showSelectedBar && selectedAssets.length}
		<div class="flex flex-wrap gap-2 rounded-xl border border-border bg-surface-overlay/50 p-3">
			{#each selectedAssets as asset (asset.id)}
				<AttachmentChip
					name={asset.name}
					type={asset.type}
					size={asset.size}
					removable
					onremove={() => removeSelected(asset.id)}
				/>
			{/each}
		</div>
	{/if}

	{#if loading}
		<div
			class="flex min-h-[14rem] items-center justify-center rounded-xl border border-dashed border-border bg-surface-overlay/30"
		>
			<p class="text-sm text-muted">Loading assets…</p>
		</div>
	{:else if filtered.length}
		{#if view === 'grid'}
			<ul class="grid grid-cols-2 gap-3 sm:grid-cols-3">
				{#each filtered as asset (asset.id)}
					{@const Icon = fileIcon(asset.type)}
					<li>
						<SelectCard
							layout="media"
							check="box"
							title={asset.name}
							description={asset.type}
							meta={asset.size}
							image={asset.url}
							selected={isSelected(asset.id)}
							disabled={asset.disabled}
							onchange={() => toggleAsset(asset.id)}
						>
							{#snippet leading()}
								{#if !asset.url}
									<Icon class="h-8 w-8 text-muted" aria-hidden="true" />
								{/if}
							{/snippet}
						</SelectCard>
					</li>
				{/each}
			</ul>
		{:else}
			<ul class="space-y-2" role="list">
				{#each filtered as asset (asset.id)}
					{@const Icon = fileIcon(asset.type)}
					<li>
						<SelectCard
							layout="row"
							check="box"
							title={asset.name}
							description={[asset.folder, asset.type, asset.modified].filter(Boolean).join(' · ')}
							meta={asset.size}
							image={asset.url}
							selected={isSelected(asset.id)}
							disabled={asset.disabled}
							onchange={() => toggleAsset(asset.id)}
						>
							{#snippet leading()}
								{#if !asset.url}
									<span
										class="flex h-11 w-11 items-center justify-center rounded-lg bg-surface-overlay text-secondary"
									>
										<Icon class="h-5 w-5" aria-hidden="true" />
									</span>
								{/if}
							{/snippet}
							{#snippet trailing()}
								{#if asset.type}
									<Badge size="sm" variant="secondary">{asset.type}</Badge>
								{/if}
							{/snippet}
						</SelectCard>
					</li>
				{/each}
			</ul>
		{/if}
	{:else}
		<EmptyState title={emptyTitle} description={emptyDescription}>
			{#snippet action()}
				{#if emptyAction}
					{@render emptyAction()}
				{:else if onupload}
					<Button size="sm" variant="secondary" onclick={() => onupload?.()}>Upload files</Button>
				{/if}
			{/snippet}
		</EmptyState>
	{/if}

	<footer class="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-4">
		<Button size="sm" variant="ghost" onclick={() => oncancel?.()}>{cancelLabel}</Button>
		<Button size="sm" disabled={!selected.length} onclick={confirm}>
			{confirmLabel}{selected.length ? ` (${selected.length})` : ''}
		</Button>
	</footer>
</div>
