<script module lang="ts">
	export type InfiniteScrollMode = 'auto' | 'manual' | 'both';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import Spinner from '$lib/components/atoms/Spinner/Spinner.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	interface InfiniteScrollProps {
		loading?: boolean;
		hasMore?: boolean;
		disabled?: boolean;
		error?: string | null;
		/** IntersectionObserver root margin */
		rootMargin?: string;
		/** IntersectionObserver threshold 0–1 */
		threshold?: number;
		/**
		 * Scroll container for the observer. Defaults to viewport.
		 * Pass the element that actually scrolls (e.g. a max-height list).
		 */
		scrollRoot?: HTMLElement | null;
		/** How to trigger the next page */
		mode?: InfiniteScrollMode;
		/** Where the load sentinel sits relative to children */
		sentinel?: 'end' | 'start';
		endMessage?: string;
		loadMoreLabel?: string;
		retryLabel?: string;
		class?: string;
		children?: Snippet;
		/** Replaces default spinner */
		loader?: Snippet;
		/** Replaces default end message */
		end?: Snippet;
		/** Replaces default error + retry */
		errorSnippet?: Snippet;
		onloadmore?: () => void | Promise<void>;
		onretry?: () => void;
	}

	const {
		loading = false,
		hasMore = true,
		disabled = false,
		error = null,
		rootMargin = '240px',
		threshold = 0,
		scrollRoot = null,
		mode = 'auto',
		sentinel: sentinelPos = 'end',
		endMessage = "You're all caught up",
		loadMoreLabel = 'Load more',
		retryLabel = 'Try again',
		class: className = '',
		children,
		loader,
		end,
		errorSnippet,
		onloadmore,
		onretry
	}: InfiniteScrollProps = $props();

	let sentinel = $state<HTMLDivElement | null>(null);
	let locked = $state(false);

	const canAutoLoad = $derived(
		(mode === 'auto' || mode === 'both') && !disabled && !loading && !error && hasMore && !locked
	);

	const showManual = $derived(
		(mode === 'manual' || mode === 'both') && hasMore && !disabled && !error && !loading && !locked
	);

	async function requestMore() {
		if (disabled || loading || !hasMore || locked || error) return;
		locked = true;
		try {
			await onloadmore?.();
		} finally {
			locked = false;
		}
	}

	function retry() {
		if (loading) return;
		void (onretry?.() ?? requestMore());
	}

	$effect(() => {
		if (!sentinel || !canAutoLoad) return;

		const el = sentinel;
		const obs = new IntersectionObserver(
			(entries) => {
				if (entries.some((e) => e.isIntersecting)) void requestMore();
			},
			{
				root: scrollRoot ?? null,
				rootMargin,
				threshold
			}
		);
		obs.observe(el);
		return () => obs.disconnect();
	});
</script>

<div class={['w-full', className]} aria-busy={loading}>
	{#if sentinelPos === 'start'}
		{@render footer()}
	{/if}

	{#if children}
		{@render children()}
	{/if}

	{#if sentinelPos === 'end'}
		{@render footer()}
	{/if}
</div>

{#snippet footer()}
	<div
		bind:this={sentinel}
		class="gap-2 py-4 flex flex-col items-center justify-center"
		aria-live="polite"
	>
		{#if error}
			{#if errorSnippet}
				{@render errorSnippet()}
			{:else}
				<div class="gap-2 px-3 flex flex-col items-center text-center">
					<p class="text-xs text-red-600 dark:text-red-400">{error}</p>
					<Button size="sm" variant="secondary" onclick={retry} disabled={loading}>
						{retryLabel}
					</Button>
				</div>
			{/if}
		{:else if loading}
			{#if loader}
				{@render loader()}
			{:else}
				<div class="gap-2 text-muted flex items-center">
					<Spinner size="sm" />
					<span class="text-xs">Loading…</span>
				</div>
			{/if}
		{:else if !hasMore}
			{#if end}
				{@render end()}
			{:else}
				<Text size="xs" tone="muted">{endMessage}</Text>
			{/if}
		{:else if showManual}
			<Button
				size="sm"
				variant={mode === 'manual' ? 'secondary' : 'ghost'}
				onclick={() => void requestMore()}
				disabled={loading}
			>
				{loadMoreLabel}
			</Button>
		{/if}
	</div>
{/snippet}
