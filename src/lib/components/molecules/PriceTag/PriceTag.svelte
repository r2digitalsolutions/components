<script lang="ts">
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';

	interface PriceTagProps {
		amount: number | string;
		currency?: string;
		period?: string;
		compareAt?: number | string;
		badge?: string;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	}

	const {
		amount,
		currency = 'USD',
		period,
		compareAt,
		badge,
		size = 'md',
		class: className = ''
	}: PriceTagProps = $props();

	const sizes = {
		sm: { price: 'text-lg', period: 'text-xs' },
		md: { price: 'text-2xl', period: 'text-sm' },
		lg: { price: 'text-3xl', period: 'text-base' }
	} as const;

	const formatted = $derived(
		typeof amount === 'number'
			? new Intl.NumberFormat('en', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
			: amount
	);

	const compare = $derived(
		typeof compareAt === 'number'
			? new Intl.NumberFormat('en', { style: 'currency', currency, maximumFractionDigits: 0 }).format(compareAt)
			: compareAt
	);
</script>

<div class={['inline-flex flex-wrap items-baseline gap-2', className]}>
	<span class={['font-semibold tracking-tight text-primary', sizes[size].price]}>{formatted}</span>
	{#if period}
		<span class={['text-muted', sizes[size].period]}>{period}</span>
	{/if}
	{#if compare}
		<span class={['text-muted line-through', sizes[size].period]}>{compare}</span>
	{/if}
	{#if badge}
		<Badge size="sm" variant="success">{badge}</Badge>
	{/if}
</div>
