<script lang="ts">
	import ProductCard from './ProductCard.svelte';

	let wish = $state(false);
</script>

<div class="space-y-8">
	<section class="space-y-2">
		<h3 class="text-xs font-semibold uppercase tracking-wide text-muted">Vertical grid</h3>
		<div class="grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
			<ProductCard
				title="Ceramic pour-over set"
				subtitle="Matte stoneware"
				brand="Atelier"
				price={64}
				compareAt={79}
				badge="New"
				rating={4.5}
				reviews={128}
				wishlist
				bind:wishlisted={wish}
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
				showAddIcon
			/>
			<ProductCard
				title="Linen tote bag"
				subtitle="Natural beige"
				price={42}
				compareAt={55}
				soldOut
				rating={4.8}
				reviews={90}
				image="https://images.unsplash.com/photo-1590874103328-eac38a67478a?w=400&q=80"
				onadd={() => {}}
			/>
		</div>
	</section>

	<section class="space-y-2">
		<h3 class="text-xs font-semibold uppercase tracking-wide text-muted">Horizontal</h3>
		<div class="max-w-lg space-y-3">
			<ProductCard
				variant="horizontal"
				title="Walnut desk lamp"
				subtitle="Dimmable LED"
				brand="Nord"
				price={89}
				compareAt={110}
				rating={4.6}
				reviews={41}
				wishlist
				image="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80"
				onadd={() => {}}
			/>
			<ProductCard
				variant="horizontal"
				title="Wool throw blanket"
				subtitle="Soft charcoal"
				price={72}
				rating={5}
				reviews={18}
				image="https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&q=80"
				onadd={() => {}}
			/>
		</div>
	</section>

	<section class="space-y-2">
		<h3 class="text-xs font-semibold uppercase tracking-wide text-muted">Compact</h3>
		<div class="grid max-w-md grid-cols-3 gap-2">
			<ProductCard
				variant="compact"
				title="Soap set"
				price={16}
				image="https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=300&q=80"
				onadd={() => {}}
				showAddIcon
			/>
			<ProductCard
				variant="compact"
				title="Candle"
				price={22}
				compareAt={28}
				image="https://images.unsplash.com/photo-1602607388736-4cbf2c8596f3?w=300&q=80"
				onadd={() => {}}
				showAddIcon
			/>
			<ProductCard
				variant="compact"
				title="Vase"
				price={34}
				image="https://images.unsplash.com/photo-1578500494198-344bba3b1bd1?w=300&q=80"
				onadd={() => {}}
				showAddIcon
			/>
		</div>
	</section>
</div>
