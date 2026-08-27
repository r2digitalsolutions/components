<script lang="ts">
	import type { Snippet } from 'svelte';
	import BrandMark from '$lib/components/atoms/BrandMark/BrandMark.svelte';
	import Surface from '$lib/components/atoms/Surface/Surface.svelte';

	interface AuthCardProps {
		title?: string;
		description?: string;
		brand?: string;
		mark?: string;
		/** Official brand logo URL (SVG/PNG) for BrandMark */
		logoSrc?: string;
		class?: string;
		footer?: Snippet;
		children?: Snippet;
	}

	const {
		title = 'Sign in',
		description,
		brand = 'R2 Digi',
		mark,
		logoSrc,
		class: className = '',
		footer,
		children
	}: AuthCardProps = $props();
</script>

<Surface
	variant="elevated"
	padding="lg"
	radius="xl"
	class={`mx-auto w-full max-w-md border border-border shadow-sm ${className}`}
>
	<div class="mb-6 flex flex-col items-center gap-3 text-center">
		<BrandMark name={brand} {mark} {logoSrc} size="lg" showName />
		<div>
			<h1 class="text-xl font-semibold tracking-tight text-primary">{title}</h1>
			{#if description}
				<p class="mt-1 text-sm text-secondary">{description}</p>
			{/if}
		</div>
	</div>
	{@render children?.()}
	{#if footer}
		<div class="mt-6 border-t border-border pt-4 text-center text-sm text-secondary">
			{@render footer()}
		</div>
	{/if}
</Surface>
