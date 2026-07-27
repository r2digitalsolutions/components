<script lang="ts">
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';

	interface RecentSearchesProps {
		items?: string[];
		title?: string;
		class?: string;
		onselect?: (query: string) => void;
		onremove?: (query: string) => void;
		onclear?: () => void;
	}

	const {
		items = [],
		title = 'Recent searches',
		class: className = '',
		onselect,
		onremove,
		onclear
	}: RecentSearchesProps = $props();

	const hasItems = $derived(items.length > 0);
</script>

{#if hasItems}
	<div class={['space-y-2', className]}>
		<div class="flex items-center justify-between gap-2">
			<p class="text-xs font-semibold uppercase tracking-wide text-muted">{title}</p>
			{#if onclear}
				<button
					type="button"
					class="text-[11px] font-medium text-brand-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:text-brand-400"
					onclick={() => onclear()}
				>
					Clear
				</button>
			{/if}
		</div>

		<ul class="space-y-1" aria-label={title}>
			{#each items as query, i (query + i)}
				<li class="group flex items-center gap-1">
					<button
						type="button"
						class={[
							'flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors',
							'hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30'
						]}
						onclick={() => onselect?.(query)}
					>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true">
							<circle cx="11" cy="11" r="7" />
							<path stroke-linecap="round" d="M16 16l4 4" />
						</svg>
						<span class="truncate text-secondary group-hover:text-primary">{query}</span>
					</button>
					{#if onremove}
						<IconButton
							label={`Remove ${query}`}
							size="sm"
							variant="ghost"
							class="opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
							onclick={() => onremove(query)}
						>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-3.5 w-3.5" aria-hidden="true">
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</IconButton>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
{/if}
