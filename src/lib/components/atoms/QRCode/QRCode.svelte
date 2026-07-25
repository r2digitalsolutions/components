<script lang="ts">
	import type { Snippet } from 'svelte';
	import { encodeQR, qrToSvgPath, punchLogoHole } from '$lib/utils/qr.js';

	interface QRCodeProps {
		value?: string;
		size?: number;
		/** Quiet zone / padding around modules (in modules) */
		margin?: number;
		/** Module (dark) color */
		fgColor?: string;
		/** Background color */
		bgColor?: string;
		/** Rounded outer frame */
		rounded?: boolean;
		/** Soft border around the card */
		bordered?: boolean;
		/** Image URL for center logo */
		logoSrc?: string;
		/** Accessible logo alt */
		logoAlt?: string;
		/**
		 * Logo box as % of QR size (default 20).
		 * Kept modest so error-correction can still recover.
		 */
		logoSize?: number;
		/** Custom center content (overrides logoSrc) */
		logo?: Snippet;
		class?: string;
		title?: string;
	}

	let {
		value = 'https://r2digisolutions.com',
		size = 180,
		margin = 2,
		fgColor = '#18181b',
		bgColor = '#ffffff',
		rounded = true,
		bordered = true,
		logoSrc,
		logoAlt = 'Logo',
		logoSize = 20,
		logo,
		class: className = '',
		title = 'QR code'
	}: QRCodeProps = $props();

	const hasLogo = $derived(Boolean(logo) || Boolean(logoSrc));
	/** Cap logo footprint so scanners stay reliable */
	const safeLogoPct = $derived(Math.min(28, Math.max(14, logoSize)));

	const matrix = $derived.by(() => {
		const raw = encodeQR(value || ' ');
		if (!hasLogo) return raw;
		// Hole ≈ logo size + small padding (not a large empty square)
		const holeRatio = (safeLogoPct / 100) * 1.12;
		return punchLogoHole(raw, holeRatio);
	});

	const modules = $derived(matrix.length);
	const path = $derived(qrToSvgPath(matrix));
	const view = $derived(modules + margin * 2);
	const logoPx = $derived(Math.round((size * safeLogoPct) / 100));
</script>

<div
	class={[
		'relative inline-flex shrink-0 items-center justify-center overflow-hidden',
		rounded && 'rounded-2xl',
		bordered && 'ring-1 ring-border shadow-sm',
		className
	]}
	style:width="{size}px"
	style:height="{size}px"
	style:background={bgColor}
	role="img"
	aria-label={title}
>
	<svg
		width={size}
		height={size}
		viewBox={`0 0 ${view} ${view}`}
		class="block"
		aria-hidden="true"
	>
		<title>{title}</title>
		<rect width={view} height={view} fill={bgColor} />
		<g transform={`translate(${margin}, ${margin})`} fill={fgColor}>
			<path d={path} />
		</g>
	</svg>

	{#if hasLogo}
		<div
			class="absolute flex items-center justify-center rounded-md p-0.5"
			style:width="{logoPx}px"
			style:height="{logoPx}px"
			style:background={bgColor}
		>
			{#if logo}
				{@render logo()}
			{:else if logoSrc}
				<img src={logoSrc} alt={logoAlt} class="h-full w-full rounded-md object-contain" />
			{/if}
		</div>
	{/if}
</div>
