<script lang="ts">
	import type { Snippet } from 'svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Heading from '$lib/components/atoms/Heading/Heading.svelte';

	interface PromoCardProps {
		eyebrow?: string;
		title: string;
		description?: string;
		actionLabel?: string;
		badge?: string;
		class?: string;
		media?: Snippet;
		onaction?: () => void;
	}

	const {
		eyebrow,
		title,
		description,
		actionLabel = 'Learn more',
		badge,
		class: className = '',
		media,
		onaction
	}: PromoCardProps = $props();
</script>

<Card class={className} padding="lg" variant="soft" chrome={false}>
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center">
		<div class="min-w-0 flex-1 space-y-2">
			<div class="flex flex-wrap items-center gap-2">
				{#if eyebrow}
					<p class="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
						{eyebrow}
					</p>
				{/if}
				{#if badge}
					<Badge size="sm" variant="primary">{badge}</Badge>
				{/if}
			</div>
			<Heading level={3} size="lg">{title}</Heading>
			{#if description}
				<p class="text-sm leading-relaxed text-muted">{description}</p>
			{/if}
			{#if actionLabel}
				<div class="pt-1">
					<Button size="sm" onclick={() => onaction?.()}>{actionLabel}</Button>
				</div>
			{/if}
		</div>
		{#if media}
			<div class="shrink-0 sm:w-40">
				{@render media()}
			</div>
		{/if}
	</div>
</Card>
