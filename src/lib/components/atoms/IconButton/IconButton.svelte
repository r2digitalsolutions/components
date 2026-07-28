<script lang="ts">
	import type { Snippet } from 'svelte';

	type IconButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
	type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

	interface IconButtonProps {
		variant?: IconButtonVariant;
		size?: IconButtonSize;
		label: string;
		loading?: boolean;
		disabled?: boolean;
		rounded?: boolean;
		type?: 'button' | 'submit' | 'reset';
		class?: string;
		children?: Snippet;
		onclick?: (e: MouseEvent) => void;
		[key: string]: unknown;
	}

	const {
		variant = 'ghost',
		size = 'md',
		label,
		loading = false,
		disabled = false,
		rounded = false,
		type = 'button',
		class: className = '',
		children,
		onclick,
		...rest
	}: IconButtonProps = $props();

	const isDisabled = $derived(disabled || loading);

	const baseClasses =
		'relative inline-flex shrink-0 items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50';

	const variantClasses: Record<IconButtonVariant, string> = {
		primary:
			'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 focus-visible:ring-brand-500 shadow-sm',
		secondary:
			'bg-surface-elevated text-primary border border-border hover:bg-surface-overlay hover:border-border-strong focus-visible:ring-brand-500 shadow-sm',
		ghost: 'text-secondary hover:text-primary hover:bg-surface-overlay focus-visible:ring-brand-500',
		outline:
			'border-2 border-brand-500 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950 focus-visible:ring-brand-500',
		destructive:
			'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus-visible:ring-red-500 shadow-sm'
	};

	const sizeClasses: Record<IconButtonSize, string> = {
		xs: 'h-7 w-7',
		sm: 'h-8 w-8',
		md: 'h-10 w-10',
		lg: 'h-11 w-11',
		xl: 'h-12 w-12'
	};

	const iconSizeClasses: Record<IconButtonSize, string> = {
		xs: 'h-3.5 w-3.5',
		sm: 'h-4 w-4',
		md: 'h-5 w-5',
		lg: 'h-5 w-5',
		xl: 'h-6 w-6'
	};
</script>

<button
	{type}
	class={[
		baseClasses,
		variantClasses[variant],
		sizeClasses[size],
		(size === 'md' || size === 'lg' || size === 'xl') && 'touch-target',
		rounded ? 'rounded-full' : 'rounded-lg',
		className
	]}
	disabled={isDisabled}
	aria-label={label}
	aria-busy={loading}
	{onclick}
	{...rest}
>
	{#if loading}
		<svg
			class={['animate-spin', iconSizeClasses[size]]}
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
			></path>
		</svg>
	{:else if children}
		<span class={['inline-flex items-center justify-center', iconSizeClasses[size]]}>
			{@render children()}
		</span>
	{/if}
</button>
