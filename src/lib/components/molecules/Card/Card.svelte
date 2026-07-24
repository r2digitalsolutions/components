<script lang="ts">
	import type { Snippet } from 'svelte';

	type CardVariant = 'default' | 'elevated' | 'bordered' | 'ghost';
	type CardPadding = 'none' | 'sm' | 'md' | 'lg';

	interface CardProps {
		variant?: CardVariant;
		padding?: CardPadding;
		hoverable?: boolean;
		class?: string;
		header?: Snippet;
		footer?: Snippet;
		children?: Snippet;
		onclick?: (e: MouseEvent) => void;
	}

	const {
		variant = 'default',
		padding = 'md',
		hoverable = false,
		class: className = '',
		header,
		footer,
		children,
		onclick
	}: CardProps = $props();

	const variantClasses: Record<CardVariant, string> = {
		default: 'bg-surface-elevated border border-border shadow-sm',
		elevated: 'bg-surface-elevated shadow-md',
		bordered: 'bg-transparent border-2 border-border',
		ghost: 'bg-surface-overlay'
	};

	const paddingClasses: Record<CardPadding, string> = {
		none: '',
		sm: 'p-3',
		md: 'p-4 md:p-5',
		lg: 'p-5 md:p-7'
	};

	const isClickable = $derived(!!onclick);
</script>
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	class={[
		'rounded-xl overflow-hidden transition-all duration-200',
		variantClasses[variant],
		hoverable &&
			'hover:shadow-md hover:-translate-y-0.5 hover:border-border-strong cursor-pointer',
		isClickable && 'cursor-pointer',
		className
	]}
	role={isClickable ? 'button' : undefined}
	tabindex={isClickable ? 0 : undefined}
	{onclick}
	onkeydown={isClickable ? (e) => e.key === 'Enter' && onclick?.(e as unknown as MouseEvent) : undefined}
>

	{#if header}
		<div class={['border-b border-border', paddingClasses[padding]]}>
			{@render header()}
		</div>
	{/if}

	{#if children}
		<div class={padding !== 'none' ? paddingClasses[padding] : ''}>
			{@render children()}
		</div>
	{/if}

	{#if footer}
		<div class={['border-t border-border bg-surface-overlay', paddingClasses[padding]]}>
			{@render footer()}
		</div>
	{/if}
</div>
