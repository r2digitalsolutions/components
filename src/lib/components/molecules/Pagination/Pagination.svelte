<script lang="ts">
	interface PaginationProps {
		page?: number;
		totalPages?: number;
		siblingCount?: number;
		disabled?: boolean;
		class?: string;
		onchange?: (page: number) => void;
	}

	let {
		page = $bindable(1),
		totalPages = 10,
		siblingCount = 1,
		disabled = false,
		class: className = '',
		onchange
	}: PaginationProps = $props();

	const pages = $derived(buildPages(page, totalPages, siblingCount));

	function buildPages(current: number, total: number, siblings: number): Array<number | 'ellipsis'> {
		if (total <= 1) return [1];
		const set = new Set<number>();
		set.add(1);
		set.add(total);
		for (let i = current - siblings; i <= current + siblings; i++) {
			if (i >= 1 && i <= total) set.add(i);
		}
		const sorted = [...set].sort((a, b) => a - b);
		const result: Array<number | 'ellipsis'> = [];
		for (let i = 0; i < sorted.length; i++) {
			result.push(sorted[i]);
			if (i < sorted.length - 1 && sorted[i + 1] - sorted[i] > 1) {
				result.push('ellipsis');
			}
		}
		return result;
	}

	function go(next: number) {
		if (disabled) return;
		const clamped = Math.min(totalPages, Math.max(1, next));
		if (clamped === page) return;
		page = clamped;
		onchange?.(clamped);
	}
</script>

<nav class={['flex items-center gap-1', className]} aria-label="Pagination">
	<button
		type="button"
		onclick={() => go(page - 1)}
		disabled={disabled || page <= 1}
		class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-elevated text-secondary transition hover:bg-surface-overlay hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
		aria-label="Previous page"
	>
		<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
		</svg>
	</button>

	{#each pages as item, index (typeof item === 'number' ? item : `e-${index}`)}
		{#if item === 'ellipsis'}
			<span class="px-1 text-xs text-secondary" aria-hidden="true">…</span>
		{:else}
			<button
				type="button"
				onclick={() => go(item)}
				disabled={disabled}
				aria-current={page === item ? 'page' : undefined}
				class={[
					'inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2.5 text-sm font-medium transition',
					page === item
						? 'bg-brand-600 text-white'
						: 'border border-border bg-surface-elevated text-secondary hover:bg-surface-overlay hover:text-primary',
					disabled && 'cursor-not-allowed opacity-40'
				]}
			>
				{item}
			</button>
		{/if}
	{/each}

	<button
		type="button"
		onclick={() => go(page + 1)}
		disabled={disabled || page >= totalPages}
		class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-elevated text-secondary transition hover:bg-surface-overlay hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
		aria-label="Next page"
	>
		<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
		</svg>
	</button>
</nav>
