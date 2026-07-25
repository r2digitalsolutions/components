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
		'relative z-40 w-full bg-surface-elevated',
		bordered && 'border-b border-border',
		sticky && 'sticky top-0',
		blur && 'bg-surface-elevated/85 backdrop-blur-md',
		className
	]}
>
	<div
		class={[
			'mx-auto flex w-full items-center gap-3 px-4 sm:gap-4 sm:px-6',
			height,
			maxWidthClass
		]}
	>
		{#if showBrand}
			<div class="flex shrink-0 items-center gap-2">
				{#if leading}
					{@render leading()}
				{:else}
					<span
						class={[
							'flex items-center justify-center rounded-lg bg-brand-500 font-bold text-white',
							size === 'lg' ? 'h-8 w-8 text-xs' : 'h-7 w-7 text-[11px]'
						]}
						aria-hidden="true"
					>
						{brand.slice(0, 1).toUpperCase()}
					</span>
				{/if}
				<span class={['font-semibold tracking-tight text-primary', brandSize]}>{brand}</span>
			</div>
		{/if}

		<nav
			class={[
				'hidden h-full min-w-0 items-stretch gap-0.5 md:flex',
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
						'relative flex items-center gap-1.5 px-3 font-medium transition-colors',
						'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500/30',
						linkSize,
						variant === 'underline' && 'border-b-2',
						variant === 'underline' &&
							(active
								? 'border-brand-500 text-primary'
								: 'border-transparent text-secondary hover:text-primary'),
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
							class="rounded-full bg-brand-50 px-1.5 py-0.5 text-[10px] font-semibold text-brand-700 dark:bg-brand-950/50 dark:text-brand-300"
						>
							{link.badge}
						</span>
					{/if}
				</button>
			{/each}
		</nav>

		<nav
			class="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto md:hidden"
			aria-label="Primary"
		>
			{#each links as link (link.id)}
				<button
					type="button"
					disabled={link.disabled}
					onclick={() => select(link.id, link.disabled)}
					class={[
						'shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors',
						'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
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
			<div class="ml-auto flex shrink-0 items-center gap-2">
				{@render actions()}
			</div>
		{/if}
	</div>
</header>
