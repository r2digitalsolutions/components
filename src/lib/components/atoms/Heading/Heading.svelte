<script lang="ts">
	import type { Snippet } from 'svelte';

	export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
	export type HeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

	interface HeadingProps {
		level?: HeadingLevel;
		size?: HeadingSize;
		muted?: boolean;
		class?: string;
		children?: Snippet;
	}

	const {
		level = 2,
		size,
		muted = false,
		class: className = '',
		children
	}: HeadingProps = $props();

	const defaultSize: Record<HeadingLevel, HeadingSize> = {
		1: '2xl',
		2: 'xl',
		3: 'lg',
		4: 'md',
		5: 'sm',
		6: 'xs'
	};

	const resolved = $derived(size ?? defaultSize[level]);

	const sizes: Record<HeadingSize, string> = {
		xs: 'text-xs font-semibold tracking-wide uppercase',
		sm: 'text-sm font-semibold',
		md: 'text-base font-semibold',
		lg: 'text-lg font-semibold tracking-tight',
		xl: 'text-xl font-semibold tracking-tight',
		'2xl': 'text-2xl font-semibold tracking-tight'
	};

	const tag = $derived(`h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6');
</script>

<svelte:element
	this={tag}
	class={[sizes[resolved], muted ? 'text-secondary' : 'text-primary', className]}
>
	{#if children}
		{@render children()}
	{/if}
</svelte:element>
