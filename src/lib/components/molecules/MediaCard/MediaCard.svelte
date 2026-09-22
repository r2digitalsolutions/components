<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import type { CardVariant } from '$lib/components/molecules/Card/Card.svelte';
	import AspectRatio from '$lib/components/atoms/AspectRatio/AspectRatio.svelte';
	import Image from '$lib/components/atoms/Image/Image.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Eyebrow from '$lib/components/atoms/Eyebrow/Eyebrow.svelte';
	import Heading from '$lib/components/atoms/Heading/Heading.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';
	import FeatureList from '$lib/components/molecules/FeatureList/FeatureList.svelte';
	import type { FeatureListItem } from '$lib/components/molecules/FeatureList/FeatureList.svelte';

	export type { FeatureListItem };

	interface MediaCardProps {
		src?: string;
		alt?: string;
		/** Numeric aspect (16/9 ≈ 1.778). Ignored when `aspectRatio` is set. */
		ratio?: number;
		/** CSS aspect-ratio, e.g. `'16 / 10'`. */
		aspectRatio?: string;
		eyebrow?: string;
		title?: string;
		description?: string;
		itemsTitle?: string;
		items?: FeatureListItem[];
		iconTone?: 'brand' | 'neutral';
		variant?: CardVariant;
		actionLabel?: string;
		actionHref?: string;
		/** Stick under the site header from `lg` up. */
		sticky?: boolean;
		chrome?: boolean;
		class?: ClassValue;
		/** Replace the photo region (image, gallery, video…). */
		media?: Snippet;
		/** Extra body below title / feature list. */
		children?: Snippet;
		footer?: Snippet;
		onaction?: () => void;
		onclick?: (e: MouseEvent) => void;
	}

	const {
		src,
		alt = '',
		ratio = 1.777777778,
		aspectRatio,
		eyebrow,
		title,
		description,
		itemsTitle,
		items = [],
		iconTone = 'brand',
		variant = 'default',
		actionLabel,
		actionHref,
		sticky = false,
		chrome = true,
		class: className = '',
		media,
		children,
		footer,
		onaction,
		onclick
	}: MediaCardProps = $props();

	const hasMedia = $derived(!!media || !!src);
	const hasList = $derived(items.length > 0);
	const hasBody = $derived(
		!!eyebrow || !!title || !!description || !!itemsTitle || hasList || !!children
	);
	const hasFooter = $derived(!!footer || !!actionLabel);
</script>

{#snippet cardFooter()}
	<div class="px-5 py-4 sm:px-6">
		{#if footer}
			{@render footer()}
		{:else if actionLabel}
			<Button
				size="sm"
				href={actionHref}
				variant={actionHref ? 'primary' : 'secondary'}
				onclick={() => onaction?.()}>{actionLabel}</Button
			>
		{/if}
	</div>
{/snippet}

<Card
	{variant}
	{chrome}
	{onclick}
	padding="none"
	hoverable={!!onclick}
	footer={hasFooter ? cardFooter : undefined}
	class={['h-fit overflow-hidden', sticky && 'lg:sticky lg:top-24', className]}
>
	{#if hasMedia}
		{#if media}
			{@render media()}
		{:else if src && aspectRatio}
			<Image {src} {alt} {aspectRatio} objectFit="cover" rounded={false} class="w-full" />
		{:else if src}
			<AspectRatio {ratio}>
				<Image {src} {alt} objectFit="cover" class="h-full w-full" />
			</AspectRatio>
		{/if}
	{/if}

	{#if hasBody}
		<div class="min-w-0 gap-4 px-5 py-5 sm:px-6 sm:py-6 flex flex-1 flex-col">
			{#if eyebrow || title || description}
				<div class="space-y-2">
					{#if eyebrow}
						<Eyebrow>{eyebrow}</Eyebrow>
					{/if}
					{#if title}
						<Heading level={3} size="md">{title}</Heading>
					{/if}
					{#if description}
						<Text size="sm" tone="muted">{description}</Text>
					{/if}
				</div>
			{/if}
			{#if hasList || itemsTitle}
				<FeatureList title={itemsTitle} {items} {iconTone} />
			{/if}
			{#if children}
				{@render children()}
			{/if}
		</div>
	{/if}
</Card>
