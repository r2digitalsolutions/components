<script lang="ts">
	import type { Snippet } from 'svelte';
	import BrandMark from '$lib/components/atoms/BrandMark/BrandMark.svelte';
	import SafeArea from '$lib/components/atoms/SafeArea/SafeArea.svelte';

	export type AuthAsideSide = 'left' | 'right' | 'none';

	interface AuthShellProps {
		brand?: string;
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
				'relative flex h-full min-h-0 flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-950 text-white',
				compact ? 'gap-4 px-5 py-5' : 'gap-6 p-8 sm:p-10'
			]}
		>
			<div
				class="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl"
				aria-hidden="true"
			></div>
			<div
				class="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl"
				aria-hidden="true"
			></div>

			<div class={['relative z-10', compact ? 'space-y-3' : 'space-y-6']}>
				<div class="flex items-center gap-2.5">
					<BrandMark name={brand} size={compact ? 'sm' : 'md'} />
					<span class={['font-semibold tracking-tight text-white', compact ? 'text-sm' : 'text-base']}>
						{brand}
					</span>
				</div>
				<div class="space-y-2">
					<p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70 sm:text-xs">
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
					<ul class="hidden space-y-2.5 pt-1 text-sm text-white/75 sm:block">
						{#each highlights as item}
							<li class="flex items-start gap-2">
								<span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/80"></span>
								{item}
							</li>
						{/each}
					</ul>
				{/if}
			</div>

			{#if !compact}
				<p class="relative z-10 text-xs text-white/50">{footer}</p>
			{/if}
		</div>
	{/if}
{/snippet}

<div
	class={[
		'flex w-full flex-col overflow-hidden bg-surface',
		fillParent && 'h-full min-h-0',
		!fillParent && fullHeight && 'h-full min-h-dvh',
		!fillParent && !fullHeight && 'min-h-[32rem]',
		className
	]}
	style:height={fillParent ? '100%' : fullHeight ? '100%' : undefined}
	style:min-height={fillParent ? '100%' : fullHeight ? '100dvh' : '32rem'}
>
	<div
		class={[
			'flex h-full min-h-0 w-full flex-1 flex-col',
			showAside && 'lg:flex-row',
			asideSide === 'right' && 'lg:flex-row-reverse'
		]}
	>
		{#if showAside}
			<aside class="relative hidden h-full min-h-0 w-full overflow-hidden lg:block lg:w-1/2">
				{@render marketingPanel(false)}
			</aside>
		{/if}

		<section class="relative flex h-full min-h-0 w-full flex-1 flex-col bg-surface">
			<div
				class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-500/5 via-transparent to-transparent"
				aria-hidden="true"
			></div>

			<SafeArea top bottom class="relative z-10 flex h-full min-h-0 flex-1 flex-col">
				{#if mobileHero && showAside}
					<div class="shrink-0 lg:hidden">
						{@render marketingPanel(true)}
					</div>
				{:else}
					<div class="shrink-0 px-5 pt-6 text-center lg:hidden">
						<BrandMark name={brand} showName size="md" class="justify-center" />
						<p class="mt-2 text-sm text-muted">{tagline}</p>
					</div>
				{/if}

				<!-- Form column: true center in remaining space -->
				<div
					class="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-5 py-8 sm:px-8 sm:py-10"
				>
					<div class="mx-auto w-full max-w-md shrink-0">
						{#if children}
							{@render children()}
						{/if}
					</div>
				</div>

				<p class="shrink-0 px-5 pb-4 text-center text-[11px] text-muted lg:hidden">{footer}</p>
			</SafeArea>
		</section>
	</div>
</div>
