<script lang="ts">
	interface Props {
		title?: string;
		description?: string;
		href?: string;
		ctaLabel?: string;
		accent?: string;
	}

	let {
		title = 'Feature card',
		description = 'A reusable registered card for blog posts.',
		href = '#',
		ctaLabel = 'Learn more',
		accent = '#0ea5e9'
	}: Props = $props();
</script>

<article
	class="rounded-xl border border-border bg-surface p-4 shadow-sm"
	style={`border-top: 3px solid ${accent}`}
>
	<h3 class="text-base font-semibold text-primary">{title}</h3>
	<p class="mt-1 text-sm text-secondary">{description}</p>
	<a href={href} class="mt-3 inline-block text-sm font-medium text-brand-600 hover:underline">
		{ctaLabel} →
	</a>
</article>
