<script lang="ts">
	import type { Snippet } from 'svelte';

	export type CardVariant = 'default' | 'elevated' | 'bordered' | 'ghost' | 'soft';
	export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

	interface CardProps {
		variant?: CardVariant;
		padding?: CardPadding;
		hoverable?: boolean;
		/** Soft tint behind header / footer chrome (DiffViewer-style). Default true. */
		chrome?: boolean;
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
		chrome = true,
		class: className = '',
		header,
		footer,
		children,
		onclick
	}: CardProps = $props();

	const variantClasses: Record<CardVariant, string> = {
		default: 'border border-border bg-surface-elevated shadow-sm',
		elevated: 'border border-border/60 bg-surface-elevated shadow-md',
		bordered: 'border-2 border-border bg-surface-elevated',
		ghost: 'border border-transparent bg-surface-overlay/80',
		soft: 'border border-border/70 bg-surface/80 shadow-sm backdrop-blur-sm'
	};

	const paddingClasses: Record<CardPadding, string> = {
		none: '',
		sm: 'px-3 py-2.5',
		md: 'px-4 py-3.5 sm:px-5 sm:py-4',
		lg: 'px-5 py-5 sm:px-6 sm:py-6'
	};

	const isClickable = $derived(!!onclick || hoverable);
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	class={[
		'flex flex-col overflow-hidden rounded-2xl transition-[box-shadow,transform,border-color] duration-200',
		variantClasses[variant],
		hoverable &&
			'cursor-pointer hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md',
		!!onclick && 'cursor-pointer',
		className
	]}
	role={onclick ? 'button' : undefined}
	tabindex={onclick ? 0 : undefined}
	{onclick}
	onkeydown={onclick
		? (e) => e.key === 'Enter' && onclick?.(e as unknown as MouseEvent)
		: undefined}
>
	{#if header}
		<div
			class={[
				'w-full border-b border-border',
				chrome && 'bg-surface/40',
				paddingClasses[padding]
			]}
		>
			{@render header()}
		</div>
	{/if}

	{#if children}
		<div
			class={[
				'flex min-w-0 flex-1 flex-col',
				padding !== 'none' ? paddingClasses[padding] : ''
			]}
		>
			{@render children()}
		</div>
	{/if}

	{#if footer}
		<div
			class={[
				'border-t border-border',
				chrome ? 'bg-surface/40' : 'bg-surface-overlay/60',
				paddingClasses[padding]
			]}
		>
			{@render footer()}
		</div>
	{/if}
</div>
