<script lang="ts">
	import type { Snippet } from 'svelte';

	type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
	type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

	interface ButtonProps {
		variant?: ButtonVariant;
		size?: ButtonSize;
		loading?: boolean;
		disabled?: boolean;
		fullWidth?: boolean;
		type?: 'button' | 'submit' | 'reset';
		class?: string;
		children?: Snippet;
		onclick?: (e: MouseEvent) => void;
		[key: string]: unknown;
	}

	const {
		variant = 'primary',
		size = 'md',
		loading = false,
		disabled = false,
		fullWidth = false,
		type = 'button',
		class: className = '',
		children,
		onclick,
		...rest
	}: ButtonProps = $props();

	const isDisabled = $derived(disabled || loading);

	const baseClasses =
		'relative inline-flex items-center justify-center font-medium rounded-lg touch-target transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden';

	const variantClasses: Record<ButtonVariant, string> = {
		primary:
			'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 focus-visible:ring-brand-500 shadow-sm hover:shadow-md active:scale-[0.98]',
		secondary:
			'bg-surface-elevated text-primary border border-border hover:bg-surface-overlay hover:border-border-strong focus-visible:ring-brand-500 shadow-sm active:scale-[0.98]',
		ghost:
			'text-secondary hover:text-primary hover:bg-surface-overlay focus-visible:ring-brand-500 active:scale-[0.98]',
		outline:
			'border-2 border-brand-500 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950 focus-visible:ring-brand-500 active:scale-[0.98]',
		destructive:
			'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus-visible:ring-red-500 shadow-sm hover:shadow-md active:scale-[0.98]'
	};

	const sizeClasses: Record<ButtonSize, string> = {
		xs: 'h-7 px-2.5 text-xs gap-1',
		sm: 'h-8 px-3 text-sm gap-1.5',
		md: 'h-10 px-4 text-sm gap-2',
		lg: 'h-11 px-5 text-base gap-2',
		xl: 'h-12 px-6 text-base gap-2.5'
	};

	const iconSizeClasses: Record<ButtonSize, string> = {
		xs: 'h-3 w-3',
		sm: 'h-3.5 w-3.5',
		md: 'h-4 w-4',
		lg: 'h-5 w-5',
		xl: 'h-5 w-5'
	};
</script>

<button
	{type}
	class={[
		baseClasses,
		variantClasses[variant],
		sizeClasses[size],
		fullWidth && 'w-full',
		className
	]}
	disabled={isDisabled}
	aria-busy={loading}
	{onclick}
	{...rest}
>
	{#if loading}
		<!-- Spinner overlay -->
		<span class="absolute inset-0 flex items-center justify-center">
			<svg
				class={['animate-spin', iconSizeClasses[size]]}
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<circle
					class="opacity-25"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					stroke-width="4"
				></circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
				></path>
			</svg>
		</span>
		<!-- Invisible children to keep button width stable -->
		<span class="invisible" aria-hidden="true">
			{@render children?.()}
		</span>
	{:else}
		{@render children?.()}
	{/if}
</button>
