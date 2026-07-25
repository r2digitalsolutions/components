<script lang="ts">
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import PriceTag from '$lib/components/molecules/PriceTag/PriceTag.svelte';
	import NumberInput from '$lib/components/molecules/NumberInput/NumberInput.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import FormActions from '$lib/components/molecules/FormActions/FormActions.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Image from '$lib/components/atoms/Image/Image.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';
	import Divider from '$lib/components/atoms/Divider/Divider.svelte';

	export interface CartItem {
		id: string;
		name: string;
		price: number;
		qty: number;
		image?: string;
	}

	interface CartPageProps {
		items?: CartItem[];
		currency?: string;
		class?: string;
		oncheckout?: () => void;
	}

	let {
		items = $bindable<CartItem[]>([
			{
				id: '1',
				name: 'Pro plan · monthly',
				price: 29,
				qty: 1,
				image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&q=80'
			},
			{
				id: '2',
				name: 'Extra seats',
				price: 6,
				qty: 3,
				image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=120&q=80'
			}
		]),
		currency = 'USD',
		class: className = '',
		oncheckout
	}: CartPageProps = $props();

	const subtotal = $derived(items.reduce((s, i) => s + i.price * i.qty, 0));

	function setQty(id: string, qty: number) {
		items = items.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i));
	}

	function remove(id: string) {
		items = items.filter((i) => i.id !== id);
	}
</script>

<div class={['mx-auto w-full max-w-2xl space-y-5', className]}>
	<PageHeader title="Cart" description="Review items before checkout." />

	{#if items.length === 0}
		<EmptyState title="Your cart is empty" description="Add a plan or seats to continue." />
	{:else}
		<Card padding="none" chrome={false}>
			<ul class="divide-y divide-border">
				{#each items as item (item.id)}
					<li class="flex gap-3 p-4">
						{#if item.image}
							<div class="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border">
								<Image src={item.image} alt="" objectFit="cover" class="h-full w-full" />
							</div>
						{/if}
						<div class="min-w-0 flex-1 space-y-2">
							<div class="flex items-start justify-between gap-2">
								<p class="text-sm font-medium text-primary">{item.name}</p>
								<IconButton label="Remove" size="sm" onclick={() => remove(item.id)}>
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
									</svg>
								</IconButton>
							</div>
							<div class="flex flex-wrap items-center justify-between gap-3">
								<NumberInput
									value={item.qty}
									min={1}
									size="sm"
									onchange={(v) => setQty(item.id, v)}
								/>
								<PriceTag amount={item.price * item.qty} {currency} size="sm" />
							</div>
						</div>
					</li>
				{/each}
			</ul>

			<div class="space-y-3 border-t border-border p-4">
				<div class="flex items-center justify-between">
					<Text size="sm" tone="muted" as="span">Subtotal</Text>
					<PriceTag amount={subtotal} {currency} size="md" />
				</div>
				<Divider />
				<FormActions
					submitLabel="Checkout"
					showCancel={false}
					align="end"
					fullWidth
					onsubmit={() => oncheckout?.()}
				/>
			</div>
		</Card>
	{/if}
</div>
