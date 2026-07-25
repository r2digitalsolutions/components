<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';

	export interface PricingPlan {
		id: string;
		name: string;
		price: string;
		period?: string;
		description?: string;
		features: string[];
		cta?: string;
		featured?: boolean;
	}

	interface PricingTableProps {
		plans?: PricingPlan[];
		class?: string;
		onselect?: (id: string) => void;
	}

	let {
		plans = [],
		class: className = '',
		onselect
	}: PricingTableProps = $props();
</script>

<div class={['grid w-full gap-4 md:grid-cols-3', className]}>
	{#each plans as plan (plan.id)}
		<div
			class={[
				'flex flex-col rounded-2xl border p-5',
				plan.featured
					? 'border-brand-500 bg-brand-50/50 shadow-lg dark:bg-brand-950/20'
					: 'border-border bg-surface-elevated'
			]}
		>
			<div class="mb-4 flex items-start justify-between gap-2">
				<div>
					<p class="text-sm font-semibold text-primary">{plan.name}</p>
					{#if plan.description}
						<p class="mt-1 text-xs text-secondary">{plan.description}</p>
					{/if}
				</div>
				{#if plan.featured}
					<Badge variant="primary">Popular</Badge>
				{/if}
			</div>

			<p class="mb-4">
				<span class="text-3xl font-semibold text-primary">{plan.price}</span>
				{#if plan.period}
					<span class="text-sm text-muted">/{plan.period}</span>
				{/if}
			</p>

			<ul class="mb-6 flex-1 space-y-2">
				{#each plan.features as feature}
					<li class="flex items-start gap-2 text-sm text-secondary">
						<span class="mt-0.5 text-brand-600 dark:text-brand-400">✓</span>
						{feature}
					</li>
				{/each}
			</ul>

			<Button
				variant={plan.featured ? 'primary' : 'secondary'}
				fullWidth
				onclick={() => onselect?.(plan.id)}
			>
				{plan.cta ?? 'Get started'}
			</Button>
		</div>
	{/each}
</div>
