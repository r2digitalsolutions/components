<script lang="ts">
	import type { Snippet } from 'svelte';

	interface EmptyStateProps {
		title?: string;
		description?: string;
		/** Small uppercase line above the title. */
		eyebrow?: string;
		icon?: Snippet;
		action?: Snippet;
		/** Muted line under the action (a tip, a shortcut, a reassurance). */
		hint?: string;
		/** Free-form content under the hint, for anything `hint` can't express. */
		footer?: Snippet;
		/** Heading level of the title, to keep the page outline in order. Default 3. */
		headingLevel?: 2 | 3 | 4 | 5 | 6;
		/** `dashed` outline (default), solid `card` outline, or `plain` with no surface. */
		variant?: 'dashed' | 'card' | 'plain';
		/** `sm` fits a panel, `md` (default) a section, `lg` a whole empty page. */
		size?: 'sm' | 'md' | 'lg';
		/** `gradient` adds a soft brand glow fading from the top edge; works in light and dark. */
		background?: 'none' | 'gradient';
		/** `soft` brand-tinted tile (default) or `elevated` surface tile with border and shadow. */
		iconStyle?: 'soft' | 'elevated';
		class?: string;
	}

	const {
		title = 'No data found',
		description = 'There are no items to display right now.',
		eyebrow,
		icon,
		action,
		hint,
		footer,
		headingLevel = 3,
		variant = 'dashed',
		size = 'md',
		background = 'none',
		iconStyle = 'soft',
		class: className = ''
	}: EmptyStateProps = $props();

	const variantClass = {
		dashed: 'rounded-2xl border border-dashed border-border bg-surface-elevated',
		card: 'rounded-3xl border border-border bg-surface-elevated',
		plain: ''
	};
	const sizeClass = {
		sm: 'p-5',
		md: 'p-8',
		lg: 'px-7 py-14'
	};
	const tileSize = {
		sm: 'h-10 w-10 rounded-xl mb-3',
		md: 'h-14 w-14 rounded-2xl mb-4',
		lg: 'h-[76px] w-[76px] rounded-[25px] mb-6'
	};
	const tileStyle = {
		soft: 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 shadow-xs',
		elevated:
			'bg-surface-elevated border border-border text-brand-600 dark:text-brand-400 shadow-lg'
	};
	const iconSize = { sm: 'h-5 w-5', md: 'h-7 w-7', lg: 'h-8 w-8' };
	const titleClass = {
		sm: 'text-sm font-semibold mb-1',
		md: 'text-base font-semibold mb-1',
		lg: 'text-[clamp(1.375rem,3vw,1.75rem)] font-normal tracking-tight mb-2'
	};
	const descriptionClass = {
		sm: 'text-xs max-w-xs mb-4',
		md: 'text-xs max-w-sm mb-5',
		lg: 'text-sm max-w-[26rem] mb-6'
	};
	const gradient =
		'bg-[radial-gradient(ellipse_at_top,var(--color-brand-50),transparent_65%)] dark:bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--color-brand-500)_18%,transparent),transparent_65%)]';
</script>

<div
	class={[
		'flex flex-col items-center justify-center text-center w-full',
		variantClass[variant],
		sizeClass[size],
		background === 'gradient' && gradient,
		className
	]}
>
	<!-- Icon or illustration container -->
	<div class={['flex items-center justify-center', tileSize[size], tileStyle[iconStyle]]}>
		{#if icon}
			{@render icon()}
		{:else}
			<svg class={iconSize[size]} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
				<path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
			</svg>
		{/if}
	</div>

	{#if eyebrow}
		<p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted mb-2">{eyebrow}</p>
	{/if}
	<svelte:element this={`h${headingLevel}`} class={['text-primary', titleClass[size]]}
		>{title}</svelte:element
	>
	{#if description}
		<p class={['text-muted leading-relaxed', descriptionClass[size]]}>{description}</p>
	{/if}

	{#if action}
		{@render action()}
	{/if}
	{#if hint}
		<p class="text-xs text-muted mt-4">{hint}</p>
	{/if}
	{#if footer}
		{@render footer()}
	{/if}
</div>
