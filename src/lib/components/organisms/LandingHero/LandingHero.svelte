<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Input from '$lib/components/atoms/Input/Input.svelte';
	import Eyebrow from '$lib/components/atoms/Eyebrow/Eyebrow.svelte';
	import BrandMark from '$lib/components/atoms/BrandMark/BrandMark.svelte';
	import Rating from '$lib/components/atoms/Rating/Rating.svelte';
	import AvatarGroup from '$lib/components/molecules/AvatarGroup/AvatarGroup.svelte';
	import type { AvatarGroupItem } from '$lib/components/molecules/AvatarGroup/AvatarGroup.svelte';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Play from '@lucide/svelte/icons/play';

	export type LandingHeroVariant = 'split' | 'centered' | 'bleed' | 'minimal';
	export type LandingHeroTone = 'surface' | 'muted' | 'brand' | 'inverse';
	export type LandingHeroCtaMode = 'buttons' | 'email';
	export type LandingHeroSize = 'md' | 'lg' | 'xl';

	export interface LandingHeroStat {
		id: string;
		value: string;
		label: string;
	}

	export interface LandingHeroLogo {
		id: string;
		name: string;
		src?: string;
	}

	export interface LandingHeroProof {
		avatars?: AvatarGroupItem[];
		rating?: number;
		label?: string;
	}

	export interface LandingHeroAnnouncement {
		label: string;
		href?: string;
		badge?: string;
	}

	interface LandingHeroProps {
		brand?: string;
		brandMark?: string;
		showBrand?: boolean;
		eyebrow?: string;
		title?: string;
		description?: string;
		primaryLabel?: string;
		secondaryLabel?: string;
		ctaMode?: LandingHeroCtaMode;
		email?: string;
		emailPlaceholder?: string;
		emailButtonLabel?: string;
		announcement?: LandingHeroAnnouncement;
		proof?: LandingHeroProof;
		stats?: LandingHeroStat[];
		logos?: LandingHeroLogo[];
		logosLabel?: string;
		image?: string;
		imageAlt?: string;
		videoUrl?: string;
		variant?: LandingHeroVariant;
		tone?: LandingHeroTone;
		size?: LandingHeroSize;
		framed?: boolean;
		class?: string;
		media?: Snippet;
		actions?: Snippet;
		below?: Snippet;
		onprimary?: () => void;
		onsecondary?: () => void;
		onemail?: (email: string) => void;
		onannouncement?: () => void;
		onplay?: () => void;
	}

	let {
		brand = 'R2 Digi',
		brandMark,
		showBrand = true,
		eyebrow,
		title = 'Ship polished interfaces faster',
		description = 'Atoms, molecules, organisms, and ready-made page templates for product teams.',
		primaryLabel = 'Get started',
		secondaryLabel = 'View components',
		ctaMode = 'buttons',
		email = $bindable(''),
		emailPlaceholder = 'you@company.com',
		emailButtonLabel = 'Join waitlist',
		announcement,
		proof,
		stats = [],
		logos = [],
		logosLabel = 'Trusted by product teams',
		image,
		imageAlt = '',
		videoUrl,
		variant = 'split',
		tone = 'surface',
		size = 'lg',
		framed = true,
		class: className = '',
		media,
		actions,
		below,
		onprimary,
		onsecondary,
		onemail,
		onannouncement,
		onplay
	}: LandingHeroProps = $props();

	const tones: Record<LandingHeroTone, string> = {
		surface: 'bg-surface text-primary',
		muted: 'bg-surface-overlay text-primary',
		brand: 'bg-brand-950 text-white dark:bg-brand-950',
		inverse: 'bg-zinc-950 text-white'
	};

	const isDarkTone = $derived(tone === 'brand' || tone === 'inverse');

	const pad: Record<LandingHeroSize, string> = {
		md: 'px-6 py-10 sm:px-8 sm:py-12',
		lg: 'px-6 py-12 sm:px-10 sm:py-16 lg:py-20',
		xl: 'px-6 py-16 sm:px-12 sm:py-20 lg:py-28'
	};

	const titleSize: Record<LandingHeroSize, string> = {
		md: 'text-3xl sm:text-4xl',
		lg: 'text-4xl sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]',
		xl: 'text-4xl sm:text-5xl lg:text-6xl lg:leading-[1.05]'
	};

	function submitEmail() {
		const value = email.trim();
		if (!value) return;
		onemail?.(value);
	}
</script>

<section
	class={[
		'landing-hero relative isolate overflow-hidden',
		framed && variant !== 'bleed' && 'rounded-3xl border border-border',
		tones[tone],
		className
	]}
