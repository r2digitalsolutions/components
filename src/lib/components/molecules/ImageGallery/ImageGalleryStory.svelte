<script lang="ts">
	import ImageGallery from './ImageGallery.svelte';
</script>

<div class="max-w-2xl">
	<ImageGallery
		images={[
			{ id: '1', src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80', alt: 'Abstract 1' },
			{ id: '2', src: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=600&q=80', alt: 'Abstract 2' },
			{ id: '3', src: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=600&q=80', alt: 'Abstract 3' },
			{ id: '4', src: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&q=80', alt: 'Abstract 4' }
		]}
	/>
</div>
