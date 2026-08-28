<script lang="ts">
	import type { Snippet } from 'svelte';

	export interface NavbarLink {
		id: string;
		label: string;
		href?: string;
		disabled?: boolean;
		badge?: string | number;
	}

	interface NavbarProps {
		brand?: string;
		links?: NavbarLink[];
		value?: string;
		size?: 'sm' | 'md' | 'lg';
		/** Link visual style */
		variant?: 'underline' | 'pills' | 'plain';
		/** Stick to top of viewport */
		sticky?: boolean;
		/** Soft blur over page content when sticky/overlay */
		blur?: boolean;
		/** Show bottom border */
		bordered?: boolean;
		/** Constrain inner content width */
		maxWidth?: 'full' | '5xl' | '6xl' | '7xl';
		/** Hide brand mark + text */
		showBrand?: boolean;
		/** Center nav links (marketing) */
		centerLinks?: boolean;
		class?: string;
		leading?: Snippet;
		actions?: Snippet;
		onchange?: (id: string) => void;
	}

	let {
		brand = 'Brand',
		links = [],
		value = $bindable(''),
		size = 'md',
		variant = 'underline',
		sticky = false,
		blur = true,
		bordered = true,
		maxWidth = 'full',
		showBrand = true,
		centerLinks = false,
		class: className = '',
		leading,
		actions,
		onchange
	}: NavbarProps = $props();

	const height = $derived({ sm: 'h-12', md: 'h-14', lg: 'h-16' }[size]);
	const brandSize = $derived({ sm: 'text-sm', md: 'text-base', lg: 'text-lg' }[size]);
	const linkSize = $derived({ sm: 'text-xs', md: 'text-sm', lg: 'text-sm' }[size]);
	const maxWidthClass = $derived(
		{ full: 'max-w-none', '5xl': 'max-w-5xl', '6xl': 'max-w-6xl', '7xl': 'max-w-7xl' }[maxWidth]
	);

	function select(id: string, disabled?: boolean) {
		if (disabled) return;
		value = id;
		onchange?.(id);
	}
</script>

<header
	class={[
		'bg-surface-elevated relative z-40 w-full',
		bordered && 'border-border border-b',
		sticky && 'top-0 sticky',
		blur && 'bg-surface-elevated/85 backdrop-blur-md',
		className
	]}
>
	<div
		class={['gap-3 px-4 sm:gap-4 sm:px-6 mx-auto flex w-full items-center', height, maxWidthClass]}
	>
		{#if leading}
			<div class="flex shrink-0 items-center">{@render leading()}</div>
		{/if}
		{#if showBrand}
			<div class="gap-2 flex shrink-0 items-center">
				<span
					class={[
						'rounded-lg bg-brand-500 font-bold text-white flex items-center justify-center',
						size === 'lg' ? 'h-8 w-8 text-xs' : 'h-7 w-7 text-[11px]'
					]}
					aria-hidden="true"
				>
					{brand.slice(0, 1).toUpperCase()}
				</span>
				<span class={['font-semibold tracking-tight text-primary', brandSize]}>{brand}</span>
			</div>
		{/if}

		<nav
			class={[
				'min-w-0 gap-0.5 md:flex hidden h-full items-stretch',
				centerLinks ? 'flex-1 justify-center' : 'flex-1',
				!showBrand && !centerLinks && 'flex-1'
			]}
			aria-label="Primary"
		>
			{#each links as link (link.id)}
				{@const active = value === link.id}
				<button
					type="button"
					disabled={link.disabled}
					onclick={() => select(link.id, link.disabled)}
					class={[
						'gap-1.5 px-3 font-medium relative flex items-center transition-colors',
						'focus-visible:ring-brand-500/30 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
						linkSize,
						variant === 'underline' && 'border-b-2',
						variant === 'underline' &&
							(active
								? 'border-brand-500 text-primary'
								: 'text-secondary hover:text-primary border-transparent'),
						variant === 'pills' && 'my-2 rounded-lg',
						variant === 'pills' &&
							(active
								? 'bg-surface-overlay text-primary'
								: 'text-secondary hover:bg-surface-overlay/70 hover:text-primary'),
						variant === 'plain' &&
							(active ? 'text-brand-600' : 'text-secondary hover:text-primary'),
						link.disabled && 'cursor-not-allowed opacity-40'
					]}
				>
					{link.label}
					{#if link.badge !== undefined && link.badge !== ''}
						<span
							class="bg-brand-50 px-1.5 py-0.5 font-semibold text-brand-700 dark:bg-brand-950/50 dark:text-brand-300 rounded-full text-[10px]"
						>
							{link.badge}
						</span>
					{/if}
				</button>
			{/each}
		</nav>

		<nav
			class="min-w-0 gap-0.5 md:hidden flex flex-1 items-center overflow-x-auto"
			aria-label="Primary"
		>
			{#each links as link (link.id)}
				<button
					type="button"
					disabled={link.disabled}
					onclick={() => select(link.id, link.disabled)}
					class={[
						'px-3 py-1 text-xs font-medium shrink-0 rounded-full transition-colors',
						'focus-visible:ring-brand-500/30 focus-visible:ring-2 focus-visible:outline-none',
						value === link.id
							? 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300'
							: 'text-secondary hover:bg-surface-overlay',
						link.disabled && 'cursor-not-allowed opacity-40'
					]}
				>
					{link.label}
				</button>
			{/each}
		</nav>

		{#if actions}
			<div class="gap-2 ml-auto flex shrink-0 items-center">
				{@render actions()}
			</div>
		{/if}
	</div>
</header>
