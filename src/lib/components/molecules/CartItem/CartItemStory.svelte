<script lang="ts">
	import CartItem from './CartItem.svelte';

	let qty = $state(2);
</script>

<div class="max-w-md">
	<CartItem
		title="Ceramic mug"
		subtitle="Sand / 350ml"
		price={24}
		bind:quantity={qty}
		image="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=200&q=80"
	/>
</div>
