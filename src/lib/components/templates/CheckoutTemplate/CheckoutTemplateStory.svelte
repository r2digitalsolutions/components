<script lang="ts">
	import CheckoutTemplate from './CheckoutTemplate.svelte';

	let items = $state([
		{
			id: '1',
			title: 'Ceramic mug',
			subtitle: 'Sand / 350ml',
			price: 24,
			quantity: 2,
			image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=200&q=80'
		},
		{
			id: '2',
			title: 'Pour-over set',
			subtitle: 'Matte stoneware',
			price: 64,
			quantity: 1,
			image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&q=80'
		}
	]);
</script>

<div class="relative overflow-hidden rounded-2xl border border-border">
	<CheckoutTemplate
		{items}
		shipping={0}
		tax={18}
		onquantity={(id, qty) => {
			items = items.map((i) => (i.id === id ? { ...i, quantity: qty } : i));
		}}
		onremove={(id) => {
			items = items.filter((i) => i.id !== id);
		}}
	/>
</div>
