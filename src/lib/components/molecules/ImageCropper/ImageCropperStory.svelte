<script lang="ts">
	import ImageCropper from './ImageCropper.svelte';

	let result = $state('');
</script>

<div class="w-full max-w-md space-y-3">
	<ImageCropper
		src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
		aspect={1}
		oncrop={(url) => (result = url)}
	/>
	{#if result}
		<img src={result} alt="Cropped" class="h-24 w-24 rounded-lg object-cover" />
	{/if}
</div>
