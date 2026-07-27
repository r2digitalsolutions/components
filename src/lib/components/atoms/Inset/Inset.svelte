<script lang="ts">
	import type { Snippet } from 'svelte';

	export type InsetPadding = 'none' | 'sm' | 'md' | 'lg';
	export type InsetRounded = 'md' | 'lg' | 'xl' | '2xl';

	interface InsetProps {
		padding?: InsetPadding;
		rounded?: InsetRounded;
		children?: Snippet;
		class?: string;
	}

	const {
		padding = 'md',
		rounded = 'lg',
		children,
		class: className = ''
	}: InsetProps = $props();

	const paddings: Record<InsetPadding, string> = {
		none: 'p-0',
		sm: 'p-3',
		md: 'p-4',
		lg: 'p-6'
	};

	const radii: Record<InsetRounded, string> = {
		md: 'rounded-md',
		lg: 'rounded-lg',
		xl: 'rounded-xl',
		'2xl': 'rounded-2xl'
	};
</script>

<div
	class={[
		'border border-border bg-surface-overlay shadow-inner',
		paddings[padding],
		radii[rounded],
		className
	]}
>
	{#if children}
		{@render children()}
	{/if}
</div>
