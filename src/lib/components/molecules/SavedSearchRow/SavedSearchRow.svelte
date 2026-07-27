<script lang="ts">
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import CountBadge from '$lib/components/atoms/CountBadge/CountBadge.svelte';

	interface SavedSearchRowProps {
		name: string;
		query?: string;
		count?: number;
		pinned?: boolean;
		class?: string;
		onselect?: () => void;
		onpin?: (pinned: boolean) => void;
		ondelete?: () => void;
	}

	let {
		name,
		query = '',
		count,
		pinned = $bindable(false),
		class: className = '',
		onselect,
		onpin,
		ondelete
	}: SavedSearchRowProps = $props();

	function togglePin(e: MouseEvent) {
		e.stopPropagation();
		pinned = !pinned;
		onpin?.(pinned);
	}

	function handleDelete(e: MouseEvent) {
		e.stopPropagation();
		ondelete?.();
	}
</script>

<button
	type="button"
	class={[
		'group flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
		pinned
			? 'border-brand-500/25 bg-brand-50/60 dark:bg-brand-950/30'
			: 'border-border bg-surface-elevated hover:bg-surface-overlay',
		className
	]}
	onclick={() => onselect?.()}
>
	<span
		class={[
			'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
			pinned
				? 'bg-brand-500/15 text-brand-600 dark:text-brand-400'
				: 'bg-surface-overlay text-muted'
		]}
		aria-hidden="true"
	>
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4">
			<circle cx="11" cy="11" r="7" />
			<path stroke-linecap="round" d="M16 16l4 4" />
		</svg>
	</span>

	<span class="min-w-0 flex-1">
		<span class="flex items-center gap-2">
			<span class="truncate text-sm font-medium text-primary">{name}</span>
			{#if pinned}
				<Badge size="sm" variant="secondary">Pinned</Badge>
			{/if}
		</span>
		{#if query}
			<span class="mt-0.5 block truncate font-mono text-xs text-muted">{query}</span>
		{/if}
	</span>

	{#if count != null}
		<CountBadge count={count} class="shrink-0" />
	{/if}

	<span class="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
		{#if onpin}
			<IconButton
				label={pinned ? 'Unpin search' : 'Pin search'}
				size="sm"
				variant="ghost"
				onclick={togglePin}
			>
				<svg
					viewBox="0 0 24 24"
					fill={pinned ? 'currentColor' : 'none'}
					stroke="currentColor"
					stroke-width="2"
					class="h-4 w-4"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 2l2.4 7.4H22l-6 4.6 2.3 7L12 17.8 5.7 21l2.3-7-6-4.6h7.6L12 2z"
					/>
				</svg>
			</IconButton>
		{/if}
		{#if ondelete}
			<IconButton label="Delete search" size="sm" variant="ghost" onclick={handleDelete}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</IconButton>
		{/if}
	</span>
</button>
