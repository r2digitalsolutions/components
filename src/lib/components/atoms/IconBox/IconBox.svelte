<script lang="ts">
	import type { Snippet } from 'svelte';

	export type IconBoxTone = 'brand' | 'neutral' | 'success' | 'warning' | 'error' | 'info';
	export type IconBoxSize = 'sm' | 'md' | 'lg';

	interface IconBoxProps {
		tone?: IconBoxTone;
		size?: IconBoxSize;
		rounded?: 'lg' | 'xl' | 'full';
		class?: string;
		children?: Snippet;
	}

	const {
		tone = 'brand',
		size = 'md',
		rounded = 'xl',
		class: className = '',
		children
	}: IconBoxProps = $props();

	const tones: Record<IconBoxTone, string> = {
		brand: 'bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400',
		neutral: 'bg-surface-overlay text-secondary border border-border',
		success: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
		warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
		error: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
		info: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400'
	};

	const sizes: Record<IconBoxSize, string> = {
		sm: 'h-8 w-8 [&_svg]:h-3.5 [&_svg]:w-3.5',
		md: 'h-10 w-10 [&_svg]:h-4 [&_svg]:w-4',
		lg: 'h-12 w-12 [&_svg]:h-5 [&_svg]:w-5'
	};

	const radii: Record<'lg' | 'xl' | 'full', string> = {
		lg: 'rounded-lg',
		xl: 'rounded-xl',
		full: 'rounded-full'
	};
</script>

<span
	class={[
		'inline-flex shrink-0 items-center justify-center',
		tones[tone],
		sizes[size],
		radii[rounded],
		className
	]}
	aria-hidden="true"
>
	{#if children}{@render children()}{/if}
</span>
