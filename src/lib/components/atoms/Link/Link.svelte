<script lang="ts">
	import type { Snippet } from 'svelte';

	type LinkVariant = 'default' | 'muted' | 'brand' | 'underline';
	type LinkSize = 'sm' | 'md' | 'lg';

	interface LinkProps {
		href: string;
		variant?: LinkVariant;
		size?: LinkSize;
		external?: boolean;
		disabled?: boolean;
		class?: string;
		children?: Snippet;
		onclick?: (e: MouseEvent) => void;
	}

	let {
		href,
		variant = 'default',
		size = 'md',
		external = false,
		disabled = false,
		class: className = '',
		children,
		onclick
	}: LinkProps = $props();

	const variantClasses: Record<LinkVariant, string> = {
		default: 'text-primary hover:text-brand-600 dark:hover:text-brand-400',
		muted: 'text-muted hover:text-secondary',
		brand: 'text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300',
		underline:
			'text-primary underline underline-offset-4 decoration-border hover:decoration-brand-500 hover:text-brand-600 dark:hover:text-brand-400'
	};

	const sizeClasses: Record<LinkSize, string> = {
		sm: 'text-xs',
		md: 'text-sm',
		lg: 'text-base'
	};
</script>

{#if disabled}
	<span
		class={[
			'inline-flex cursor-not-allowed items-center gap-1 font-medium opacity-50',
			variantClasses[variant],
			sizeClasses[size],
			className
		]}
		aria-disabled="true"
	>
		{#if children}
			{@render children()}
		{/if}
	</span>
{:else}
	<a
		{href}
		class={[
			'inline-flex items-center gap-1 rounded-sm font-medium transition-colors',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
			variantClasses[variant],
			sizeClasses[size],
			className
		]}
		target={external ? '_blank' : undefined}
		rel={external ? 'noopener noreferrer' : undefined}
		{onclick}
	>
		{#if children}
			{@render children()}
		{/if}
		{#if external}
			<svg
				class="h-3.5 w-3.5 opacity-70"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
				/>
			</svg>
		{/if}
	</a>
{/if}
