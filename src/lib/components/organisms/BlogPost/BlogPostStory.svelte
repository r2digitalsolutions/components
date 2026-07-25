<script lang="ts">
	import BlogPost from './BlogPost.svelte';
	import ShareButton from '$lib/components/molecules/ShareButton/ShareButton.svelte';
</script>

<BlogPost
	title="Designing component libraries that scale"
	excerpt="Patterns for atoms, molecules, organisms, and page templates that stay coherent as the product grows."
	author="Rafael Gonzalez"
	date={Date.now() - 1000 * 60 * 60 * 48}
	readingMinutes={6}
	tags={['Design systems', 'Svelte']}
	cover="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80"
>
	{#snippet actions()}
		<ShareButton size="xs" />
	{/snippet}
	<p>
		Start with small primitives, compose carefully, and keep page templates as the glue for product flows.
	</p>
	<p>
		When every layer has a clear job, teams move faster without reinventing layout or interaction patterns.
	</p>
</BlogPost>
