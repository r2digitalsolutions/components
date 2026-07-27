<script lang="ts">
	import SearchInput from '$lib/components/molecules/SearchInput/SearchInput.svelte';
	import ChipBar from '$lib/components/molecules/ChipBar/ChipBar.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';

	export interface WidgetCatalogItem {
		id: string;
		label: string;
		description?: string;
		/** Suggested default grid size */
		defaultW?: number;
		defaultH?: number;
		icon?: string;
		category?: string;
		/** Soft accent for the icon tile */
		tone?: 'brand' | 'sky' | 'emerald' | 'amber' | 'rose' | 'violet';
	}

	export type WidgetPickerLayout = 'grid' | 'list';

	interface WidgetPickerProps {
		widgets: WidgetCatalogItem[];
		title?: string;
		columns?: 1 | 2 | 3;
		layout?: WidgetPickerLayout;
		searchable?: boolean;
		showSize?: boolean;
		showCategories?: boolean;
		query?: string;
		category?: string;
		class?: string;
		onselect?: (id: string) => void;
	}

	const TONE: Record<NonNullable<WidgetCatalogItem['tone']>, string> = {
		brand: 'bg-brand-500/15 text-brand-700 dark:text-brand-300',
		sky: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
		emerald: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
		amber: 'bg-amber-500/15 text-amber-800 dark:text-amber-300',
		rose: 'bg-rose-500/15 text-rose-700 dark:text-rose-300',
		violet: 'bg-violet-500/15 text-violet-700 dark:text-violet-300'
	};

	let {
		widgets,
		title = 'Add widget',
		columns = 1,
		layout = 'list',
		searchable = true,
		showSize = true,
		showCategories = true,
		query = $bindable(''),
		category = $bindable('all'),
		class: className = '',
		onselect
	}: WidgetPickerProps = $props();

	const categories = $derived.by(() => {
		const set = new Set<string>();
		for (const w of widgets) {
			if (w.category) set.add(w.category);
		}
		return Array.from(set).sort();
	});

	const chipItems = $derived([
		{ id: 'all', label: 'All', count: widgets.length },
		...categories.map((c) => ({
			id: c,
			label: c,
			count: widgets.filter((w) => w.category === c).length
		}))
	]);

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		return widgets.filter((w) => {
			if (category !== 'all' && w.category !== category) return false;
			if (!q) return true;
			const hay = [w.label, w.description, w.category, w.id].filter(Boolean).join(' ').toLowerCase();
			return hay.includes(q);
		});
	});

	const columnClasses: Record<1 | 2 | 3, string> = {
		1: 'grid-cols-1',
		2: 'grid-cols-2',
		3: 'grid-cols-2 sm:grid-cols-3'
	};
</script>

<section
	class={['flex flex-col gap-3 rounded-xl border border-border bg-surface-elevated p-3 sm:p-4', className]}
	aria-label={title}
>
	<div class="flex items-center justify-between gap-2">
		<h3 class="text-sm font-semibold text-primary">{title}</h3>
		<span class="text-[11px] tabular-nums text-muted">{filtered.length}/{widgets.length}</span>
	</div>

	{#if searchable}
		<SearchInput bind:value={query} placeholder="Search widgets…" size="sm" />
	{/if}

	{#if showCategories && categories.length > 0}
		<ChipBar items={chipItems} bind:value={category} size="sm" />
	{/if}

	{#if !filtered.length}
		<EmptyState
			title="No widgets"
			description={query ? `Nothing matches “${query}”.` : 'No widgets in this category.'}
			class="!border-0 !bg-transparent !p-4"
		/>
	{:else if layout === 'list'}
		<div class="flex max-h-[28rem] flex-col gap-1.5 overflow-y-auto" role="group" aria-label="Widget catalog">
			{#each filtered as widget (widget.id)}
				<button
					type="button"
					class={[
						'flex w-full items-start gap-3 rounded-xl border border-border bg-surface px-3 py-2.5 text-left transition-colors',
						'hover:border-brand-500/35 hover:bg-surface-overlay',
						'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30'
					]}
					onclick={() => onselect?.(widget.id)}
				>
					<span
						class={[
							'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base',
							TONE[widget.tone ?? 'brand']
						]}
						aria-hidden="true"
					>
						{widget.icon ?? '◆'}
					</span>
					<span class="min-w-0 flex-1">
						<span class="flex flex-wrap items-center gap-2">
							<span class="text-sm font-medium text-primary">{widget.label}</span>
							{#if showSize}
								<Badge size="sm" variant="secondary" class="tabular-nums">
									{widget.defaultW ?? 4}×{widget.defaultH ?? 2}
								</Badge>
							{/if}
						</span>
						{#if widget.description}
							<span class="mt-0.5 block text-xs leading-snug text-muted">{widget.description}</span>
						{/if}
					</span>
				</button>
			{/each}
		</div>
	{:else}
		<div
			class={['grid gap-2', columnClasses[columns]]}
			role="group"
			aria-label="Widget catalog"
		>
			{#each filtered as widget (widget.id)}
				<button
					type="button"
					class={[
						'flex flex-col items-start gap-2 rounded-xl border border-border bg-surface p-3 text-left transition-colors',
						'hover:border-brand-500/35 hover:bg-surface-overlay',
						'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30'
					]}
					onclick={() => onselect?.(widget.id)}
				>
					<div class="flex w-full items-start justify-between gap-2">
						<span
							class={[
								'flex h-9 w-9 items-center justify-center rounded-lg text-base',
								TONE[widget.tone ?? 'brand']
							]}
							aria-hidden="true"
						>
							{widget.icon ?? '◆'}
						</span>
						{#if showSize}
							<Badge size="sm" variant="secondary" class="tabular-nums">
								{widget.defaultW ?? 4}×{widget.defaultH ?? 2}
							</Badge>
						{/if}
					</div>
					<span>
						<span class="block text-sm font-medium text-primary">{widget.label}</span>
						{#if widget.description}
							<span class="mt-0.5 block text-xs leading-relaxed text-muted">{widget.description}</span>
						{/if}
					</span>
				</button>
			{/each}
		</div>
	{/if}
</section>
