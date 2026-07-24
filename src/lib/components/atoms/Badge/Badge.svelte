<script lang="ts">
	import type { Snippet } from 'svelte';

	type BadgeVariant =
		| 'default'
		| 'primary'
		| 'secondary'
		| 'success'
		| 'warning'
		| 'error'
		| 'info';
	type BadgeSize = 'sm' | 'md' | 'lg';

	interface BadgeProps {
		variant?: BadgeVariant;
		size?: BadgeSize;
		rounded?: boolean;
		dot?: boolean;
		class?: string;
		children?: Snippet;
	}

	const {
		variant = 'default',
		size = 'md',
		rounded = false,
		dot = false,
		class: className = '',
		children
	}: BadgeProps = $props();

	const variantClasses: Record<BadgeVariant, string> = {
		default: 'bg-surface-overlay text-secondary border border-border',
		primary: 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300',
		secondary: 'bg-surface-elevated text-secondary border border-border',
		success: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
		warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
		error: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
		info: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400'
	};

	const dotColors: Record<BadgeVariant, string> = {
		default: 'bg-current',
		primary: 'bg-brand-500',
		secondary: 'bg-current',
		success: 'bg-green-500',
		warning: 'bg-amber-500',
		error: 'bg-red-500',
		info: 'bg-sky-500'
	};

	const sizeClasses: Record<BadgeSize, string> = {
		sm: 'px-1.5 py-0.5 text-xs gap-1',
		md: 'px-2 py-0.5 text-xs gap-1.5',
		lg: 'px-2.5 py-1 text-sm gap-1.5'
	};
</script>

<span
	class={[
		'inline-flex items-center font-medium',
		rounded ? 'rounded-full' : 'rounded-md',
		variantClasses[variant],
		sizeClasses[size],
		className
	]}
>
	{#if dot}
		<span class={['inline-block rounded-full shrink-0', dotColors[variant], size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2']} aria-hidden="true"></span>
	{/if}
	{@render children?.()}
</span>
