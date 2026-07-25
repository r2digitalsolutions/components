<script lang="ts">
	import ReviewCard from './ReviewCard.svelte';
</script>

<div class="max-w-lg space-y-6">
	<section class="space-y-3">
		<h3 class="text-xs font-semibold uppercase tracking-wide text-muted">Default</h3>
		<ReviewCard
			author="Ana Ruiz"
			rating={5}
			verified
			product="Ceramic pour-over set"
			location="Madrid, ES"
			title="Exactly what I needed"
			body="Shipping was fast and the quality feels premium. The glaze is even and it pours cleanly. Will order again for gifts."
			date={Date.now() - 1000 * 60 * 60 * 26}
			images={[
				'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&q=80',
				'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=200&q=80'
			]}
			helpful={12}
			notHelpful={1}
			onhelpful={() => {}}
			onreply={() => {}}
		/>
		<ReviewCard
			author="Marco Silva"
			rating={4}
			body="Good overall. The size runs slightly small — I'd size up next time. Packaging was solid."
			date={Date.now() - 1000 * 60 * 60 * 24 * 8}
			clamp={3}
			helpful={3}
			onhelpful={() => {}}
		/>
	</section>

	<section class="space-y-3">
		<h3 class="text-xs font-semibold uppercase tracking-wide text-muted">Compact + quote</h3>
		<ReviewCard
			variant="compact"
			author="Lee Park"
			rating={5}
			verified
			title="Perfect daily mug"
			body="Keeps coffee hot through my morning standup. No leaks."
			date={Date.now() - 1000 * 60 * 60 * 5}
		/>
		<ReviewCard
			variant="quote"
			author="Sofia Berg"
			rating={5}
			verified
			body="Feels like a boutique find — packaging and product quality are both excellent."
			date={Date.now() - 1000 * 60 * 60 * 24 * 3}
		/>
	</section>
</div>
