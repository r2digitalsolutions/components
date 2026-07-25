<script lang="ts">
	import MediaCard from './MediaCard.svelte';

	let props = $props<{
		title?: string;
		description?: string;
		actionLabel?: string;
	}>();
</script>

<div class="max-w-sm">
	<MediaCard
		src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80"
		alt="Abstract gradient"
		title={props.title ?? 'Design systems that scale'}
		description={props.description ??
			'Reusable atoms and molecules compose into full product surfaces.'}
		actionLabel={props.actionLabel ?? 'Read more'}
	/>
</div>
