<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';

	export interface TableColumnOption {
		id: string;
		label: string;
		visible?: boolean;
		/** Disable toggling this column */
		locked?: boolean;
	}

	export type TableDensity = 'compact' | 'comfortable' | 'spacious';

	interface TableToolbarProps {
		columns?: TableColumnOption[];
		density?: TableDensity;
		search?: string;
		searchPlaceholder?: string;
		showSearch?: boolean;
		showDensity?: boolean;
		showColumns?: boolean;
		showExport?: boolean;
		exportLabel?: string;
		selectedCount?: number;
		class?: string;
		onsearch?: (value: string) => void;
		ondensitychange?: (density: TableDensity) => void;
		oncolumnschange?: (columns: TableColumnOption[]) => void;
		onexport?: (format: 'csv' | 'json') => void;
	}

	let {
		columns = $bindable<TableColumnOption[]>([]),
		density = $bindable<TableDensity>('comfortable'),
		search = $bindable(''),
		searchPlaceholder = 'Search…',
		showSearch = true,
		showDensity = true,
		showColumns = true,
		showExport = true,
		exportLabel = 'Export',
		selectedCount = 0,
		class: className = '',
		onsearch,
		ondensitychange,
		oncolumnschange,
		onexport
	}: TableToolbarProps = $props();

	let columnsOpen = $state(false);
	let exportOpen = $state(false);

	const densities: { id: TableDensity; label: string }[] = [
		{ id: 'compact', label: 'Compact' },
		{ id: 'comfortable', label: 'Comfortable' },
		{ id: 'spacious', label: 'Spacious' }
	];

	function toggleColumn(id: string) {
		const next = columns.map((c) =>
			c.id === id && !c.locked ? { ...c, visible: !(c.visible ?? true) } : c
		);
		columns = next;
		oncolumnschange?.(next);
	}

	function setDensity(d: TableDensity) {
		density = d;
		ondensitychange?.(d);
	}

	function onSearchInput(e: Event) {
		search = (e.currentTarget as HTMLInputElement).value;
		onsearch?.(search);
	}
</script>

<div
	class={[
		'flex flex-wrap items-center gap-2 rounded-xl border border-border bg-surface-elevated px-3 py-2',
		className
	]}
>
	{#if showSearch}
		<label class="relative min-w-[160px] flex-1">
			<span class="sr-only">Search</span>
			<svg
				class="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<circle cx="11" cy="11" r="7" />
				<path stroke-linecap="round" d="M20 20l-3-3" />
			</svg>
			<input
				type="search"
				class="h-8 w-full rounded-lg border border-border bg-surface pl-8 pr-3 text-sm text-primary placeholder:text-muted focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
				placeholder={searchPlaceholder}
				value={search}
				oninput={onSearchInput}
			/>
		</label>
	{/if}

	{#if selectedCount > 0}
		<span class="rounded-full bg-brand-500/10 px-2.5 py-1 text-xs font-medium text-brand-600 dark:text-brand-300">
			{selectedCount} selected
		</span>
	{/if}

	<div class="ml-auto flex flex-wrap items-center gap-1.5">
		{#if showDensity}
			<div class="inline-flex rounded-lg border border-border p-0.5" role="group" aria-label="Density">
				{#each densities as d (d.id)}
					<button
						type="button"
						class={[
							'rounded-md px-2 py-1 text-[11px] font-medium transition-colors',
							density === d.id
								? 'bg-brand-500 text-white'
								: 'text-secondary hover:bg-surface-overlay hover:text-primary'
						]}
						onclick={() => setDensity(d.id)}
					>
						{d.label}
					</button>
				{/each}
			</div>
		{/if}

		{#if showColumns}
			<div class="relative">
				<Button
					variant="outline"
					size="sm"
					onclick={() => {
						columnsOpen = !columnsOpen;
						exportOpen = false;
					}}
				>
					Columns
				</Button>
				{#if columnsOpen}
					<div
						class="absolute right-0 z-20 mt-1 w-52 rounded-xl border border-border bg-surface-elevated p-2 shadow-lg"
						role="menu"
					>
						{#each columns as col (col.id)}
							<label
								class={[
									'flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-surface-overlay',
									col.locked && 'opacity-60'
								]}
							>
								<input
									type="checkbox"
									class="rounded border-border text-brand-500 focus:ring-brand-500"
									checked={col.visible ?? true}
									disabled={col.locked}
									onchange={() => toggleColumn(col.id)}
								/>
								<span class="text-primary">{col.label}</span>
							</label>
						{/each}
					</div>
				{/if}
			</div>
		{/if}

		{#if showExport}
			<div class="relative">
				<Button
					variant="outline"
					size="sm"
					onclick={() => {
						exportOpen = !exportOpen;
						columnsOpen = false;
					}}
				>
					{exportLabel}
				</Button>
				{#if exportOpen}
					<div
						class="absolute right-0 z-20 mt-1 w-36 overflow-hidden rounded-xl border border-border bg-surface-elevated py-1 shadow-lg"
						role="menu"
					>
						<button
							type="button"
							class="block w-full px-3 py-1.5 text-left text-sm text-primary hover:bg-surface-overlay"
							onclick={() => {
								onexport?.('csv');
								exportOpen = false;
							}}
						>
							Export CSV
						</button>
						<button
							type="button"
							class="block w-full px-3 py-1.5 text-left text-sm text-primary hover:bg-surface-overlay"
							onclick={() => {
								onexport?.('json');
								exportOpen = false;
							}}
						>
							Export JSON
						</button>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
