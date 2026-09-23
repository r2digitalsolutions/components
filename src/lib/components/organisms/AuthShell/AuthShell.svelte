<script lang="ts">
	import type { Snippet } from 'svelte';
	import BrandMark from '$lib/components/atoms/BrandMark/BrandMark.svelte';
	import SafeArea from '$lib/components/atoms/SafeArea/SafeArea.svelte';

	export type AuthAsideSide = 'left' | 'right' | 'none';

	interface AuthShellProps {
		brand?: string;
		/** Official brand logo URL (SVG/PNG) for BrandMark */
		logoSrc?: string;
		/** Single-color logo, painted with currentColor */
		monochrome?: boolean;
		/** Brand / logo link target (e.g. `/`) */
		brandHref?: string;
		tagline?: string;
		footer?: string;
		headline?: string;
		/** Fill the viewport height (default). Set false for compact embeds. */
		fullHeight?: boolean;
		/** Stretch to parent height (phone frames / nested shells). Overrides fullHeight sizing. */
		fillParent?: boolean;
		/** Desktop marketing panel placement */
		asideSide?: AuthAsideSide;
		/** Compact gradient hero on small screens */
		mobileHero?: boolean;
		highlights?: string[];
		class?: string;
		children?: Snippet;
		aside?: Snippet;
	}

	const {
		brand = 'R2DigiSolutions',
		logoSrc,
		monochrome = false,
		brandHref,
		tagline = 'Build faster with a cohesive design system.',
		footer = '© R2DigiSolutions. All rights reserved.',
		headline = 'Sign in to continue',
		fullHeight = true,
		fillParent = false,
		asideSide = 'left',
		mobileHero = true,
		highlights = [
			'Reusable atoms, molecules, and page templates',
			'Consistent tokens across product surfaces',
			'Ship auth, dashboards, and marketing faster'
		],
		class: className = '',
		children,
		aside
	}: AuthShellProps = $props();

	const showAside = $derived(asideSide !== 'none');
</script>

{#snippet marketingPanel(compact = false)}
	{#if aside}
		{@render aside()}
	{:else}
		<div
			class={[
				'from-brand-600 via-brand-700 to-brand-950 text-white flex flex-col justify-between overflow-hidden bg-gradient-to-br',
				compact ? 'gap-4 px-5 py-5 relative' : 'inset-0 gap-6 p-8 sm:p-10 absolute'
			]}
		>
			<div
				class="-right-16 -top-16 h-64 w-64 bg-white/10 blur-2xl pointer-events-none absolute rounded-full"
				aria-hidden="true"
			></div>
			<div
				class="-bottom-20 -left-10 h-72 w-72 bg-brand-400/20 blur-3xl pointer-events-none absolute rounded-full"
				aria-hidden="true"
			></div>

			<div class={['relative z-10', compact ? 'space-y-3' : 'space-y-6']}>
				<div class="gap-2.5 flex items-center">
					{#if brandHref}
						<a
							href={brandHref}
							class="gap-2.5 inline-flex items-center text-inherit no-underline"
							aria-label={brand}
						>
							<BrandMark name={brand} {logoSrc} {monochrome} size={compact ? 'sm' : 'md'} />
							<span
								class={[
									'font-semibold tracking-tight text-white',
									compact ? 'text-sm' : 'text-base'
								]}
							>
								{brand}
							</span>
						</a>
					{:else}
						<BrandMark name={brand} {logoSrc} {monochrome} size={compact ? 'sm' : 'md'} />
						<span
							class={['font-semibold tracking-tight text-white', compact ? 'text-sm' : 'text-base']}
						>
							{brand}
						</span>
					{/if}
				</div>
				<div class="space-y-2">
					<p class="font-semibold text-white/70 sm:text-xs text-[10px] tracking-[0.2em] uppercase">
						Welcome
					</p>
					<h1
						class={[
							'max-w-sm font-semibold tracking-tight text-white',
							compact ? 'text-xl' : 'text-3xl sm:text-4xl'
						]}
					>
						{headline}
					</h1>
					<p class={['max-w-sm leading-relaxed text-white/80', compact ? 'text-xs' : 'text-sm']}>
						{tagline}
					</p>
				</div>
				{#if !compact && highlights.length}
					<ul class="space-y-2.5 pt-1 text-sm text-white/75 sm:block hidden">
						{#each highlights as item (item)}
							<li class="gap-2 flex items-start">
								<span class="mt-1.5 h-1.5 w-1.5 bg-white/80 shrink-0 rounded-full"></span>
								{item}
							</li>
						{/each}
					</ul>
				{/if}
			</div>

			{#if !compact}
				<p class="text-xs text-white/50 relative z-10">{footer}</p>
			{/if}
		</div>
	{/if}
{/snippet}

<div
	class={[
		'bg-surface flex w-full flex-col overflow-hidden',
		// h-dvh (not height:100%): % collapses when html/body have no explicit height
		fillParent && 'min-h-0 h-full',
		!fillParent && fullHeight && 'h-dvh min-h-dvh',
		!fillParent && !fullHeight && 'min-h-[32rem]',
		className
	]}
	style:height={fillParent ? '100%' : undefined}
	style:min-height={fillParent ? '100%' : !fullHeight ? '32rem' : undefined}
>
	<div
		class={[
			'min-h-0 flex h-full w-full flex-1 flex-col',
			showAside && 'lg:flex-row lg:items-stretch',
			asideSide === 'right' && 'lg:flex-row-reverse'
		]}
	>
		{#if showAside}
			<aside
				class="min-h-0 lg:block lg:h-auto lg:w-1/2 lg:self-stretch relative hidden w-full overflow-hidden"
			>
				{@render marketingPanel(false)}
			</aside>
		{/if}

		<section class="min-h-0 bg-surface relative flex h-full w-full flex-1 flex-col">
			<div
				class="inset-0 from-brand-500/5 pointer-events-none absolute bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] via-transparent to-transparent"
				aria-hidden="true"
			></div>

			<SafeArea top bottom class="min-h-0 relative z-10 flex h-full flex-1 flex-col">
				{#if mobileHero && showAside}
					<div class="lg:hidden shrink-0">
						{@render marketingPanel(true)}
					</div>
				{:else}
					<div class="px-5 pt-6 lg:hidden shrink-0 text-center">
						<BrandMark
							name={brand}
							{logoSrc}
							{monochrome}
							href={brandHref}
							showName
							size="md"
							class="justify-center"
						/>
						<p class="mt-2 text-sm text-muted">{tagline}</p>
					</div>
				{/if}

				<!-- Form column: true center in remaining space -->
				<div
					class="min-h-0 px-5 py-8 sm:px-8 sm:py-10 flex h-full flex-1 flex-col items-center justify-center overflow-y-auto"
				>
					<div class="max-w-md mx-auto w-full shrink-0">
						{#if children}
							{@render children()}
						{/if}
					</div>
				</div>

				<p class="px-5 pb-4 text-muted lg:hidden shrink-0 text-center text-[11px]">{footer}</p>
			</SafeArea>
		</section>
	</div>
</div>
