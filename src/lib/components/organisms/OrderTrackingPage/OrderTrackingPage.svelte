<script lang="ts">
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import Timeline from '$lib/components/molecules/Timeline/Timeline.svelte';
	import type { TimelineItem } from '$lib/components/molecules/Timeline/Timeline.svelte';
	import ShippingEstimate from '$lib/components/molecules/ShippingEstimate/ShippingEstimate.svelte';
	import type { ShippingOption } from '$lib/components/molecules/ShippingEstimate/ShippingEstimate.svelte';
	import FormSection from '$lib/components/molecules/FormSection/FormSection.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Truck from '@lucide/svelte/icons/truck';

	export interface TrackingEvent {
		id: string;
		label: string;
		time: string;
		done?: boolean;
	}

	export interface DeliveryAddress {
		name?: string;
		line1: string;
		line2?: string;
		city: string;
		region?: string;
		postalCode?: string;
		country?: string;
	}

	export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';

	interface OrderTrackingPageProps {
		orderId: string;
		status: OrderStatus | string;
		events: TrackingEvent[];
		eta?: string;
		carrier?: string;
		trackingNumber?: string;
		address?: DeliveryAddress;
		shippingOptions?: ShippingOption[];
		class?: string;
	}

	let {
		orderId,
		status,
		events,
		eta,
		carrier,
		trackingNumber,
		address,
		shippingOptions = [],
		class: className = ''
	}: OrderTrackingPageProps = $props();

	const statusVariant: Record<string, 'secondary' | 'warning' | 'primary' | 'success' | 'info'> =
		{
			pending: 'secondary',
			processing: 'warning',
			shipped: 'primary',
			out_for_delivery: 'info',
			delivered: 'success'
		};

	const statusLabel: Record<string, string> = {
		pending: 'Pending',
		processing: 'Processing',
		shipped: 'Shipped',
		out_for_delivery: 'Out for delivery',
		delivered: 'Delivered'
	};

	const timelineItems = $derived<TimelineItem[]>(
		events.map((event, index) => ({
			id: event.id,
			title: event.label,
			timestamp: event.time,
			status: event.done
				? index === events.length - 1 && status === 'delivered'
					? 'success'
					: 'default'
				: 'default'
		}))
	);

	const formattedAddress = $derived(
		address
			? [
					address.name,
					address.line1,
					address.line2,
					[address.city, address.region, address.postalCode].filter(Boolean).join(', '),
					address.country
				]
					.filter(Boolean)
					.join('\n')
			: ''
	);
</script>

<div class={['mx-auto w-full max-w-2xl space-y-6', className]}>
	<PageHeader
		title="Order {orderId}"
		description="Track your shipment from warehouse to doorstep."
	>
		{#snippet meta()}
			<Badge size="sm" variant={statusVariant[status] ?? 'secondary'} dot>
				{statusLabel[status] ?? status}
			</Badge>
		{/snippet}
	</PageHeader>

	<Stack gap="lg">
		<FormSection title="Tracking history" description="Latest updates on your order." variant="plain">
			<Timeline items={timelineItems} size="md" />
		</FormSection>

		{#if shippingOptions.length}
			<FormSection
				title="Delivery options"
				description="Estimated arrival for available shipping methods."
				variant="plain"
			>
				<ShippingEstimate options={shippingOptions} />
			</FormSection>
		{:else if eta || carrier || trackingNumber}
			<FormSection title="Delivery details" description="Current shipment information." variant="plain">
				<div class="rounded-xl border border-border bg-surface-elevated p-4">
					<div class="flex items-start gap-3">
						<span
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400"
						>
							<Truck class="h-5 w-5" strokeWidth={2} />
						</span>
						<div class="min-w-0 flex-1 space-y-2">
							{#if eta}
								<div>
									<p class="text-[11px] font-medium uppercase tracking-wide text-muted">
										Estimated delivery
									</p>
									<p class="text-sm font-semibold text-primary">{eta}</p>
								</div>
							{/if}
							{#if carrier}
								<div>
									<p class="text-[11px] font-medium uppercase tracking-wide text-muted">Carrier</p>
									<p class="text-sm text-primary">{carrier}</p>
								</div>
							{/if}
							{#if trackingNumber}
								<div>
									<p class="text-[11px] font-medium uppercase tracking-wide text-muted">
										Tracking number
									</p>
									<p class="font-mono text-sm text-primary">{trackingNumber}</p>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</FormSection>
		{/if}

		{#if address}
			<FormSection title="Delivery address" description="Where this order is being sent." variant="plain">
				<div class="flex items-start gap-3 rounded-xl border border-border bg-surface-elevated p-4">
					<span
						class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-overlay text-secondary"
					>
						<MapPin class="h-5 w-5" strokeWidth={2} />
					</span>
					<div class="min-w-0">
						<p class="whitespace-pre-line text-sm leading-relaxed text-primary">{formattedAddress}</p>
					</div>
				</div>
			</FormSection>
		{/if}
	</Stack>
</div>
