<script lang="ts">
	import type { Snippet } from 'svelte';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	interface FormSectionProps {
		title: string;
		description?: string;
		/** Small label above the title */
		eyebrow?: string;
		/** Pill next to the title, e.g. Optional */
		badge?: string;
		badgeTone?: 'neutral' | 'brand' | 'warning' | 'success';
		/** Show divider under header (stack layout, non-collapsible) */
		divided?: boolean;
		/**
		 * plain = bare section
		 * card = elevated panel
		 * inset = soft bordered block
		 */
		variant?: 'plain' | 'card' | 'inset';
		/**
		 * stack = title above fields
		 * split = title left / fields right (settings pages)
		 */
		layout?: 'stack' | 'split';
		/** Field grid gap */
		gap?: 'sm' | 'md' | 'lg';
		/** Optional 2-column field grid from md up */
		columns?: 1 | 2;
		/** Make the body collapsible */
		collapsible?: boolean;
		/** Open state (bindable) */
		open?: boolean;
		class?: string;
		icon?: Snippet;
		actions?: Snippet;
		footer?: Snippet;
		children?: Snippet;
	}

	let {
		title,
		description,
		eyebrow = '',
		badge = '',
		badgeTone = 'neutral',
		divided = true,
		variant = 'plain',
		layout = 'stack',
		gap = 'md',
		columns = 1,
		collapsible = false,
		open = $bindable(true),
		class: className = '',
		icon,
		actions,
		footer,
		children
	}: FormSectionProps = $props();

	const gapClass = $derived(gap === 'sm' ? 'gap-3' : gap === 'lg' ? 'gap-6' : 'gap-4');

	const badgeToneClass: Record<NonNullable<FormSectionProps['badgeTone']>, string> = {
		neutral: 'border-border bg-surface-overlay text-secondary',
		brand:
			'border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-900/50 dark:bg-brand-950/40 dark:text-brand-300',
		warning:
			'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300',
		success:
			'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300'
	};

	const isCard = $derived(variant === 'card' || variant === 'inset');
	const useSplit = $derived(layout === 'split' && !collapsible);

	function toggle() {
		if (!collapsible) return;
		open = !open;
	}
</script>

{#snippet badgeEl()}
	{#if badge}
		<span
			class={[
				'inline-flex rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
				badgeToneClass[badgeTone]
			]}
		>
			{badge}
		</span>
	{/if}
{/snippet}

{#snippet iconEl(size: 'sm' | 'md' = 'md')}
	{#if icon}
		<span
			class={[
				'flex shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600',
				'ring-1 ring-brand-500/10 dark:bg-brand-950/50 dark:text-brand-300',
				size === 'sm' ? 'h-7 w-7' : 'h-9 w-9'
			]}
		>
			{@render icon()}
		</span>
	{/if}
{/snippet}

{#snippet titleRow()}
	<div class="flex min-w-0 flex-wrap items-center gap-2">
		<h2 class="text-sm font-semibold tracking-tight text-primary">{title}</h2>
		{@render badgeEl()}
	</div>
{/snippet}

<section
	class={[
		'w-full',
		variant === 'card' &&
			'overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm',
		variant === 'inset' && 'overflow-hidden rounded-2xl border border-border/80 bg-surface/70',
		className
	]}
>
	{#if collapsible}
		<!-- Accordion-style header: one hit target -->
		<button
			type="button"
			class={[
				'flex w-full items-center gap-3 text-left outline-none transition-colors',
				'hover:bg-surface-overlay/60 focus-visible:bg-surface-overlay/60',
				'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500/30',
				isCard ? 'px-4 py-3.5 sm:px-5' : 'py-3',
				open && isCard && 'border-b border-border'
			]}
			aria-expanded={open}
			onclick={toggle}
		>
			<span
				class="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted"
				aria-hidden="true"
			>
				<ChevronRight
					class={['h-4 w-4 transition-transform duration-200', open && 'rotate-90']}
					strokeWidth={2.25}
				/>
			</span>

			{@render iconEl('sm')}

			<span class="min-w-0 flex-1 space-y-0.5">
				{#if eyebrow}
					<span class="block text-[10px] font-semibold uppercase tracking-[0.14em] text-muted"
						>{eyebrow}</span
					>
				{/if}
				{@render titleRow()}
				{#if description}
					<span class="block text-xs leading-relaxed text-secondary">{description}</span>
				{/if}
			</span>
		</button>
	{:else}
		<!-- Static header -->
		<div
			class={[
				useSplit && 'lg:hidden',
				isCard && 'px-4 pt-4 sm:px-5 sm:pt-5',
				isCard && !divided && 'pb-1',
				!isCard && 'pb-0'
			]}
		>
			<div class="flex items-start justify-between gap-3">
				<div class="flex min-w-0 flex-1 items-start gap-3">
					{@render iconEl('md')}
					<div class="min-w-0 space-y-0.5">
						{#if eyebrow}
							<p class="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
								{eyebrow}
							</p>
						{/if}
						{@render titleRow()}
						{#if description}
							<p class="max-w-sm text-xs leading-relaxed text-secondary">{description}</p>
						{/if}
					</div>
				</div>
				{#if actions}
					<div class="flex shrink-0 flex-wrap items-center gap-2">
						{@render actions()}
					</div>
				{/if}
			</div>

			{#if divided && layout === 'stack'}
				<div class={['mt-3 border-b border-border', isCard && '-mx-4 sm:-mx-5']}></div>
			{/if}
		</div>
	{/if}

	{#if open}
		<div
			class={[
				isCard && divided && 'px-4 py-4 sm:px-5 sm:py-5',
				isCard && !divided && 'px-4 pt-2 pb-4 sm:px-5 sm:pb-5',
				!isCard && (collapsible || divided) && layout === 'stack' && 'pt-4',
				useSplit &&
					'lg:grid lg:grid-cols-[minmax(12rem,17rem)_minmax(0,1fr)] lg:items-start lg:gap-10'
			]}
		>
			{#if useSplit}
				<aside class="mb-4 hidden min-w-0 lg:mb-0 lg:block">
					<div class="space-y-2 lg:sticky lg:top-4">
						{#if eyebrow}
							<p class="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
								{eyebrow}
							</p>
						{/if}
						<div class="flex flex-wrap items-center gap-2">
							{@render iconEl('sm')}
							{@render titleRow()}
						</div>
						{#if description}
							<p class="max-w-sm text-xs leading-relaxed text-secondary">{description}</p>
						{/if}
						{#if actions}
							<div class="flex flex-wrap gap-2 pt-1">
								{@render actions()}
							</div>
						{/if}
					</div>
				</aside>
			{/if}

			<div class="min-w-0">
				{#if children}
					<div class={['grid grid-cols-1', gapClass, columns === 2 && 'sm:grid-cols-2']}>
						{@render children()}
					</div>
				{/if}
			</div>
		</div>

		{#if footer}
			<div
				class={[
					'border-t border-border',
					isCard ? 'bg-surface/40 px-4 py-3 sm:px-5' : 'mt-4 pt-3'
				]}
			>
				{@render footer()}
			</div>
		{/if}
	{/if}
</section>
