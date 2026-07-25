<script lang="ts">
	import Image from '$lib/components/atoms/Image/Image.svelte';
	import NumberInput from '$lib/components/molecules/NumberInput/NumberInput.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import PriceTag from '$lib/components/molecules/PriceTag/PriceTag.svelte';

	interface CartItemProps {
		id?: string;
		title: string;
		subtitle?: string;
		image?: string;
		price: number;
		quantity?: number;
		currency?: string;
		max?: number;
		class?: string;
		onquantity?: (qty: number) => void;
		onremove?: () => void;
	}

	let {
		id,
		title,
		subtitle,
		image,
		price,
		quantity = $bindable(1),
		currency = 'EUR',
		max = 99,
		class: className = '',
		onquantity,
		onremove
	}: CartItemProps = $props();
</script>

<div
	class={['flex gap-3 rounded-xl border border-border bg-surface-elevated p-3', className]}
	data-id={id}
>
	<div class="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-overlay">
		{#if image}
			<Image src={image} alt={title} class="h-full w-full object-cover" />
		{/if}
	</div>
	<div class="min-w-0 flex-1 space-y-2">
		<div class="flex items-start justify-between gap-2">
			<div class="min-w-0">
				<p class="truncate text-sm font-semibold text-primary">{title}</p>
				{#if subtitle}
					<p class="truncate text-xs text-muted">{subtitle}</p>
				{/if}
			</div>
			<IconButton label="Remove" size="xs" variant="ghost" onclick={() => onremove?.()}>
				<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 7h12M9 7V5h6v2m-7 3v8m4-8v8m4-8v8M5 7l1 12h12l1-12" />
				</svg>
			</IconButton>
		</div>
		<div class="flex items-center justify-between gap-3">
			<div class="w-28">
				<NumberInput
					bind:value={quantity}
					min={1}
					{max}
					size="sm"
					controls="sides"
					onchange={(v) => onquantity?.(v)}
				/>
			</div>
			<PriceTag amount={price * quantity} {currency} size="sm" />
		</div>
	</div>
</div>
