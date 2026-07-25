<script lang="ts">
	import CompareSlider from './CompareSlider.svelte';

	let value = $state(48);
</script>

<div class="max-w-xl">
	<CompareSlider
		bind:value
		beforeSrc="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&q=80"
		afterSrc="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=900&q=80"
	/>
</div>
