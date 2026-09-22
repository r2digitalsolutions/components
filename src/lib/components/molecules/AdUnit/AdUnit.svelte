<script lang="ts">
	import Image from '$lib/components/atoms/Image/Image.svelte'

	export type AdUnitFormat = 'horizontal' | 'vertical' | 'banner' | 'native' | 'search'

	interface AdUnitProps {
		format?: AdUnitFormat
		headline: string
		description?: string
		imageUrl?: string
		href: string
		advertiser?: string
		/** Badge label shown on the ad. Defaults to 'Anuncio'. */
		label?: string
		class?: string
	}

	let {
		format = 'native',
		headline,
		description,
		imageUrl,
		href,
		advertiser,
		label = 'Anuncio',
		class: className = ''
	}: AdUnitProps = $props()

	const hasImage = $derived(!!imageUrl)
</script>

{#snippet adBadge()}
	<span
		class="inline-flex items-center rounded border border-amber-400/60 bg-amber-50 px-1 py-0.5 text-[10px] font-medium leading-none text-amber-700 dark:border-amber-400/40 dark:bg-amber-400/10 dark:text-amber-400"
	>
		{label}
	</span>
{/snippet}

<a
	{href}
	target="_blank"
	rel="noopener sponsored"
	class={[
		'group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
		(format === 'vertical') && 'max-w-xs',
		className
	]}
>
	{#if format === 'search'}
		<!-- Google-ads style: title brand, advertiser breadcrumb, description -->
		<div class="flex min-w-0 gap-2 py-2">
			<div class="min-w-0 flex-1">
				<div class="mb-0.5 flex items-center gap-1.5">
					{@render adBadge()}
					{#if advertiser}
						<span class="truncate text-xs text-muted">{advertiser}</span>
					{/if}
				</div>
				<p class="truncate text-lg font-medium leading-snug text-brand-600 group-hover:underline">
					{headline}
				</p>
				{#if description}
					<p class="mt-1 line-clamp-2 text-sm text-secondary">{description}</p>
				{/if}
			</div>
		</div>
	{:else if format === 'native'}
		<!-- Tile-like row with image thumb -->
		<div
			class="flex items-start gap-3 overflow-hidden rounded-xl border border-border bg-surface-elevated p-3 transition-colors hover:border-border-strong hover:bg-surface-overlay/70"
		>
			{#if hasImage}
				<div class="h-16 w-16 shrink-0 overflow-hidden rounded-lg">
					<Image src={imageUrl!} alt={headline} class="h-16 w-16" />
				</div>
			{/if}
			<div class="min-w-0 flex-1">
				<div class="mb-1 flex items-center gap-1.5">
					{@render adBadge()}
					{#if advertiser}
						<span class="truncate text-xs text-muted">{advertiser}</span>
					{/if}
				</div>
				<p class="truncate text-sm font-semibold leading-snug text-primary group-hover:underline">
					{headline}
				</p>
				{#if description}
					<p class="mt-0.5 line-clamp-2 text-xs text-secondary">{description}</p>
				{/if}
			</div>
		</div>
	{:else if format === 'vertical'}
		<!-- Stacked image on top, text below -->
		<div
			class="overflow-hidden rounded-xl border border-border bg-surface-elevated transition-colors hover:border-border-strong"
		>
			{#if hasImage}
				<Image src={imageUrl!} alt={headline} aspectRatio="4/3" class="w-full" />
			{:else}
				<div class="h-32 w-full bg-surface-overlay"></div>
			{/if}
			<div class="p-3">
				<div class="mb-1 flex items-center gap-1.5">
					{@render adBadge()}
					{#if advertiser}
						<span class="truncate text-xs text-muted">{advertiser}</span>
					{/if}
				</div>
				<p class="text-sm font-semibold leading-snug text-primary group-hover:underline">
					{headline}
				</p>
				{#if description}
					<p class="mt-1 text-xs text-secondary">{description}</p>
				{/if}
			</div>
		</div>
	{:else}
		<!-- banner / horizontal: image left or top strip + headline + description, wide -->
		<div
			class={[
				'flex overflow-hidden rounded-xl border border-border bg-surface-elevated transition-colors hover:border-border-strong',
				format === 'banner' ? 'flex-col' : 'flex-row items-center'
			]}
		>
			{#if hasImage}
				{#if format === 'banner'}
					<Image src={imageUrl!} alt={headline} aspectRatio="21/4" class="w-full" />
				{:else}
					<div class="h-full w-36 shrink-0">
						<Image src={imageUrl!} alt={headline} aspectRatio="1/1" class="h-full w-full" />
					</div>
				{/if}
			{/if}
			<div class={['flex-1 p-3', format === 'banner' && hasImage ? 'pt-2' : '']}>
				<div class="mb-1 flex items-center gap-1.5">
					{@render adBadge()}
					{#if advertiser}
						<span class="truncate text-xs text-muted">{advertiser}</span>
					{/if}
				</div>
				<p class="text-sm font-semibold leading-snug text-primary group-hover:underline">
					{headline}
				</p>
				{#if description}
					<p class="mt-0.5 line-clamp-2 text-xs text-secondary">{description}</p>
				{/if}
			</div>
		</div>
	{/if}
</a>
