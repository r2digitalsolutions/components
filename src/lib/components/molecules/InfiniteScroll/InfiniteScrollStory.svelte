<script lang="ts">
	import InfiniteScroll, { type InfiniteScrollMode } from './InfiniteScroll.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';
	import Skeleton from '$lib/components/atoms/Skeleton/Skeleton.svelte';

	type Example = 'list' | 'feed' | 'grid' | 'manual' | 'both' | 'error' | 'chat' | 'ended';

	let props = $props<{
		example?: Example;
		mode?: InfiniteScrollMode;
		rootMargin?: string;
		pageSize?: number;
		maxItems?: number;
		delayMs?: number;
	}>();

	const example = $derived(props.example ?? 'list');
	const pageSize = $derived(props.pageSize ?? 6);
	const maxItems = $derived(props.maxItems ?? 28);
	const delayMs = $derived(props.delayMs ?? 650);

	let scrollEl = $state<HTMLDivElement | null>(null);
	let items = $state<number[]>([]);
	let loading = $state(false);
	let hasMore = $state(true);
	let error = $state<string | null>(null);
	let failOnce = $state(true);
	let pages = $state(0);

	function reset() {
		items =
			example === 'ended'
				? Array.from({ length: 8 }, (_, i) => i + 1)
				: Array.from({ length: example === 'chat' ? 10 : 8 }, (_, i) => i + 1);
		loading = false;
		hasMore = example !== 'ended';
		error = null;
		failOnce = true;
		pages = 0;
	}

	$effect(() => {
		// Reset whenever example / limits change
		void example;
		void pageSize;
		void maxItems;
		reset();
	});

	function loadMore() {
		if (loading || !hasMore) return;
		loading = true;
		error = null;

		setTimeout(() => {
			if (example === 'error' && failOnce && pages === 0) {
				failOnce = false;
				loading = false;
				error = 'Could not load more items. Check your connection.';
				return;
			}

			pages += 1;
			const start = items.length + 1;
			const next = Array.from({ length: pageSize }, (_, i) => start + i);
			items = example === 'chat' ? [...next.reverse(), ...items] : [...items, ...next];
			loading = false;
			if (items.length >= maxItems) hasMore = false;
		}, delayMs);
	}

	function retry() {
		error = null;
		loadMore();
	}

	const mode = $derived(
		props.mode ??
			(example === 'manual' ? 'manual' : example === 'both' ? 'both' : 'auto')
	);

	const names = [
		'Ada',
		'Grace',
		'Alan',
		'Katherine',
		'Linus',
		'Margaret',
		'Tim',
		'Radia'
	];
</script>

