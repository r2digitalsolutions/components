<script lang="ts">
	import ReviewCard from './ReviewCard.svelte';
</script>

<div class="max-w-md space-y-3">
	<ReviewCard
		author="Ana Ruiz"
		rating={5}
		verified
		title="Exactly what I needed"
		body="Shipping was fast and the quality feels premium. Will order again."
		date={Date.now() - 1000 * 60 * 60 * 26}
	/>
	<ReviewCard
		author="Marco Silva"
		rating={4}
		body="Good overall. The size runs slightly small."
		date={Date.now() - 1000 * 60 * 60 * 24 * 8}
	/>
</div>
