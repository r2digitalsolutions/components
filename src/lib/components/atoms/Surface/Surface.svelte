<script lang="ts">
	import type { Snippet } from 'svelte';

	export type SurfaceVariant = 'default' | 'elevated' | 'overlay' | 'soft' | 'ghost';
	export type SurfacePadding = 'none' | 'sm' | 'md' | 'lg';
	export type SurfaceRadius = 'none' | 'md' | 'lg' | 'xl' | '2xl';

	interface SurfaceProps {
		variant?: SurfaceVariant;
		padding?: SurfacePadding;
		radius?: SurfaceRadius;
		bordered?: boolean;
		class?: string;
		children?: Snippet;
	}

	const {
		variant = 'default',
		padding = 'md',
		radius = 'xl',
		bordered = true,
		class: className = '',
		children
	}: SurfaceProps = $props();

	const variants: Record<SurfaceVariant, string> = {
		default: 'bg-surface',
		elevated: 'bg-surface-elevated',
		overlay: 'bg-surface-overlay',
		soft: 'bg-surface/80 backdrop-blur-sm',
		ghost: 'bg-transparent'
	};

	const paddings: Record<SurfacePadding, string> = {
		none: 'p-0',
		sm: 'p-3',
		md: 'p-4',
		lg: 'p-6'
	};

	const radii: Record<SurfaceRadius, string> = {
		none: 'rounded-none',
		md: 'rounded-md',
		lg: 'rounded-lg',
		xl: 'rounded-xl',
		'2xl': 'rounded-2xl'
	};
</script>

<div
	class={[
		variants[variant],
		paddings[padding],
		radii[radius],
		bordered && 'border border-border',
		className
	]}
>
	{#if children}
		{@render children()}
	{/if}
</div>
