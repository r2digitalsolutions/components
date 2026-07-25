<script lang="ts">
	import Image from '$lib/components/atoms/Image/Image.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import PriceTag from '$lib/components/molecules/PriceTag/PriceTag.svelte';
	import Rating from '$lib/components/atoms/Rating/Rating.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	interface ProductCardProps {
		title: string;
		subtitle?: string;
		image?: string;
		price: number | string;
		compareAt?: number | string;
		currency?: string;
		badge?: string;
		rating?: number;
		reviews?: number;
		href?: string;
		class?: string;
		onadd?: () => void;
	}

	const {
		title,
		subtitle,
		image,
		price,
		compareAt,
		currency = 'EUR',
		badge,
		rating,
		reviews,
		href,
		class: className = '',
		onadd
	}: ProductCardProps = $props();
</script>

<article
	class={[
		'overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm transition-shadow hover:shadow-md',
		className
	]}
>
	<a
		{href}
		class="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
		onclick={(e) => {
			if (!href) e.preventDefault();
		}}
	>
		<div class="relative aspect-[4/3] bg-surface-overlay">
			{#if image}
				<Image src={image} alt={title} class="h-full w-full object-cover" />
			{:else}
				<div class="flex h-full items-center justify-center text-xs text-muted">No image</div>
			{/if}
			{#if badge}
				<div class="absolute left-2 top-2">
					<Badge variant="primary" size="sm" rounded>{badge}</Badge>
				</div>
			{/if}
		</div>
		<div class="space-y-2 p-3">
			<div>
				<h3 class="line-clamp-2 text-sm font-semibold text-primary">{title}</h3>
				{#if subtitle}
					<p class="mt-0.5 line-clamp-1 text-xs text-muted">{subtitle}</p>
				{/if}
			</div>
			{#if rating !== undefined}
				<div class="flex items-center gap-1.5">
					<Rating value={rating} size="sm" readonly />
					{#if reviews !== undefined}
						<span class="text-[11px] text-muted">({reviews})</span>
					{/if}
				</div>
			{/if}
			<div class="flex items-end justify-between gap-2">
				<PriceTag amount={price} {compareAt} {currency} size="sm" />
				{#if onadd}
					<Button
						size="xs"
						onclick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							onadd();
						}}
					>
						Add
					</Button>
				{/if}
			</div>
		</div>
	</a>
</article>
