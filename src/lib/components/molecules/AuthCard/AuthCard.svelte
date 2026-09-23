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
		/** Single-color logo, painted with currentColor */
		monochrome?: boolean;
		/** Brand / logo link target (e.g. `/`) */
		brandHref?: string;
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
		monochrome = false,
		brandHref,
		class: className = '',
		footer,
		children
	}: AuthCardProps = $props();
</script>

<Surface
	variant="elevated"
	padding="lg"
	radius="xl"
	class={`max-w-md border-border shadow-sm mx-auto w-full border ${className}`}
>
	<div class="mb-6 gap-3 flex flex-col items-center text-center">
		<BrandMark
			name={brand}
			{mark}
			{logoSrc}
			{monochrome}
			href={brandHref}
			size="lg"
			showName
			class="text-primary"
		/>
		<div>
			<h1 class="text-xl font-semibold tracking-tight text-primary">{title}</h1>
			{#if description}
				<p class="mt-1 text-sm text-secondary">{description}</p>
			{/if}
		</div>
	</div>
	{@render children?.()}
	{#if footer}
		<div class="mt-6 border-border pt-4 text-sm text-secondary border-t text-center">
			{@render footer()}
		</div>
	{/if}
</Surface>
