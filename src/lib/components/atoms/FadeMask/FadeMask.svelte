<script lang="ts">
	import type { Snippet } from 'svelte';

	export type FadeMaskEdge = 'left' | 'right' | 'top' | 'bottom' | 'x' | 'y';
	export type FadeMaskSize = 'sm' | 'md' | 'lg';

	interface FadeMaskProps {
		edge?: FadeMaskEdge;
		size?: FadeMaskSize;
		class?: string;
		children?: Snippet;
	}

	const {
		edge = 'right',
		size = 'md',
		class: className = '',
		children
	}: FadeMaskProps = $props();

	const fadeSizes: Record<FadeMaskSize, string> = {
		sm: '24px',
		md: '48px',
		lg: '80px'
	};

	const maskStyle = $derived.by(() => {
		const fade = fadeSizes[size];
		const transparent = 'transparent';
		const black = 'black';

		switch (edge) {
			case 'left':
				return `linear-gradient(to right, ${transparent}, ${black} ${fade})`;
			case 'right':
				return `linear-gradient(to left, ${transparent}, ${black} ${fade})`;
			case 'top':
				return `linear-gradient(to bottom, ${transparent}, ${black} ${fade})`;
			case 'bottom':
				return `linear-gradient(to top, ${transparent}, ${black} ${fade})`;
			case 'x':
				return `linear-gradient(to right, ${transparent}, ${black} ${fade}, ${black} calc(100% - ${fade}), ${transparent})`;
			case 'y':
				return `linear-gradient(to bottom, ${transparent}, ${black} ${fade}, ${black} calc(100% - ${fade}), ${transparent})`;
		}
	});
</script>

<div
	class={['relative overflow-hidden', className]}
	style="-webkit-mask-image: {maskStyle}; mask-image: {maskStyle};"
>
	{#if children}
		{@render children()}
	{/if}
</div>
