<script lang="ts">
	import type { Snippet } from 'svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import type { CardVariant } from '$lib/components/molecules/Card/Card.svelte';
	import AspectRatio from '$lib/components/atoms/AspectRatio/AspectRatio.svelte';
	import Image from '$lib/components/atoms/Image/Image.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	interface MediaCardProps {
		src: string;
		alt: string;
		title: string;
		description?: string;
		ratio?: number;
		variant?: CardVariant;
		actionLabel?: string;
		class?: string;
		footer?: Snippet;
		onaction?: () => void;
		onclick?: (e: MouseEvent) => void;
	}

	const {
		src,
		alt,
		title,
		description,
		ratio = 1.777777778,
		variant = 'default',
		actionLabel,
		class: className = '',
		footer,
		onaction,
		onclick
	}: MediaCardProps = $props();
</script>

<Card {variant} padding="none" hoverable={!!onclick} {onclick} class={className} chrome={false}>
	<AspectRatio {ratio}>
		<Image {src} {alt} objectFit="cover" class="h-full w-full" />
	</AspectRatio>

	<div class="space-y-2 p-4 sm:p-5">
		<h3 class="text-base font-semibold text-primary">{title}</h3>
		{#if description}
			<p class="text-sm leading-relaxed text-muted">{description}</p>
		{/if}
		{#if actionLabel}
			<div class="pt-1">
				<Button size="sm" variant="secondary" onclick={() => onaction?.()}>{actionLabel}</Button>
			</div>
		{/if}
	</div>

	{#if footer}
		<div class="border-t border-border px-4 py-3 sm:px-5">
			{@render footer()}
		</div>
	{/if}
</Card>
