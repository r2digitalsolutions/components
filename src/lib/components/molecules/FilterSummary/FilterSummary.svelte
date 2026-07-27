<script lang="ts">
	export interface FilterSummaryItem {
		id: string;
		label: string;
	}

	interface FilterSummaryProps {
		items?: FilterSummaryItem[];
		clearAllLabel?: string;
		class?: string;
		onclear?: (id: string) => void;
		onclearAll?: () => void;
	}

	const {
		items = [],
		clearAllLabel = 'Clear all',
		class: className = '',
		onclear,
		onclearAll
	}: FilterSummaryProps = $props();

	const hasItems = $derived(items.length > 0);
</script>

{#if hasItems}
	<div
		class={['flex flex-wrap items-center gap-1.5', className]}
		role="group"
		aria-label="Active filters"
	>
		<span class="text-xs font-medium text-muted">Filters:</span>

		{#each items as item (item.id)}
			<span
				class="inline-flex items-center gap-1 rounded-full border border-brand-500/30 bg-brand-50/80 pl-2.5 pr-1 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-950/40 dark:text-brand-300"
			>
				{item.label}
				{#if onclear}
					<button
						type="button"
						class="flex h-5 w-5 items-center justify-center rounded-full text-brand-600 transition-colors hover:bg-brand-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:text-brand-400"
						aria-label={`Remove filter ${item.label}`}
						onclick={() => onclear(item.id)}
					>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="h-3 w-3" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				{/if}
			</span>
		{/each}

		{#if onclearAll && items.length > 1}
			<button
				type="button"
				class="text-xs font-medium text-brand-600 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:text-brand-400"
				onclick={() => onclearAll()}
			>
				{clearAllLabel}
			</button>
		{/if}
	</div>
{/if}
