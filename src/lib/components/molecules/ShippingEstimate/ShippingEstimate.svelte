<script lang="ts">
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Truck from '@lucide/svelte/icons/truck';
	import Check from '@lucide/svelte/icons/check';

	export interface ShippingOption {
		id: string;
		label: string;
		eta: string;
		price: string | number;
		currency?: string;
	}

	interface ShippingEstimateProps {
		options: ShippingOption[];
		selected?: string;
		class?: string;
		onchange?: (id: string) => void;
	}

	let {
		options,
		selected = $bindable(''),
		class: className = '',
		onchange
	}: ShippingEstimateProps = $props();

	function formatPrice(price: string | number, currency = 'USD') {
		if (typeof price === 'string') return price;
		if (price === 0) return 'Free';
		return new Intl.NumberFormat('en', { style: 'currency', currency }).format(price);
	}

	function select(id: string) {
		selected = id;
		onchange?.(id);
	}
</script>

<ul class={['w-full space-y-2', className]} role="radiogroup" aria-label="Shipping options">
	{#each options as option (option.id)}
		<li>
			<button
				type="button"
				role="radio"
				aria-checked={selected === option.id}
				onclick={() => select(option.id)}
				class={[
					'flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors',
					selected === option.id
						? 'border-brand-500/50 bg-brand-50/50 ring-1 ring-brand-500/15 dark:bg-brand-950/20'
						: 'border-border bg-surface-elevated hover:border-border-strong'
				]}
			>
				<span
					class={[
						'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
						selected === option.id
							? 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
							: 'bg-surface-overlay text-secondary'
					]}
				>
					{#if selected === option.id}
						<Check class="h-4 w-4" strokeWidth={2.5} />
					{:else}
						<Truck class="h-4 w-4" strokeWidth={2} />
					{/if}
				</span>

				<div class="min-w-0 flex-1 space-y-0.5">
					<p class="text-sm font-semibold text-primary">{option.label}</p>
					<p class="text-xs text-muted">{option.eta}</p>
				</div>

				<Badge size="sm" variant={selected === option.id ? 'primary' : 'secondary'}>
					{formatPrice(option.price, option.currency)}
				</Badge>
			</button>
		</li>
	{/each}
</ul>
