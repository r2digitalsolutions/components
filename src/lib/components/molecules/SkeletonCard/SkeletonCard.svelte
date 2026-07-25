<script lang="ts">
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import Skeleton from '$lib/components/atoms/Skeleton/Skeleton.svelte';
	import SkeletonText from '$lib/components/atoms/SkeletonText/SkeletonText.svelte';

	interface SkeletonCardProps {
		/** Show media placeholder on top */
		media?: boolean;
		lines?: number;
		class?: string;
	}

	const { media = true, lines = 3, class: className = '' }: SkeletonCardProps = $props();
</script>

<div aria-busy="true" aria-live="polite">
	<Card padding="none" class={className} chrome={false}>
		{#if media}
			<Skeleton variant="rectangular" height="10rem" animation="shimmer" class="rounded-none" />
		{/if}
		<div class="space-y-3 p-4 sm:p-5">
			<Skeleton variant="text" width="40%" height="0.875rem" animation="shimmer" />
			<SkeletonText {lines} />
			<div class="flex gap-2 pt-1">
				<Skeleton variant="rounded" width="5rem" height="2rem" animation="shimmer" />
				<Skeleton variant="rounded" width="5rem" height="2rem" animation="shimmer" />
			</div>
		</div>
	</Card>
</div>
