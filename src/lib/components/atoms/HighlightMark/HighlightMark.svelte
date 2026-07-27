<script lang="ts">
	import type { Snippet } from 'svelte';

	export type HighlightMarkTone = 'brand' | 'warning' | 'success';

	interface HighlightMarkProps {
		text?: string;
		tone?: HighlightMarkTone;
		class?: string;
		children?: Snippet;
	}

	const {
		text,
		tone = 'brand',
		class: className = '',
		children
	}: HighlightMarkProps = $props();

	const tones: Record<HighlightMarkTone, string> = {
		brand: 'bg-brand-500/20 text-brand-900 dark:bg-brand-500/25 dark:text-brand-200',
		warning: 'bg-amber-500/20 text-amber-900 dark:bg-amber-500/25 dark:text-amber-200',
		success: 'bg-green-500/20 text-green-900 dark:bg-green-500/25 dark:text-green-200'
	};
</script>

<mark
	class={[
		'rounded-sm px-0.5 font-[inherit] text-[length:inherit] leading-[inherit]',
		tones[tone],
		className
	]}
>
	{#if children}
		{@render children()}
	{:else}
		{text}
	{/if}
</mark>
