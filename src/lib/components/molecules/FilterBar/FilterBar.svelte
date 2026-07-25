<script lang="ts">
	import type { Snippet } from 'svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import Chip from '$lib/components/atoms/Chip/Chip.svelte';

	export interface FilterChip {
		id: string;
		label: string;
	}

	interface FilterBarProps {
		query?: string;
		filters?: FilterChip[];
		placeholder?: string;
		/** Show search field (default true) */
		searchable?: boolean;
		class?: string;
		actions?: Snippet;
		onquerychange?: (query: string) => void;
		onremovefilter?: (id: string) => void;
		onclear?: () => void;
	}

	let {
		query = $bindable(''),
		filters = $bindable<FilterChip[]>([]),
		placeholder = 'Search…',
		searchable = true,
		class: className = '',
		actions,
		onquerychange,
		onremovefilter,
		onclear
	}: FilterBarProps = $props();

	function remove(id: string) {
		filters = filters.filter((f) => f.id !== id);
		onremovefilter?.(id);
	}

	function clearFilters() {
		filters = [];
		onclear?.();
	}

	function clearAll() {
		filters = [];
		query = '';
		onclear?.();
	}

	const hasFilters = $derived(filters.length > 0);
	const hasQuery = $derived(query.trim().length > 0);
</script>

<div class={['w-full', className]}>
	<div
		class="flex flex-col gap-2 rounded-2xl border border-border bg-surface-elevated p-2 shadow-sm sm:flex-row sm:items-center sm:gap-2"
	>
		{#if searchable}
			<div class="min-w-0 flex-1">
				<Input
					type="text"
					size="sm"
					{placeholder}
					clearable
					bind:value={query}
					oninput={() => onquerychange?.(query)}
					class="[&>div]:border-0 [&>div]:bg-transparent [&>div]:shadow-none [&>div]:ring-0 [&>div]:focus-within:ring-0"
				>
					{#snippet leadIcon()}
						<svg
							class="h-4 w-4"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
							/>
						</svg>
					{/snippet}
				</Input>
			</div>
		{/if}

		{#if searchable && (hasFilters || actions)}
			<div class="mx-0.5 hidden h-6 w-px shrink-0 bg-border sm:block" aria-hidden="true"></div>
		{/if}

		{#if hasFilters || actions}
			<div class="flex min-w-0 flex-wrap items-center gap-1.5 px-1 sm:px-0">
				{#each filters as filter (filter.id)}
					<Chip size="sm" dismissible ondismiss={() => remove(filter.id)}>{filter.label}</Chip>
				{/each}

				{#if hasFilters}
					<button
						type="button"
						class="rounded-lg px-2 py-1 text-xs font-medium text-muted transition-colors hover:bg-surface-overlay hover:text-primary"
						onclick={clearFilters}
					>
						Clear
					</button>
				{/if}

				{#if actions}
					<div class="ml-auto flex items-center gap-1.5 sm:ml-0">
						{@render actions()}
					</div>
				{/if}
			</div>
		{/if}
	</div>

	{#if hasQuery || hasFilters}
		<p class="mt-2 px-1 text-xs text-muted">
			{#if hasQuery}
				Searching for <span class="font-medium text-secondary">“{query.trim()}”</span>
			{/if}
			{#if hasQuery && hasFilters}
				<span class="text-border-strong"> · </span>
			{/if}
			{#if hasFilters}
				{filters.length} filter{filters.length === 1 ? '' : 's'}
			{/if}
			{#if hasQuery && hasFilters}
				<button type="button" class="ml-2 font-medium text-brand-600 hover:underline dark:text-brand-400" onclick={clearAll}>
					Reset all
				</button>
			{/if}
		</p>
	{/if}
</div>
