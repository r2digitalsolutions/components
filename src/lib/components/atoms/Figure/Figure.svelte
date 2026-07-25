<script lang="ts">
	import type { Snippet } from 'svelte';

	interface FigureProps {
		src: string;
		alt: string;
		caption?: string;
		rounded?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		src,
		alt,
		caption,
		rounded = true,
		class: className = '',
		children
	}: FigureProps = $props();
</script>

<figure class={['w-full', className]}>
	{#if children}
		{@render children()}
	{:else}
		<img
			{src}
			{alt}
			class={['w-full object-cover', rounded && 'rounded-xl']}
			loading="lazy"
		/>
	{/if}
	{#if caption}
		<figcaption class="mt-2 text-center text-sm text-muted">{caption}</figcaption>
	{/if}
</figure>
