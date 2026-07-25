<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import SectionTitle from './SectionTitle.svelte';
</script>

<div class="max-w-xl">
	<SectionTitle
		eyebrow="Product"
		title="Built for shipping faster"
		description="Reusable atoms and molecules that keep your UI consistent across apps."
	>
		{#snippet actions()}
			<Button size="sm">Browse</Button>
		{/snippet}
	</SectionTitle>
</div>
