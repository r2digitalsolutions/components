<script lang="ts">
	import type { Snippet } from 'svelte';

	type ContainerSize =
		| 'xs'
		| 'sm'
		| 'md'
		| 'lg'
		| 'xl'
		| '2xl'
		| '3xl'
		| '4xl'
		| '5xl'
		| '6xl'
		| '7xl'
		| 'full';

	type ContainerPadding = 'none' | 'sm' | 'md' | 'lg';

	interface ContainerProps {
		size?: ContainerSize;
		/** Horizontal padding inside the container */
		padding?: ContainerPadding;
		/** Stretch to full width of parent (still capped by size) */
		fluid?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		size = 'lg',
		padding = 'md',
		fluid = true,
		class: className = '',
		children
	}: ContainerProps = $props();

	const sizes: Record<ContainerSize, string> = {
		xs: 'max-w-xs',
		sm: 'max-w-screen-sm',
		md: 'max-w-screen-md',
		lg: 'max-w-screen-lg',
		xl: 'max-w-screen-xl',
		'2xl': 'max-w-screen-2xl',
		'3xl': 'max-w-3xl',
		'4xl': 'max-w-4xl',
		'5xl': 'max-w-5xl',
		'6xl': 'max-w-6xl',
		'7xl': 'max-w-7xl',
		full: 'max-w-none'
	};

	const paddings: Record<ContainerPadding, string> = {
		none: 'px-0',
		sm: 'px-3 sm:px-4',
		md: 'px-4 sm:px-6',
		lg: 'px-6 sm:px-8 lg:px-10'
	};
</script>

<div
	class={[
		fluid ? 'w-full' : 'w-auto',
		'mx-auto',
		sizes[size],
		paddings[padding],
		className
	]}
	data-size={size}
>
	{#if children}{@render children()}{/if}
</div>
