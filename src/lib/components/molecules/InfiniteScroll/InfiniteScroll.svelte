<script lang="ts">
	import type { Snippet } from 'svelte';
	import Spinner from '$lib/components/atoms/Spinner/Spinner.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	interface InfiniteScrollProps {
		loading?: boolean;
		hasMore?: boolean;
		disabled?: boolean;
		/** Root margin for IntersectionObserver */
		rootMargin?: string;
		class?: string;
		children?: Snippet;
		onloadmore?: () => void;
	}

	const {
		loading = false,
		hasMore = true,
		disabled = false,
		rootMargin = '200px',
		class: className = '',
		children,
		onloadmore
	}: InfiniteScrollProps = $props();

	let sentinel = $state<HTMLDivElement | null>(null);

	$effect(() => {
		if (!sentinel || disabled || !hasMore || loading) return;
		const el = sentinel;
		const obs = new IntersectionObserver(
			(entries) => {
				if (entries.some((e) => e.isIntersecting)) onloadmore?.();
			},
			{ rootMargin }
		);
		obs.observe(el);
		return () => obs.disconnect();
	});
</script>

<div class={['w-full', className]}>
	{#if children}
		{@render children()}
	{/if}

	<div bind:this={sentinel} class="flex justify-center py-4" aria-hidden={!loading}>
		{#if loading}
			<Spinner size="sm" />
		{:else if !hasMore}
			<Text size="xs" tone="muted">You're all caught up</Text>
		{/if}
	</div>
</div>
