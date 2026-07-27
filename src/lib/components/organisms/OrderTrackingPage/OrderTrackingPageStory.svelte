<script lang="ts">
	import OrderTrackingPage from './OrderTrackingPage.svelte';
	import type { DeliveryAddress, TrackingEvent } from './OrderTrackingPage.svelte';

	const events: TrackingEvent[] = [
		{
			id: '1',
			label: 'Order placed',
			time: 'Jul 22, 9:14 AM',
			done: true
		},
		{
			id: '2',
			label: 'Packed at warehouse',
			time: 'Jul 23, 2:40 PM',
			done: true
		},
		{
			id: '3',
			label: 'In transit — Madrid hub',
			time: 'Jul 24, 8:05 AM',
			done: true
		},
		{
			id: '4',
			label: 'Out for delivery',
			time: 'Jul 27, 7:30 AM',
			done: true
		},
		{
			id: '5',
			label: 'Delivered',
			time: 'Expected by 6:00 PM',
			done: false
		}
	];

	const address: DeliveryAddress = {
		name: 'Ada Lovelace',
		line1: 'Calle Gran Vía 28',
		line2: 'Piso 4B',
		city: 'Madrid',
		region: 'MD',
		postalCode: '28013',
		country: 'Spain'
	};
</script>

<div class="p-4">
	<OrderTrackingPage
		orderId="#ORD-48291"
		status="out_for_delivery"
		{events}
		eta="Today, Jul 27 by 6:00 PM"
		carrier="DHL Express"
		trackingNumber="JD014600012345678901"
		{address}
	/>
</div>
