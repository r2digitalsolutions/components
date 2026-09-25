<script lang="ts">
	import type { Map as LeafletMap, Marker } from 'leaflet';
	import { untrack } from 'svelte';

	let {
		lat,
		lng,
		label = '',
		zoom = 14,
		href,
		linkLabel = 'OpenStreetMap',
		class: className = '',
		heightClass = 'h-56 sm:h-64'
	}: {
		lat: number;
		lng: number;
		label?: string;
		zoom?: number;
		href?: string;
		linkLabel?: string;
		class?: string;
		heightClass?: string;
	} = $props();

	let mapEl: HTMLDivElement | undefined = $state();
	let mapReady = $state(false);
	let dark = $state(false);

	/** Leaflet handles are non-reactive; sync via mapReady + props. */
	let map: LeafletMap | null = null;
	let marker: Marker | null = null;
	let leaflet: typeof import('leaflet') | null = null;

	const OSM_TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
	const invertTiles = $derived(dark);

	$effect(() => {
		if (typeof document === 'undefined') return;
		const root = document.documentElement;
		const sync = () => {
			dark = root.classList.contains('dark');
		};
		sync();
		const observer = new MutationObserver(sync);
		observer.observe(root, { attributes: true, attributeFilter: ['class'] });
		return () => observer.disconnect();
	});

	function syncView(m: LeafletMap, nextLat: number, nextLng: number, nextZoom: number) {
		const latLng: [number, number] = [nextLat, nextLng];
		marker?.setLatLng(latLng);
		m.setView(latLng, nextZoom);
		requestAnimationFrame(() => m.invalidateSize());
	}

	$effect(() => {
		const el = mapEl;
		if (!el) return;

		let cancelled = false;
		let instance: LeafletMap | null = null;
		let resizeObserver: ResizeObserver | null = null;

		(async () => {
			const mod = await import('leaflet');
			const L = ((mod as { default?: typeof import('leaflet') }).default ??
				mod) as typeof import('leaflet');
			await import('leaflet/dist/leaflet.css');
			if (cancelled) return;

			// Vite does not resolve Leaflet's default icon URLs from CSS; import assets.
			const [iconRetina, icon, shadow] = await Promise.all([
				import('leaflet/dist/images/marker-icon-2x.png'),
				import('leaflet/dist/images/marker-icon.png'),
				import('leaflet/dist/images/marker-shadow.png')
			]);
			delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
			L.Icon.Default.mergeOptions({
				iconRetinaUrl: iconRetina.default,
				iconUrl: icon.default,
				shadowUrl: shadow.default
			});

			const initial = untrack(() => ({ lat, lng, zoom }));
			instance = L.map(el, { scrollWheelZoom: false }).setView(
				[initial.lat, initial.lng],
				initial.zoom
			);
			L.tileLayer(OSM_TILES, {
				maxZoom: 19,
				attribution: '&copy; OpenStreetMap contributors'
			}).addTo(instance);

			marker = L.marker([initial.lat, initial.lng]).addTo(instance);
			leaflet = L;
			map = instance;
			mapReady = true;

			resizeObserver = new ResizeObserver(() => {
				instance?.invalidateSize({ animate: false });
			});
			resizeObserver.observe(el);
			requestAnimationFrame(() => instance?.invalidateSize({ animate: false }));
		})();

		return () => {
			cancelled = true;
			resizeObserver?.disconnect();
			mapReady = false;
			instance?.remove();
			map = null;
			marker = null;
			leaflet = null;
		};
	});

	$effect(() => {
		const L = leaflet;
		const m = map;
		if (!mapReady || !L || !m) return;
		syncView(m, lat, lng, zoom);
	});
</script>

<div
	class="r2-location-map border-border overflow-hidden rounded-2xl border bg-surface {className}"
	data-dark={dark ? 'true' : 'false'}
	data-tile-invert={invertTiles ? 'true' : 'false'}
>
	<div class="relative w-full {heightClass}">
		<div
			bind:this={mapEl}
			class="r2-location-map-canvas absolute inset-0 h-full w-full"
			aria-label={label || 'Map'}
		></div>
	</div>
	{#if label}
		<p class="text-muted px-3 py-2 text-xs">{label}</p>
	{/if}
	{#if href}
		<p class="border-border border-t px-3 py-2">
			<a
				{href}
				target="_blank"
				rel="noopener noreferrer"
				class="text-muted hover:text-primary text-xs underline-offset-2 hover:underline"
			>
				{linkLabel}
			</a>
		</p>
	{/if}
</div>

<style>
	:global(.r2-location-map-canvas.leaflet-container) {
		height: 100%;
		width: 100%;
		z-index: 0;
		font: inherit;
		background: transparent;
	}

	:global(.r2-location-map[data-tile-invert='true'] .leaflet-container) {
		background: #0a0a0a;
	}

	:global(.r2-location-map[data-tile-invert='true'] .leaflet-tile-pane) {
		filter: invert(1) hue-rotate(180deg) brightness(0.92) contrast(0.95);
	}

	:global(.r2-location-map[data-dark='true'] .leaflet-control-attribution) {
		background: rgb(24 24 27 / 0.8);
		color: #a3a3a3;
	}
</style>
