<script lang="ts">
	import type { Snippet } from 'svelte';

	interface VisuallyHiddenProps {
		as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label';
		children?: Snippet;
		class?: string;
	}

	let { as = 'span', children, class: className = '' }: VisuallyHiddenProps = $props();
</script>

<svelte:element this={as} class={['sr-only', className]}>
	{#if children}
		{@render children()}
	{/if}
</svelte:element>