>
	{#if variant === 'bleed' && image}
		<div class="absolute inset-0 -z-20">
			<img src={image} alt="" class="h-full w-full object-cover" />
			<div
				class={[
					'absolute inset-0',
					isDarkTone
						? 'bg-gradient-to-r from-zinc-950/92 via-zinc-950/75 to-zinc-950/35'
						: 'bg-gradient-to-r from-surface via-surface/90 to-surface/40'
				]}
			></div>
		</div>
	{:else}
		<!-- Atmosphere (no purple wash) -->
		<div
			class="pointer-events-none absolute inset-0 -z-10 opacity-80"
			aria-hidden="true"
		>
			<div
				class={[
					'absolute -left-24 -top-28 h-72 w-72 rounded-full blur-3xl',
					isDarkTone ? 'bg-white/8' : 'bg-brand-500/10'
				]}
			></div>
			<div
				class={[
					'absolute -bottom-32 right-0 h-80 w-80 rounded-full blur-3xl',
					isDarkTone ? 'bg-sky-400/10' : 'bg-sky-500/8'
				]}
			></div>
			<div
				class={[
					'absolute inset-0 opacity-[0.35]',
					isDarkTone
						? '[background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.14)_1px,transparent_0)] [background-size:22px_22px]'
						: '[background-image:radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.06)_1px,transparent_0)] [background-size:22px_22px]'
				]}
			></div>
		</div>
	{/if}

	<div
		class={[
			pad[size],
			variant === 'split' && 'grid items-center gap-10 lg:grid-cols-2 lg:gap-12',
			variant === 'centered' && 'mx-auto flex max-w-3xl flex-col items-center text-center',
			variant === 'bleed' && 'relative min-h-[28rem] max-w-3xl',
			variant === 'minimal' && 'mx-auto max-w-2xl'
		]}
	>
		<div
			class={[
				'space-y-6',
				variant === 'centered' && 'flex w-full flex-col items-center',
				variant === 'split' && 'min-w-0'
			]}
		>
			{#if showBrand}
				<div class={variant === 'centered' ? 'flex justify-center' : ''}>
					<BrandMark
						name={brand}
						mark={brandMark}
						showName
						size={size === 'xl' ? 'lg' : 'md'}
						class={isDarkTone ? '[&_span]:text-white' : ''}
					/>
				</div>
			{/if}

			{#if announcement}
				<button
					type="button"
					class={[
						'inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-1.5 text-left text-xs transition-colors',
						isDarkTone
							? 'border-white/15 bg-white/8 text-white/90 hover:bg-white/12'
							: 'border-border bg-surface-elevated/80 text-secondary hover:border-border-strong hover:text-primary'
					]}
					onclick={() => onannouncement?.()}
				>
					{#if announcement.badge}
						<span
							class={[
								'shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
								isDarkTone ? 'bg-white text-zinc-950' : 'bg-brand-500 text-white'
							]}
						>
							{announcement.badge}
						</span>
					{/if}
					<span class="truncate">{announcement.label}</span>
					<ArrowRight class="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden="true" />
				</button>
			{/if}

			{#if eyebrow}
				<Eyebrow class={isDarkTone ? 'text-white/70' : ''}>{eyebrow}</Eyebrow>
			{/if}

			<h1
				class={[
					'text-balance font-semibold tracking-tight',
					titleSize[size],
					isDarkTone ? 'text-white' : 'text-primary',
					variant === 'centered' ? 'max-w-2xl' : 'max-w-xl'
				]}
			>
				{title}
			</h1>

			{#if description}
				<p
					class={[
						'text-pretty text-base leading-relaxed sm:text-lg',
						isDarkTone ? 'text-white/75' : 'text-secondary',
						variant === 'centered' ? 'max-w-xl' : 'max-w-lg'
					]}
				>
					{description}
				</p>
			{/if}

			{#if actions}
				{@render actions()}
			{:else if ctaMode === 'email'}
				<form
					class={[
						'flex w-full max-w-md flex-col gap-2 sm:flex-row sm:items-start',
						variant === 'centered' && 'mx-auto'
					]}
					onsubmit={(e) => {
						e.preventDefault();
						submitEmail();
					}}
				>
					<div class="min-w-0 flex-1">
						<Input
							type="email"
							bind:value={email}
							placeholder={emailPlaceholder}
							size="lg"
							required
							class={isDarkTone ? 'border-white/20 bg-white/10 text-white placeholder:text-white/50' : ''}
						/>
					</div>
					<Button type="submit" size="lg" class="shrink-0 sm:mt-0">
						{emailButtonLabel}
					</Button>
				</form>
			{:else}
				<div
					class={[
						'flex flex-wrap gap-3',
						variant === 'centered' && 'justify-center'
					]}
				>
					<Button size="lg" onclick={() => onprimary?.()}>{primaryLabel}</Button>
					{#if secondaryLabel}
						<Button
							size="lg"
							variant={isDarkTone ? 'secondary' : 'secondary'}
							class={isDarkTone ? 'border-white/20 bg-white/10 text-white hover:bg-white/15' : ''}
							onclick={() => onsecondary?.()}
						>
							{secondaryLabel}
						</Button>
					{/if}
					{#if videoUrl || onplay}
						<Button
							size="lg"
							variant="ghost"
							class={isDarkTone ? 'text-white hover:bg-white/10' : ''}
							onclick={() => {
								onplay?.();
								if (videoUrl && typeof window !== 'undefined') {
									window.open(videoUrl, '_blank', 'noopener,noreferrer');
								}
							}}
						>
							<Play class="mr-1.5 h-4 w-4" aria-hidden="true" />
							Watch demo
						</Button>
					{/if}
				</div>
			{/if}

			{#if proof && (proof.avatars?.length || proof.rating || proof.label)}
				<div
					class={[
						'flex flex-wrap items-center gap-3 pt-1',
						variant === 'centered' && 'justify-center'
					]}
				>
					{#if proof.avatars?.length}
						<AvatarGroup
							items={proof.avatars}
							max={5}
							size="sm"
							ring={isDarkTone ? 'inverse' : 'surface'}
						/>
					{/if}
					<div class="min-w-0 shrink space-y-0.5">
						{#if proof.rating != null}
							<div class="flex items-center gap-2">
								<Rating value={proof.rating} readonly size="sm" />
								<span
									class={[
										'text-xs font-medium tabular-nums',
										isDarkTone ? 'text-white/80' : 'text-primary'
									]}
								>
									{proof.rating.toFixed(1)}
								</span>
							</div>
						{/if}
						{#if proof.label}
							<p class={['text-xs', isDarkTone ? 'text-white/60' : 'text-muted']}>
								{proof.label}
							</p>
						{/if}
					</div>
				</div>
			{/if}

			{#if stats.length}
				<dl
					class={[
						'grid w-full max-w-md gap-4 pt-2',
						stats.length === 1 && 'grid-cols-1',
						stats.length === 2 && 'grid-cols-2',
						stats.length >= 3 && 'grid-cols-3',
						variant === 'centered' && 'mx-auto'
					]}
				>
					{#each stats.slice(0, 3) as stat (stat.id)}
						<div class="min-w-0">
							<dt
								class={[
									'text-xl font-semibold tracking-tight sm:text-2xl',
									isDarkTone ? 'text-white' : 'text-primary'
								]}
							>
								{stat.value}
							</dt>
							<dd class={['text-xs', isDarkTone ? 'text-white/55' : 'text-muted']}>
								{stat.label}
							</dd>
						</div>
					{/each}
				</dl>
			{/if}
		</div>

		{#if variant === 'split'}
			<div class="relative min-h-64 lg:min-h-[22rem]">
				<div
					class={[
						'relative h-full min-h-64 overflow-hidden rounded-[1.35rem] lg:min-h-[22rem]',
						isDarkTone
							? 'ring-1 ring-white/10'
							: 'ring-1 ring-border/80 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.45)]'
					]}
				>
					{#if media}
						{@render media()}
					{:else if image}
						<img src={image} alt={imageAlt} class="h-full w-full object-cover" />
					{:else}
						<div
							class={[
								'flex h-64 items-center justify-center text-sm lg:h-full',
								isDarkTone ? 'bg-white/5 text-white/50' : 'bg-surface-overlay text-muted'
							]}
						>
							Hero visual
						</div>
					{/if}
				</div>
			</div>
		{/if}

		{#if variant === 'centered' && (media || image)}
			<div
				class={[
					'mt-4 w-full overflow-hidden rounded-[1.35rem]',
					isDarkTone ? 'ring-1 ring-white/10' : 'ring-1 ring-border shadow-lg'
				]}
			>
				{#if media}
					{@render media()}
				{:else if image}
					<img src={image} alt={imageAlt} class="aspect-[16/10] w-full object-cover" />
				{/if}
			</div>
		{/if}
	</div>

	{#if logos.length}
		<div
			class={[
				'border-t px-6 py-5 sm:px-10',
				isDarkTone ? 'border-white/10' : 'border-border/70'
			]}
		>
			<p
				class={[
					'mb-3 text-center text-[11px] font-medium uppercase tracking-[0.14em]',
					isDarkTone ? 'text-white/45' : 'text-muted'
				]}
			>
				{logosLabel}
			</p>
			<ul class="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
				{#each logos as logo (logo.id)}
					<li class="opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0">
						{#if logo.src}
							<img src={logo.src} alt={logo.name} class="h-6 w-auto object-contain sm:h-7" />
						{:else}
							<span
								class={[
									'text-sm font-semibold tracking-tight',
									isDarkTone ? 'text-white/70' : 'text-secondary'
								]}
							>
								{logo.name}
							</span>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	{#if below}
		<div class="px-6 pb-8 sm:px-10">
			{@render below()}
		</div>
	{/if}
</section>
