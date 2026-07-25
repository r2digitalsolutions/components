<script lang="ts">
	import type { Snippet } from 'svelte';

	export type TextSize = 'xs' | 'sm' | 'md' | 'lg';
	export type TextTone = 'primary' | 'secondary' | 'muted';

	interface TextProps {
		size?: TextSize;
		tone?: TextTone;
		as?: 'p' | 'span' | 'div';
		class?: string;
		children?: Snippet;
	}

	const {
		size = 'sm',
		tone = 'secondary',
		as = 'p',
		class: className = '',
		children
	}: TextProps = $props();

	const sizes: Record<TextSize, string> = {
		xs: 'text-xs leading-relaxed',
		sm: 'text-sm leading-relaxed',
		md: 'text-base leading-relaxed',
		lg: 'text-lg leading-relaxed'
	};

	const tones: Record<TextTone, string> = {
		primary: 'text-primary',
		secondary: 'text-secondary',
		muted: 'text-muted'
	};
</script>

<svelte:element this={as} class={[sizes[size], tones[tone], className]}>
	{#if children}{@render children()}{/if}
</svelte:element>
