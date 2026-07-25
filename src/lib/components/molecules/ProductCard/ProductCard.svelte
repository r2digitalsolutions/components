<script lang="ts">
	import Image from '$lib/components/atoms/Image/Image.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import PriceTag from '$lib/components/molecules/PriceTag/PriceTag.svelte';
	import Rating from '$lib/components/atoms/Rating/Rating.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Heart from '@lucide/svelte/icons/heart';
	import ShoppingBag from '@lucide/svelte/icons/shopping-bag';
	import Plus from '@lucide/svelte/icons/plus';

	export type ProductCardVariant = 'vertical' | 'horizontal' | 'compact';
	export type ProductCardBadgeTone = 'primary' | 'success' | 'warning' | 'error' | 'info';

	interface ProductCardProps {
		title: string;
		subtitle?: string;
		brand?: string;
		image?: string;
		price: number | string;
		compareAt?: number | string;
		currency?: string;
		badge?: string;
		badgeTone?: ProductCardBadgeTone;
		rating?: number;
		reviews?: number;
		href?: string;
		variant?: ProductCardVariant;
		/** Show wishlist / favourite control */
		wishlist?: boolean;
		wishlisted?: boolean;
		soldOut?: boolean;
		addLabel?: string;
		showAddIcon?: boolean;
		class?: string;
		onadd?: () => void;
		onwishlist?: (wishlisted: boolean) => void;
		onclick?: () => void;
	}

	let {
		title,
		subtitle,
		brand,
		image,
		price,
		compareAt,
		currency = 'EUR',
		badge,
		badgeTone = 'primary',
		rating,
		reviews,
		href,
		variant = 'vertical',
		wishlist = false,
		wishlisted = $bindable(false),
		soldOut = false,
		addLabel = 'Add',
		showAddIcon = false,
		class: className = '',
		onadd,
		onwishlist,
		onclick
	}: ProductCardProps = $props();

	const discount = $derived.by(() => {
		if (typeof price !== 'number' || typeof compareAt !== 'number' || compareAt <= price) return null;
		return Math.round(((compareAt - price) / compareAt) * 100);
	});

	const resolvedBadge = $derived(badge ?? (discount ? `-${discount}%` : undefined));
	const resolvedBadgeTone = $derived(badge ? badgeTone : discount ? 'error' : badgeTone);

	function toggleWish(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		wishlisted = !wishlisted;
		onwishlist?.(wishlisted);
	}

	function handleAdd(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		if (soldOut) return;
		onadd?.();
	}

	function handleCardClick(e: MouseEvent) {
		if (!href) e.preventDefault();
		onclick?.();
	}
</script>

{#snippet media()}
	<div
		class={[
			'relative overflow-hidden bg-surface-overlay',
			variant === 'horizontal' ? 'aspect-square w-28 shrink-0 sm:w-32' : 'aspect-[4/3] w-full',
			variant === 'compact' && 'aspect-square'
		]}
	>
		{#if image}
			<Image
				src={image}
				alt={title}
				class={`h-full w-full object-cover transition-transform duration-300${!soldOut ? ' group-hover:scale-[1.03]' : ''}`}
			/>
		{:else}
			<div
				class="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-surface-overlay to-surface-elevated text-muted"
				aria-hidden="true"
			>
				<svg class="h-10 w-10 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
					/>
				</svg>
			</div>
		{/if}

		{#if soldOut}
			<div class="absolute inset-0 flex items-center justify-center bg-surface-elevated/55 backdrop-blur-[1px]">
				<span
					class="rounded-full border border-border bg-surface-elevated px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-secondary"
				>
					Sold out
				</span>
			</div>
		{/if}

		{#if resolvedBadge && !soldOut}
			<div class="absolute left-2 top-2">
				<Badge variant={resolvedBadgeTone} size="sm" rounded>{resolvedBadge}</Badge>
			</div>
		{/if}

		{#if wishlist}
			<button
				type="button"
				class={[
					'absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full border shadow-sm transition-colors',
					wishlisted
						? 'border-rose-500/30 bg-rose-500 text-white'
						: 'border-border/80 bg-surface-elevated/90 text-muted backdrop-blur hover:text-rose-500'
				]}
				aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
				aria-pressed={wishlisted}
				onclick={toggleWish}
			>
				<Heart class="h-4 w-4" fill={wishlisted ? 'currentColor' : 'none'} aria-hidden="true" />
			</button>
		{/if}
	</div>
{/snippet}

{#snippet body()}
	<div class={['flex min-w-0 flex-1 flex-col', variant === 'compact' ? 'gap-1.5 p-2.5' : 'gap-2 p-3']}>
		<div class="min-w-0">
			{#if brand}
				<p class="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">{brand}</p>
			{/if}
			<h3
				class={[
					'font-semibold text-primary',
					variant === 'compact' ? 'line-clamp-1 text-xs' : 'line-clamp-2 text-sm'
				]}
			>
				{title}
			</h3>
			{#if subtitle && variant !== 'compact'}
				<p class="mt-0.5 line-clamp-1 text-xs text-muted">{subtitle}</p>
			{/if}
		</div>

		{#if rating !== undefined}
			<div class="flex items-center gap-1.5">
				<Rating value={rating} size="sm" readonly />
				{#if reviews !== undefined}
					<span class="text-[11px] tabular-nums text-muted">({reviews})</span>
				{/if}
			</div>
		{/if}

		<div class={['mt-auto flex items-end gap-2', variant === 'horizontal' ? 'justify-between' : 'justify-between']}>
			<PriceTag
				amount={price}
				{compareAt}
				{currency}
				size={variant === 'compact' ? 'sm' : 'sm'}
				class={variant === 'compact' ? '[&_span:first-child]:text-sm' : ''}
			/>
			{#if onadd}
				<Button
					size="xs"
					variant={soldOut ? 'secondary' : 'primary'}
					disabled={soldOut}
					onclick={handleAdd}
					aria-label={addLabel}
				>
					{#if showAddIcon}
						{#if soldOut}
							—
						{:else}
							<Plus class="h-3.5 w-3.5" aria-hidden="true" />
						{/if}
					{:else if soldOut}
						Sold out
					{:else}
						<span class="inline-flex items-center gap-1">
							<ShoppingBag class="h-3.5 w-3.5" aria-hidden="true" />
							{addLabel}
						</span>
					{/if}
				</Button>
			{/if}
		</div>
	</div>
{/snippet}

<article
	class={[
		'group overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm transition-shadow hover:shadow-md',
		variant === 'horizontal' && 'flex',
		soldOut && 'opacity-90',
		className
	]}
>
	<a
		{href}
		class={[
			'block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
			variant === 'horizontal' && 'flex w-full min-w-0'
		]}
		onclick={handleCardClick}
	>
		{@render media()}
		{@render body()}
	</a>
</article>
