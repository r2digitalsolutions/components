<script lang="ts">
	import SkeletonCard from './SkeletonCard.svelte';
	import type { SkeletonCardLayout } from './SkeletonCard.svelte';

	let {
		example = 'gallery',
		layout = 'article',
		media = true,
		avatar = true,
		actions = true,
		lines = 3,
		animation = 'shimmer'
	}: {
		example?: 'gallery' | 'grid' | 'single' | 'feed';
		layout?: SkeletonCardLayout;
		media?: boolean;
		avatar?: boolean;
		actions?: boolean;
		lines?: number;
		animation?: 'pulse' | 'shimmer' | 'none';
	} = $props();

	const layouts: { id: SkeletonCardLayout; label: string }[] = [
		{ id: 'article', label: 'Article' },
		{ id: 'profile', label: 'Profile' },
		{ id: 'list', label: 'List row' },
		{ id: 'stats', label: 'Stats' },
		{ id: 'product', label: 'Product' },
		{ id: 'post', label: 'Post' },
		{ id: 'form', label: 'Form' }
	];
</script>

<div class="w-full max-w-4xl space-y-3">
	<div class="space-y-1">
		<p class="text-sm font-semibold text-primary">Skeleton card</p>
		<p class="text-xs text-secondary">
			Placeholders tipados: article, profile, list, stats, product, post y form.
		</p>
	</div>

	{#if example === 'single'}
		<div class="max-w-sm">
			<SkeletonCard {layout} {media} {avatar} {actions} {lines} {animation} />
		</div>
	{:else if example === 'grid'}
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each [0, 1, 2, 3, 4, 5] as _}
				<SkeletonCard layout="product" mediaHeight="8rem" {animation} />
			{/each}
		</div>
	{:else if example === 'feed'}
		<div class="mx-auto max-w-md space-y-3">
			{#each [0, 1, 2] as _}
				<SkeletonCard layout="post" mediaHeight="12rem" {animation} />
			{/each}
		</div>
	{:else}
		<div class="grid gap-4 sm:grid-cols-2">
			{#each layouts as item}
				<div class="space-y-2">
					<p class="text-[11px] font-semibold uppercase tracking-wide text-muted">{item.label}</p>
					<SkeletonCard
						layout={item.id}
						{animation}
						mediaHeight={item.id === 'product' ? '9rem' : '10rem'}
						lines={item.id === 'form' ? 3 : 3}
					/>
				</div>
			{/each}
		</div>
	{/if}
</div>
