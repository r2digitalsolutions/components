<script lang="ts">
	import ImageGallery from './ImageGallery.svelte';
	import type { GalleryImage } from './ImageGallery.svelte';

	interface Props {
		variant?: 'default' | 'featured' | 'masonry';
	}

	let { variant = 'default' }: Props = $props();

	const palettes = [
		['#0f172a', '#334155', '#94a3b8'],
		['#0c4a6e', '#0284c7', '#7dd3fc'],
		['#064e3b', '#059669', '#6ee7b7'],
		['#7c2d12', '#ea580c', '#fdba74'],
		['#4c1d95', '#7c3aed', '#c4b5fd'],
		['#881337', '#e11d48', '#fda4af'],
		['#1e3a8a', '#2563eb', '#93c5fd'],
		['#365314', '#65a30d', '#bef264']
	];

	function svgSrc(label: string, i: number, w = 900, h = 900) {
		const [a, b, c] = palettes[i % palettes.length];
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
			<defs>
				<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0%" stop-color="${a}"/>
					<stop offset="55%" stop-color="${b}"/>
					<stop offset="100%" stop-color="${c}"/>
				</linearGradient>
			</defs>
			<rect width="100%" height="100%" fill="url(#g)"/>
			<circle cx="${w * 0.72}" cy="${h * 0.28}" r="${Math.min(w, h) * 0.18}" fill="rgba(255,255,255,0.12)"/>
			<text x="48" y="${h - 56}" fill="rgba(255,255,255,0.92)" font-family="system-ui,sans-serif" font-size="36" font-weight="600">${label}</text>
		</svg>`;
		return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
	}

	const labels = [
		'Coast at dusk',
		'Mountain trail',
		'City lights',
		'Forest path',
		'Desert dunes',
		'Lake reflection',
		'Cliff overlook',
		'Harbor morning'
	];

	const images: GalleryImage[] = labels.map((label, i) => ({
		id: String(i + 1),
		src: svgSrc(label, i, 900, i === 6 ? 1100 : i === 7 ? 700 : 900),
		alt: label,
		caption: label
	}));
</script>

<div class="w-full">
	{#if variant === 'featured'}
		<ImageGallery {images} layout="featured" showCaptions cols={4} class="w-full" />
	{:else if variant === 'masonry'}
		<ImageGallery {images} layout="masonry" showCaptions class="w-full" />
	{:else}
		<ImageGallery {images} cols={3} showCaptions class="w-full" />
	{/if}
</div>