<div class="w-full max-w-md space-y-2">
	<p class="text-xs text-secondary">
		Loaded <span class="font-medium text-primary">{items.length}</span>
		· hasMore: {hasMore ? 'yes' : 'no'}
		· {loading ? 'loading' : error ? 'error' : 'idle'}
	</p>

	{#if example === 'feed'}
		<div
			bind:this={scrollEl}
			class="max-h-80 overflow-y-auto rounded-xl border border-border bg-surface"
		>
			<InfiniteScroll
				{loading}
				{hasMore}
				{mode}
				scrollRoot={scrollEl}
				rootMargin={props.rootMargin ?? '160px'}
				onloadmore={loadMore}
			>
				<div class="space-y-3 p-3">
					{#each items as n (n)}
						<article class="rounded-xl border border-border bg-surface-elevated p-3 shadow-sm">
							<div class="mb-2 flex items-center gap-2">
								<div
									class="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/15 text-[11px] font-semibold text-brand-700 dark:text-brand-300"
								>
									{names[n % names.length].slice(0, 1)}
								</div>
								<div class="min-w-0">
									<p class="truncate text-sm font-medium text-primary">
										{names[n % names.length]} · update #{n}
									</p>
									<p class="text-[11px] text-muted">Just now</p>
								</div>
							</div>
							<p class="text-xs text-secondary">
								Shipped a small improvement to the design system. Feedback welcome.
							</p>
						</article>
					{/each}
				</div>
			</InfiniteScroll>
		</div>
	{:else if example === 'grid'}
		<div
			bind:this={scrollEl}
			class="max-h-80 overflow-y-auto rounded-xl border border-border p-3"
		>
			<InfiniteScroll
				{loading}
				{hasMore}
				{mode}
				scrollRoot={scrollEl}
				rootMargin={props.rootMargin ?? '200px'}
				onloadmore={loadMore}
			>
				<div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
					{#each items as n (n)}
						<div
							class="aspect-square rounded-xl border border-border bg-surface-elevated p-2"
						>
							<div
								class="flex h-full items-center justify-center rounded-lg bg-brand-500/10 text-sm font-semibold text-brand-700 dark:text-brand-300"
							>
								#{n}
							</div>
						</div>
					{/each}
				</div>
			</InfiniteScroll>
		</div>
	{:else if example === 'chat'}
		<div
			bind:this={scrollEl}
			class="flex max-h-80 flex-col overflow-y-auto rounded-xl border border-border bg-surface"
		>
			<InfiniteScroll
				{loading}
				{hasMore}
				mode="both"
				sentinel="start"
				scrollRoot={scrollEl}
				rootMargin={props.rootMargin ?? '120px'}
				loadMoreLabel="Load earlier messages"
				endMessage="Beginning of conversation"
				onloadmore={loadMore}
			>
				<div class="flex flex-col gap-2 p-3">
					{#each items as n (n)}
						<div
							class={[
								'max-w-[85%] rounded-2xl px-3 py-2 text-xs',
								n % 2 === 0
									? 'self-start bg-surface-overlay text-primary'
									: 'self-end bg-brand-500 text-white'
							]}
						>
							Message {n}
						</div>
					{/each}
				</div>
			</InfiniteScroll>
		</div>
	{:else if example === 'error'}
		<div
			bind:this={scrollEl}
			class="max-h-72 overflow-y-auto rounded-xl border border-border"
		>
			<InfiniteScroll
				{loading}
				{hasMore}
				{error}
				mode="auto"
				scrollRoot={scrollEl}
				onloadmore={loadMore}
				onretry={retry}
			>
				<ul class="divide-y divide-border">
					{#each items as n (n)}
						<li class="px-3 py-2.5">
							<Text size="sm">Item {n}</Text>
						</li>
					{/each}
				</ul>
			</InfiniteScroll>
		</div>
	{:else if example === 'ended'}
		<div class="max-h-56 overflow-y-auto rounded-xl border border-border">
			<InfiniteScroll loading={false} hasMore={false} endMessage="No more notifications">
				<ul class="divide-y divide-border">
					{#each items as n (n)}
						<li class="px-3 py-2.5">
							<Text size="sm">Notification {n}</Text>
						</li>
					{/each}
				</ul>
			</InfiniteScroll>
		</div>
	{:else}
		<!-- list / manual / both -->
		<div
			bind:this={scrollEl}
			class="max-h-72 overflow-y-auto rounded-xl border border-border"
		>
			<InfiniteScroll
				{loading}
				{hasMore}
				{mode}
				scrollRoot={scrollEl}
				rootMargin={props.rootMargin ?? '200px'}
				loadMoreLabel={mode === 'both' ? 'Load more' : 'Load more items'}
				onloadmore={loadMore}
			>
				{#snippet loader()}
					<div class="flex w-full flex-col gap-2 px-3">
						{#each [1, 2, 3] as _}
							<Skeleton class="h-9 w-full rounded-lg" />
						{/each}
					</div>
				{/snippet}

				<ul class="divide-y divide-border">
					{#each items as n (n)}
						<li class="flex items-center gap-3 px-3 py-2.5">
							<div
								class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-overlay text-[11px] font-semibold text-secondary"
							>
								{n}
							</div>
							<div class="min-w-0">
								<p class="truncate text-sm font-medium text-primary">Row item {n}</p>
								<p class="truncate text-[11px] text-muted">Scroll to load the next page</p>
							</div>
						</li>
					{/each}
				</ul>
			</InfiniteScroll>
		</div>
	{/if}
</div>
