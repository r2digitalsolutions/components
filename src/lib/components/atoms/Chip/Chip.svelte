<script lang="ts">
	import type { Snippet } from 'svelte';

	type ChipVariant = 'default' | 'primary' | 'success' | 'warning' | 'error';
	type ChipSize = 'sm' | 'md';

	interface ChipProps {
		variant?: ChipVariant;
		size?: ChipSize;
		selected?: boolean;
		disabled?: boolean;
		dismissible?: boolean;
		class?: string;
		children?: Snippet;
		onclick?: (e: MouseEvent) => void;
		ondismiss?: () => void;
	}

	let {
		variant = 'default',
		size = 'md',
		selected = false,
		disabled = false,
		dismissible = false,
		class: className = '',
		children,
		onclick,
		ondismiss
	}: ChipProps = $props();

	const variantClasses: Record<ChipVariant, string> = {
		default: 'bg-surface-overlay text-secondary border-border',
		primary: 'bg-brand-100 text-brand-700 border-brand-200 dark:bg-brand-950/50 dark:text-brand-300 dark:border-brand-800',
		success: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300',
		warning: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300',
		error: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300'
	};

	const selectedClasses: Record<ChipVariant, string> = {
		default: 'bg-surface-elevated text-primary border-border-strong ring-1 ring-brand-500/30',
		primary: 'bg-brand-500 text-white border-brand-500',
		success: 'bg-green-600 text-white border-green-600',
		warning: 'bg-amber-500 text-white border-amber-500',
		error: 'bg-red-500 text-white border-red-500'
	};

	const sizeClasses: Record<ChipSize, string> = {
		sm: 'h-6 gap-1 px-2 text-xs',
		md: 'h-7 gap-1.5 px-2.5 text-xs'
	};
</script>

<span
	class={[
		'inline-flex max-w-full items-center rounded-full border font-medium transition-colors',
		sizeClasses[size],
		selected ? selectedClasses[variant] : variantClasses[variant],
		disabled && 'cursor-not-allowed opacity-40',
		onclick && !disabled && 'cursor-pointer hover:brightness-[0.98]',
		className
	]}
	role={onclick ? 'button' : undefined}
	tabindex={onclick && !disabled ? 0 : undefined}
	aria-pressed={onclick ? selected : undefined}
	aria-disabled={disabled || undefined}
	onclick={(e) => {
		if (disabled) return;
		onclick?.(e);
	}}
	onkeydown={(e) => {
		if (!onclick || disabled) return;
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onclick?.(e as unknown as MouseEvent);
		}
	}}
>
	<span class="min-w-0 truncate">
		{#if children}
			{@render children()}
		{/if}
	</span>

	{#if dismissible}
		<button
			type="button"
			class={[
				'-mr-0.5 inline-flex shrink-0 items-center justify-center rounded-full p-0.5 transition-colors',
				'hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 dark:hover:bg-white/15',
				disabled && 'pointer-events-none'
			]}
			aria-label="Remove"
			disabled={disabled}
			onclick={(e) => {
				e.stopPropagation();
				if (!disabled) ondismiss?.();
			}}
		>
			<svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	{/if}
</span>
