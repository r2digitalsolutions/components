<script lang="ts">
	import Skeleton from '$lib/components/atoms/Skeleton/Skeleton.svelte';
	import SkeletonText from '$lib/components/atoms/SkeletonText/SkeletonText.svelte';

	export type SkeletonCardLayout =
		| 'article'
		| 'profile'
		| 'list'
		| 'stats'
		| 'product'
		| 'post'
		| 'form';

	interface SkeletonCardProps {
		/**
		 * Preset composition
		 * article — media + title + body + actions
		 * profile — avatar + identity + bio
		 * list — compact row with avatar
		 * stats — metric tiles
		 * product — square media + price row
		 * post — social header + media + footer
		 * form — label/field placeholders
		 */
		layout?: SkeletonCardLayout;
		/** Override media for article/product/post */
		media?: boolean;
		avatar?: boolean;
		actions?: boolean;
		lines?: number;
		/** Media block height */
		mediaHeight?: string;
		animation?: 'pulse' | 'shimmer' | 'none';
		/** Show card chrome (border/surface) */
		chrome?: boolean;
		class?: string;
	}

	const {
		layout = 'article',
		media = true,
		avatar = true,
		actions = true,
		lines = 3,
		mediaHeight = '10rem',
		animation = 'shimmer',
		chrome = true,
		class: className = ''
	}: SkeletonCardProps = $props();

	const showMedia = $derived(
		media && (layout === 'article' || layout === 'product' || layout === 'post')
	);
</script>

<div
	class={[
		'overflow-hidden',
		chrome && 'rounded-2xl border border-border bg-surface-elevated shadow-sm',
		className
	]}
	aria-busy="true"
	aria-live="polite"
	aria-label="Loading"
>
	{#if layout === 'list'}
		<div class="flex items-center gap-3 px-4 py-3">
			{#if avatar}
				<Skeleton variant="circular" width="2.5rem" height="2.5rem" {animation} />
			{/if}
			<div class="min-w-0 flex-1 space-y-2">
				<Skeleton variant="text" width="45%" height="0.75rem" {animation} />
				<Skeleton variant="text" width="70%" height="0.625rem" {animation} />
			</div>
			{#if actions}
				<Skeleton variant="rounded" width="4rem" height="1.75rem" {animation} />
			{/if}
		</div>
	{:else if layout === 'profile'}
		<div class="space-y-4 p-5">
			<div class="flex items-center gap-3">
				{#if avatar}
					<Skeleton variant="circular" width="3.5rem" height="3.5rem" {animation} />
				{/if}
				<div class="min-w-0 flex-1 space-y-2">
					<Skeleton variant="text" width="40%" height="0.875rem" {animation} />
					<Skeleton variant="text" width="55%" height="0.625rem" {animation} />
				</div>
			</div>
			<SkeletonText {lines} />
			{#if actions}
				<div class="flex gap-2 pt-1">
					<Skeleton variant="rounded" width="5.5rem" height="2rem" {animation} />
					<Skeleton variant="rounded" width="5.5rem" height="2rem" {animation} />
				</div>
			{/if}
		</div>
	{:else if layout === 'stats'}
		<div class="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">
			{#each [0, 1, 2] as i}
				<div class="space-y-2 rounded-xl border border-border/70 bg-surface/50 p-3">
					<Skeleton variant="text" width="50%" height="0.625rem" {animation} />
					<Skeleton variant="text" width="70%" height="1.25rem" {animation} />
					{#if i < 2}
						<Skeleton variant="text" width="40%" height="0.5rem" {animation} />
					{/if}
				</div>
			{/each}
		</div>
	{:else if layout === 'product'}
		{#if showMedia}
			<div class="relative">
				<Skeleton
					variant="rectangular"
					height={mediaHeight}
					{animation}
					class="rounded-none"
				/>
			</div>
		{/if}
		<div class="space-y-3 p-4">
			<Skeleton variant="text" width="75%" height="0.875rem" {animation} />
			<Skeleton variant="text" width="40%" height="0.625rem" {animation} />
			<div class="flex items-center justify-between gap-3 pt-1">
				<Skeleton variant="text" width="4rem" height="1.125rem" {animation} />
				{#if actions}
					<Skeleton variant="rounded" width="2.25rem" height="2.25rem" {animation} />
				{/if}
			</div>
		</div>
	{:else if layout === 'post'}
		<div class="flex items-center gap-3 px-4 py-3">
			{#if avatar}
				<Skeleton variant="circular" width="2.25rem" height="2.25rem" {animation} />
			{/if}
			<div class="min-w-0 flex-1 space-y-1.5">
				<Skeleton variant="text" width="35%" height="0.75rem" {animation} />
				<Skeleton variant="text" width="25%" height="0.5rem" {animation} />
			</div>
			<Skeleton variant="circular" width="1.25rem" height="1.25rem" {animation} />
		</div>
		{#if showMedia}
			<Skeleton variant="rectangular" height={mediaHeight} {animation} class="rounded-none" />
		{/if}
		<div class="space-y-3 px-4 py-3">
			{#if actions}
				<div class="flex gap-4">
					<Skeleton variant="rounded" width="1.25rem" height="1.25rem" {animation} />
					<Skeleton variant="rounded" width="1.25rem" height="1.25rem" {animation} />
					<Skeleton variant="rounded" width="1.25rem" height="1.25rem" {animation} />
				</div>
			{/if}
			<SkeletonText lines={Math.min(lines, 2)} />
		</div>
	{:else if layout === 'form'}
		<div class="space-y-4 p-5">
			{#each Array.from({ length: Math.max(lines, 2) }, (_, i) => i) as i}
				<div class="space-y-2">
					<Skeleton variant="text" width="30%" height="0.625rem" {animation} />
					<Skeleton variant="rounded" width="100%" height="2.5rem" {animation} />
				</div>
			{/each}
			{#if actions}
				<div class="flex justify-end gap-2 pt-2">
					<Skeleton variant="rounded" width="5rem" height="2.25rem" {animation} />
					<Skeleton variant="rounded" width="6rem" height="2.25rem" {animation} />
				</div>
			{/if}
		</div>
	{:else}
		<!-- article (default) -->
		{#if showMedia}
			<Skeleton variant="rectangular" height={mediaHeight} {animation} class="rounded-none" />
		{/if}
		<div class="space-y-3 p-4 sm:p-5">
			{#if avatar}
				<div class="mb-1 flex items-center gap-2.5">
					<Skeleton variant="circular" width="1.75rem" height="1.75rem" {animation} />
					<Skeleton variant="text" width="30%" height="0.625rem" {animation} />
				</div>
			{/if}
			<Skeleton variant="text" width="55%" height="1rem" {animation} />
			<SkeletonText {lines} />
			{#if actions}
				<div class="flex gap-2 pt-1">
					<Skeleton variant="rounded" width="5rem" height="2rem" {animation} />
					<Skeleton variant="rounded" width="5rem" height="2rem" {animation} />
				</div>
			{/if}
		</div>
	{/if}
</div>
