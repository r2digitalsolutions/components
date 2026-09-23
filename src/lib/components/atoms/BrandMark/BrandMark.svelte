<script lang="ts">
	import type { Snippet } from 'svelte';

	export type BrandMarkSize = 'sm' | 'md' | 'lg' | 'xl';

	interface BrandMarkProps {
		/** 1–2 letter mark, or provide children / logoSrc for a custom glyph */
		mark?: string;
		name?: string;
		/** Official logo image URL (SVG/PNG). Replaces initials / children. */
		logoSrc?: string;
		/** Glyph is a single color. Painted with currentColor so it follows light/dark. */
		monochrome?: boolean;
		/** When set, the mark (and name) link here — e.g. `/` on auth pages. */
		href?: string;
		size?: BrandMarkSize;
		showName?: boolean;
		class?: string;
		children?: Snippet;
	}

	const {
		mark,
		name = 'Brand',
		logoSrc,
		monochrome = false,
		href,
		size = 'md',
		showName = false,
		class: className = '',
		children
	}: BrandMarkProps = $props();

	const initials = $derived(
		(mark ?? name)
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((w) => w[0]?.toUpperCase() ?? '')
			.join('') || 'B'
	);

	const box: Record<BrandMarkSize, string> = {
		sm: 'h-7 w-7 text-[10px] rounded-lg',
		md: 'h-9 w-9 text-xs rounded-xl',
		lg: 'h-11 w-11 text-sm rounded-xl',
		xl: 'h-14 w-14 text-base rounded-2xl'
	};

	const nameSize: Record<BrandMarkSize, string> = {
		sm: 'text-sm',
		md: 'text-base',
		lg: 'text-lg',
		xl: 'text-xl'
	};

	const rootClass = $derived([
		'inline-flex items-center gap-2.5',
		href && 'no-underline text-inherit',
		className
	]);

	const paintMono = $derived(Boolean(logoSrc && monochrome));
	const monoMask = $derived(paintMono && logoSrc ? `url("${logoSrc}")` : undefined);
</script>

{#snippet markBody()}
	<span
		class={[
			'inline-flex shrink-0 items-center justify-center',
			paintMono && 'brand-mark-mono bg-current',
			logoSrc && !paintMono && 'bg-white shadow-sm overflow-hidden',
			!logoSrc && 'bg-brand-500 font-bold tracking-tight text-white shadow-sm',
			box[size]
		]}
		style:mask-image={monoMask}
		style:-webkit-mask-image={monoMask}
		aria-hidden={showName || !!name}
	>
		{#if logoSrc && !paintMono}
			<img src={logoSrc} alt="" class="h-[78%] w-[78%] object-contain" />
		{:else if !paintMono && children}
			{@render children()}
		{:else if !paintMono}
			{initials}
		{/if}
	</span>
	{#if showName}
		<span class={['font-semibold tracking-tight text-primary', nameSize[size]]}>{name}</span>
	{/if}
	{#if !showName}
		<span class="sr-only">{name}</span>
	{/if}
{/snippet}

{#if href}
	<a {href} class={rootClass} aria-label={name}>
		{@render markBody()}
	</a>
{:else}
	<span class={rootClass}>
		{@render markBody()}
	</span>
{/if}

<style>
	.brand-mark-mono {
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-position: center;
		mask-position: center;
		-webkit-mask-size: contain;
		mask-size: contain;
	}
</style>
