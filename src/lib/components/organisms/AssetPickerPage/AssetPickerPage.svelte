<script lang="ts">
	import SearchBar from '$lib/components/molecules/SearchBar/SearchBar.svelte';
	import EntityPreview from '$lib/components/molecules/EntityPreview/EntityPreview.svelte';
	import AttachmentChip from '$lib/components/molecules/AttachmentChip/AttachmentChip.svelte';
	import SelectionBox from '$lib/components/atoms/SelectionBox/SelectionBox.svelte';
	import SegmentedControl from '$lib/components/molecules/SegmentedControl/SegmentedControl.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	export type AssetPickerView = 'grid' | 'list';

	export interface PickerAsset {
		id: string;
		name: string;
		url?: string;
		type?: string;
		size?: string;
	}

	interface AssetPickerPageProps {
		title?: string;
		assets?: PickerAsset[];
		selected?: string[];
		multiple?: boolean;
		query?: string;
		view?: AssetPickerView;
		class?: string;
		onconfirm?: (ids: string[]) => void;
		oncancel?: () => void;
	}

	let {
		title = 'Choose assets',
		assets = [],
		selected = $bindable<string[]>([]),
		multiple = true,
		query = $bindable(''),
		view = $bindable<AssetPickerView>('grid'),
		class: className = '',
		onconfirm,
		oncancel
	}: AssetPickerPageProps = $props();

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return assets;
		return assets.filter(
			(a) =>
				a.name.toLowerCase().includes(q) ||
				a.type?.toLowerCase().includes(q)
		);
	});

	const selectedAssets = $derived(assets.filter((a) => selected.includes(a.id)));

	function isSelected(id: string) {
		return selected.includes(id);
	}

	function toggleAsset(id: string) {
		if (multiple) {
			selected = isSelected(id)
				? selected.filter((x) => x !== id)
				: [...selected, id];
		} else {
			selected = isSelected(id) ? [] : [id];
		}
	}

	function removeSelected(id: string) {
		selected = selected.filter((x) => x !== id);
	}

	function confirm() {
		onconfirm?.([...selected]);
	}
</script>

<div class={['mx-auto flex w-full max-w-3xl flex-col gap-5', className]}>
	<header class="space-y-1">
		<h1 class="text-xl font-semibold tracking-tight text-primary sm:text-2xl">{title}</h1>
		<p class="text-sm text-muted">
			Select {multiple ? 'one or more files' : 'a file'} to attach or insert.
		</p>
	</header>

	<SearchBar
		bind:value={query}
		placeholder="Search assets…"
		size="lg"
		variant="soft"
		showButton={false}
		onclear={() => (query = '')}
	/>

	<div class="flex flex-wrap items-center justify-between gap-3">
		<p class="text-sm text-secondary">
			<span class="font-semibold tabular-nums text-primary">{filtered.length}</span>
			asset{filtered.length === 1 ? '' : 's'}
			{#if selected.length}
				· <span class="font-medium text-brand-600 dark:text-brand-400">{selected.length} selected</span>
			{/if}
		</p>
		<SegmentedControl
			bind:value={view}
			size="sm"
			items={[
				{ id: 'grid', label: 'Grid' },
				{ id: 'list', label: 'List' }
			]}
		/>
	</div>

	{#if selectedAssets.length}
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

	{#if filtered.length}
		{#if view === 'grid'}
			<ul class="grid grid-cols-2 gap-3 sm:grid-cols-3">
				{#each filtered as asset (asset.id)}
					<li>
						<button
							type="button"
							class={[
								'group relative flex w-full flex-col overflow-hidden rounded-xl border text-left transition-all',
								isSelected(asset.id)
									? 'border-brand-500 ring-2 ring-brand-500/20'
									: 'border-border bg-surface-elevated hover:border-brand-300'
							]}
							onclick={() => toggleAsset(asset.id)}
						>
							{#if asset.url}
								<img src={asset.url} alt="" class="aspect-square w-full object-cover" />
							{:else}
								<div
									class="flex aspect-square w-full items-center justify-center bg-surface-overlay text-muted"
								>
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="h-8 w-8">
										<path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
								</div>
							{/if}
							<div class="space-y-0.5 p-2.5">
								<p class="truncate text-xs font-medium text-primary">{asset.name}</p>
								{#if asset.type || asset.size}
									<p class="truncate text-[10px] text-muted">
										{#if asset.type}{asset.type}{/if}{#if asset.type && asset.size} · {/if}{#if asset.size}{asset.size}{/if}
									</p>
								{/if}
							</div>
							<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
							<div class="absolute top-2 right-2" onclick={(e) => e.stopPropagation()}>
								<SelectionBox
									checked={isSelected(asset.id)}
									size="sm"
									label={`Select ${asset.name}`}
									onchange={() => toggleAsset(asset.id)}
								/>
							</div>
						</button>
					</li>
				{/each}
			</ul>
		{:else}
			<ul class="space-y-2" role="list">
				{#each filtered as asset (asset.id)}
					<li class="flex items-center gap-2">
						<SelectionBox
							checked={isSelected(asset.id)}
							label={`Select ${asset.name}`}
							onchange={() => toggleAsset(asset.id)}
						/>
						<div class="min-w-0 flex-1">
							<EntityPreview
								title={asset.name}
								subtitle={asset.type}
								meta={asset.size}
								image={asset.url}
								kind={asset.type}
								onclick={() => toggleAsset(asset.id)}
							/>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	{:else}
		<EmptyState
			title="No assets found"
			description="Try another search term or upload new files."
		/>
	{/if}

	<footer class="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-4">
		<Button size="sm" variant="ghost" onclick={() => oncancel?.()}>Cancel</Button>
		<Button size="sm" disabled={!selected.length} onclick={confirm}>
			Confirm{selected.length ? ` (${selected.length})` : ''}
		</Button>
	</footer>
</div>
