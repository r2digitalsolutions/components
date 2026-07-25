<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Eyebrow from '$lib/components/atoms/Eyebrow/Eyebrow.svelte';
	import BrandMark from '$lib/components/atoms/BrandMark/BrandMark.svelte';

	interface LandingHeroProps {
		brand?: string;
		eyebrow?: string;
		title?: string;
		description?: string;
		primaryLabel?: string;
		secondaryLabel?: string;
		image?: string;
		class?: string;
		media?: Snippet;
		onprimary?: () => void;
		onsecondary?: () => void;
	}

	const {
		brand = 'R2 Digi',
		eyebrow = 'Component library',
		title = 'Ship polished interfaces faster',
		description = 'Atoms, molecules, organisms, and ready-made page templates for product teams.',
		primaryLabel = 'Get started',
		secondaryLabel = 'View components',
		image,
		class: className = '',
		media,
		onprimary,
		onsecondary
	}: LandingHeroProps = $props();
</script>

<section
	class={[
		'relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface-elevated via-surface to-brand-500/5',
		className
	]}
>
	<div class="grid items-center gap-8 px-6 py-10 lg:grid-cols-2 lg:px-10 lg:py-14">
		<div class="space-y-5">
			<BrandMark name={brand} showName size="md" />
			{#if eyebrow}
				<Eyebrow>{eyebrow}</Eyebrow>
			{/if}
			<h1 class="max-w-xl text-3xl font-semibold tracking-tight text-primary sm:text-4xl lg:text-5xl">
				{title}
			</h1>
			<p class="max-w-lg text-base text-secondary">{description}</p>
			<div class="flex flex-wrap gap-3">
				<Button size="lg" onclick={() => onprimary?.()}>{primaryLabel}</Button>
				{#if secondaryLabel}
					<Button size="lg" variant="secondary" onclick={() => onsecondary?.()}>
						{secondaryLabel}
					</Button>
				{/if}
			</div>
		</div>
		<div class="relative min-h-56 overflow-hidden rounded-2xl border border-border bg-surface-overlay">
			{#if media}
				{@render media()}
			{:else if image}
				<img src={image} alt="" class="h-full w-full object-cover" />
			{:else}
				<div class="flex h-56 items-center justify-center text-sm text-muted lg:h-72">
					Hero visual
				</div>
			{/if}
		</div>
	</div>
</section>
