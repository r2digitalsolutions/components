<script lang="ts">
	import ProductCard from './ProductCard.svelte';
</script>

<div class="grid max-w-lg grid-cols-2 gap-3">
	<ProductCard
		title="Ceramic pour-over set"
		subtitle="Matte stoneware"
		price={64}
		compareAt={79}
		badge="New"
		rating={4.5}
		reviews={128}
		image="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80"
		onadd={() => {}}
	/>
	<ProductCard
		title="Travel mug 350ml"
		subtitle="Keeps warm 6h"
		price={28}
		rating={4}
		reviews={56}
		image="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=80"
		onadd={() => {}}
	/>
</div>
