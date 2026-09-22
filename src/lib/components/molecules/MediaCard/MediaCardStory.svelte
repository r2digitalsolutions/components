<script lang="ts">
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import MediaCard from './MediaCard.svelte';

	let props = $props<{
		title?: string;
		description?: string;
		actionLabel?: string;
	}>();
</script>

<div class="max-w-5xl gap-6 md:grid-cols-2 grid">
	<MediaCard
		src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80"
		alt="Abstract gradient"
		title={props.title ?? 'Design systems that scale'}
		description={props.description ??
			'Reusable atoms and molecules compose into full product surfaces.'}
		actionLabel={props.actionLabel ?? 'Read more'}
	/>
	<MediaCard
		src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80"
		alt="Crowd at a show"
		aspectRatio="16 / 10"
		eyebrow="Connector"
		itemsTitle="What ships, what stays"
		iconTone="neutral"
		items={[
			{
				id: 'toggle',
				title: 'Opt-in per event',
				description: 'No dump. The toggle publishes the listing.',
				icon: 'check'
			},
			{
				id: 'sync',
				title: 'Signed webhook',
				description: 'Create, update and cancel. Invalid secret, nothing comes in.',
				icon: 'bolt'
			},
			{
				id: 'soon',
				title: 'Other sellers later',
				description: 'This marketplace ships first.',
				icon: 'spark'
			}
		]}
	>
		{#snippet footer()}
			<Button href="#docs" size="sm">Open docs</Button>
		{/snippet}
	</MediaCard>
</div>
