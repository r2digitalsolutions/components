<script lang="ts">
	import type { Snippet } from 'svelte';
	import Filter from '@lucide/svelte/icons/filter';
	import List from '@lucide/svelte/icons/list';
	import LayoutGrid from '@lucide/svelte/icons/layout-grid';
	import LayoutList from '@lucide/svelte/icons/layout-list';
	import LocateFixed from '@lucide/svelte/icons/locate-fixed';
	import MapIcon from '@lucide/svelte/icons/map';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import CountBadge from '$lib/components/atoms/CountBadge/CountBadge.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Image from '$lib/components/atoms/Image/Image.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import FilterChips from '$lib/components/molecules/FilterChips/FilterChips.svelte';
	import SearchInput from '$lib/components/molecules/SearchInput/SearchInput.svelte';
	import Select from '$lib/components/molecules/Select/Select.svelte';
	import type { SelectOption } from '$lib/components/molecules/Select/Select.svelte';
	import Drawer from '$lib/components/organisms/Drawer/Drawer.svelte';
	import type { Map as LeafletMap, TileLayer } from 'leaflet';

	export type MapExplorerBounds = {
		south: number;
		west: number;
		north: number;
		east: number;
	};

	export type MapExplorerItem = {
		id: string;
		lat: number;
		lng: number;
		title: string;
		subtitle?: string;
		meta?: string;
		priceLabel?: string;
		imageUrl?: string | null;
		href?: string;
		badge?: string;
		chip?: string;
	};

	export type MapExplorerCluster = {
		id: string;
		lat: number;
		lng: number;
		count: number;
	};

	export type MapExplorerFilter = {
		id: string;
		label: string;
		placeholder?: string;
		value: string;
		options: SelectOption[];
		type?: 'select' | 'chips';
		searchable?: boolean;
	};

	export type MapExplorerPanel = 'list' | 'map';
	export type MapExplorerListView = 'list' | 'grid';
	export type MapExplorerCardContext = {
		select: () => void;
		selected: boolean;
		layout: MapExplorerListView;
	};

	interface MapExplorerProps {
		items?: MapExplorerItem[];
		pins?: MapExplorerItem[];
		clusters?: MapExplorerCluster[];
		selectedId?: string | null;
		query?: string;
		filters?: MapExplorerFilter[];
		total?: number;
		loading?: boolean;
		title?: string;
		description?: string;
		resultLabel?: string;
		searchPlaceholder?: string;
		filtersTitle?: string;
		filtersHint?: string;
		clearFiltersLabel?: string;
		searchAreaLabel?: string;
		locateLabel?: string;
		listLabel?: string;
		mapLabel?: string;
		emptyTitle?: string;
		emptyDescription?: string;
		detailCtaLabel?: string;
		listViewLabel?: string;
		gridViewLabel?: string;
		listView?: MapExplorerListView;
		locateOnLoad?: boolean;
		showSearchArea?: boolean;
		fitToken?: string;
		defaultCenter?: [number, number];
		defaultZoom?: number;
		tileUrl?: string;
		darkTileUrl?: string;
		tileAttribution?: string;
		class?: string;
		card?: Snippet<[MapExplorerItem, MapExplorerCardContext]>;
		detail?: Snippet<[MapExplorerItem]>;
		emptyAction?: Snippet;
		onsearch?: (query: string) => void;
		onfilterchange?: (id: string, value: string) => void;
		onclearfilters?: () => void;
		onselect?: (item: MapExplorerItem | null) => void;
		onboundschange?: (bounds: MapExplorerBounds, zoom: number) => void;
		onsearcharea?: (bounds: MapExplorerBounds, zoom: number) => void;
		onclusterclick?: (cluster: MapExplorerCluster) => void;
		onlocate?: (coords: { lat: number; lng: number }) => void;
	}

	let {
		items = [],
		pins,
		clusters = [],
		selectedId = $bindable<string | null>(null),
		query = $bindable(''),
		filters = [],
		total = 0,
		loading = false,
		title = 'Explore',
		description,
		resultLabel,
		searchPlaceholder = 'Search…',
		filtersTitle = 'Filters',
		filtersHint = 'Narrow the map and list.',
		clearFiltersLabel = 'Clear filters',
		searchAreaLabel = 'Search this area',
		locateLabel = 'Near me',
		listLabel = 'List',
		mapLabel = 'Map',
		emptyTitle = 'Nothing here yet',
		emptyDescription = 'Try another area or clear filters.',
		detailCtaLabel = 'View',
		listViewLabel = 'List',
		gridViewLabel = 'Grid',
		listView = $bindable<MapExplorerListView>('list'),
		locateOnLoad = true,
		showSearchArea = true,
		fitToken = '',
		defaultCenter = [40.4168, -3.7038],
		defaultZoom = 6,
		tileUrl = '',
		darkTileUrl = '',
		tileAttribution = '&copy; OpenStreetMap contributors',
		class: className = '',
		card,
		detail,
		emptyAction,
		onsearch,
		onfilterchange,
		onclearfilters,
		onselect,
		onboundschange,
		onsearcharea,
		onclusterclick,
		onlocate
	}: MapExplorerProps = $props();

	const OSM_TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

	let panel = $state<MapExplorerPanel>('map');
	let filtersOpen = $state(false);
	let searchAreaVisible = $state(false);
	let locating = $state(false);
	let mapEl = $state<HTMLElement | undefined>(undefined);
	let listEl = $state<HTMLElement | undefined>(undefined);
	let map = $state.raw<LeafletMap | null>(null);
	let leaflet = $state.raw<typeof import('leaflet') | null>(null);
	let tileLayer: TileLayer | null = null;
	let pinGroup: unknown = null;
	let clusterLayer: unknown = null;
	let dark = $state(false);
	let skipNextMove = false;
	let lastFitToken = '';
	let boundsTimer: ReturnType<typeof setTimeout> | null = null;

	const shown = $derived(items.length);
	const mapPins = $derived(pins ?? items);
	const resultsText = $derived(
		resultLabel ?? (total > shown ? `${shown} / ${total}` : String(total || shown))
	);
	const activeFilterCount = $derived(filters.filter((f) => Boolean(f.value)).length);
	const selected = $derived(
		items.find((item) => item.id === selectedId) ??
			mapPins.find((item) => item.id === selectedId) ??
			null
	);
	let detailOpen = $state(false);
	const activeTileUrl = $derived(dark && darkTileUrl ? darkTileUrl : tileUrl || OSM_TILES);
	const invertTiles = $derived(dark && !darkTileUrl);

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

	function currentBounds(instance: LeafletMap): MapExplorerBounds {
		const b = instance.getBounds();
		return {
			south: b.getSouth(),
			west: b.getWest(),
			north: b.getNorth(),
			east: b.getEast()
		};
	}

	function emitBounds(instance: LeafletMap, viaSearchArea = false) {
		const bounds = currentBounds(instance);
		const zoom = instance.getZoom();
		if (viaSearchArea) onsearcharea?.(bounds, zoom);
		else onboundschange?.(bounds, zoom);
	}

	function scheduleBounds(instance: LeafletMap) {
		if (skipNextMove) {
			skipNextMove = false;
			return;
		}
		if (showSearchArea) searchAreaVisible = true;
		if (boundsTimer) clearTimeout(boundsTimer);
		boundsTimer = setTimeout(() => emitBounds(instance), 280);
	}

	function escapeHtml(value: string) {
		return value
			.replace(/&/g, '&amp;')
			.replace(/"/g, '&quot;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
	}

	function pinHtml(item: MapExplorerItem, selectedPin: boolean) {
		const label = escapeHtml(item.priceLabel || item.badge || item.title.slice(0, 18));
		const selectedClass = selectedPin ? ' is-selected' : '';
		return `<div class="r2-map-pin${selectedClass}"><span class="r2-map-pin-label">${label}</span><span class="r2-map-pin-tip"></span></div>`;
	}

	function clusterHtml(count: number) {
		const size = count >= 100 ? 'lg' : count >= 20 ? 'md' : 'sm';
		return `<div class="r2-map-cluster r2-map-cluster-${size}">${count}</div>`;
	}

	function selectItem(item: MapExplorerItem) {
		selectedId = item.id;
		detailOpen = true;
		onselect?.(item);
		const row = listEl?.querySelector(`[data-map-item="${item.id}"]`);
		row?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
	}

	function closeDetail() {
		selectedId = null;
		detailOpen = false;
		onselect?.(null);
	}

	// Bounds/list refresh can drop the open item — close instead of an empty shell.
	$effect(() => {
		if (detailOpen && selectedId != null && !selected) {
			closeDetail();
		}
	});

	function applyQuery() {
		onsearch?.(query);
	}

	function resetView() {
		selectedId = null;
		detailOpen = false;
		filtersOpen = false;
		searchAreaVisible = false;
		lastFitToken = '';
		if (boundsTimer) {
			clearTimeout(boundsTimer);
			boundsTimer = null;
		}
		const instance = map;
		if (!instance) return;
		skipNextMove = true;
		instance.setView(defaultCenter, defaultZoom, { animate: false });
		emitBounds(instance);
	}

	function searchVisibleArea() {
		const instance = map;
		if (!instance) return;
		searchAreaVisible = false;
		emitBounds(instance, true);
		onboundschange?.(currentBounds(instance), instance.getZoom());
	}

	async function locate() {
		if (typeof navigator === 'undefined' || !navigator.geolocation) return;
		locating = true;
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				locating = false;
				const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
				const instance = map;
				if (instance) {
					skipNextMove = true;
					searchAreaVisible = false;
					instance.flyTo([coords.lat, coords.lng], Math.max(instance.getZoom(), 12), {
						duration: 0.7
					});
					instance.once('moveend', () => emitBounds(instance));
				}
				onlocate?.(coords);
			},
			() => {
				locating = false;
			},
			{ enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 }
		);
	}

	$effect(() => {
		const el = mapEl;
		if (!el) return;

		let cancelled = false;
		let instance: LeafletMap | null = null;

		(async () => {
			await import('leaflet/dist/leaflet.css');
			await import('leaflet.markercluster/dist/MarkerCluster.css');
			await import('leaflet.markercluster/dist/MarkerCluster.Default.css');
			const mod = await import('leaflet');
			const L = ((mod as { default?: typeof import('leaflet') }).default ??
				mod) as typeof import('leaflet');
			(window as unknown as { L: typeof L }).L = L;
			await import('leaflet.markercluster');
			if (cancelled) return;

			instance = L.map(el, { zoomControl: false, attributionControl: true }).setView(
				defaultCenter,
				defaultZoom
			);
			L.control.zoom({ position: 'bottomright' }).addTo(instance);
			instance.on('moveend', () => scheduleBounds(instance!));
			leaflet = L;
			map = instance;
			skipNextMove = true;
			requestAnimationFrame(() => {
				instance?.invalidateSize();
				if (instance) emitBounds(instance);
			});
			if (locateOnLoad) void locate();
		})();

		return () => {
			cancelled = true;
			if (boundsTimer) clearTimeout(boundsTimer);
			instance?.remove();
			map = null;
			leaflet = null;
			tileLayer = null;
			pinGroup = null;
			clusterLayer = null;
		};
	});

	$effect(() => {
		const instance = map;
		const L = leaflet;
		const url = activeTileUrl;
		if (!instance || !L) return;
		const next = L.tileLayer(url, {
			maxZoom: 19,
			attribution: tileAttribution
		});
		next.addTo(instance);
		tileLayer?.remove();
		tileLayer = next;
	});

	$effect(() => {
		const instance = map;
		const L = leaflet;
		const pins = mapPins;
		const groups = clusters;
		const currentId = selectedId;
		if (!instance || !L) return;

		if (pinGroup) {
			instance.removeLayer(pinGroup as never);
			pinGroup = null;
		}
		if (clusterLayer) {
			instance.removeLayer(clusterLayer as never);
			clusterLayer = null;
		}

		const ClusterGroup = (
			L as typeof L & { markerClusterGroup?: (opts: Record<string, unknown>) => unknown }
		).markerClusterGroup;
		if (pins.length && ClusterGroup) {
			const group = ClusterGroup({
				showCoverageOnHover: false,
				maxClusterRadius: 48,
				spiderfyOnMaxZoom: true
			}) as { addLayer: (layer: unknown) => void };
			for (const item of pins) {
				if (!Number.isFinite(item.lat) || !Number.isFinite(item.lng)) continue;
				const icon = L.divIcon({
					className: 'r2-map-pin-wrap',
					html: pinHtml(item, item.id === currentId),
					iconSize: [1, 1],
					iconAnchor: [36, 36]
				});
				const marker = L.marker([item.lat, item.lng], { icon });
				marker.on('click', () => selectItem(item));
				group.addLayer(marker);
			}
			instance.addLayer(group as never);
			pinGroup = group;
		}

		if (groups.length) {
			const layer = L.layerGroup();
			for (const cluster of groups) {
				if (!Number.isFinite(cluster.lat) || !Number.isFinite(cluster.lng)) continue;
				const icon = L.divIcon({
					className: 'r2-map-pin-wrap',
					html: clusterHtml(cluster.count),
					iconSize: [1, 1],
					iconAnchor: [22, 22]
				});
				const marker = L.marker([cluster.lat, cluster.lng], { icon, zIndexOffset: 400 });
				marker.on('click', () => {
					onclusterclick?.(cluster);
					skipNextMove = true;
					instance.setView([cluster.lat, cluster.lng], Math.min(instance.getZoom() + 2, 16));
					instance.once('moveend', () => emitBounds(instance));
				});
				layer.addLayer(marker);
			}
			layer.addTo(instance);
			clusterLayer = layer;
		}

		if (fitToken && fitToken !== lastFitToken) {
			lastFitToken = fitToken;
			const pts: [number, number][] = [
				...pins.map((p) => [p.lat, p.lng] as [number, number]),
				...groups.map((c) => [c.lat, c.lng] as [number, number])
			].filter(([lat, lng]) => Number.isFinite(lat) && Number.isFinite(lng));
			if (pts.length === 1) {
				skipNextMove = true;
				instance.setView(pts[0], 12);
			} else if (pts.length > 1) {
				skipNextMove = true;
				instance.fitBounds(pts, { padding: [48, 48], maxZoom: 12 });
			}
		}

		requestAnimationFrame(() => instance.invalidateSize());
	});
</script>

<div
	class={['r2-map-explorer min-h-0 bg-surface flex flex-1 flex-col', className]}
	data-dark={dark ? 'true' : undefined}
	data-tile-invert={invertTiles ? 'true' : undefined}
>
	<div
		class="border-border bg-surface/95 gap-3 px-4 py-3 backdrop-blur-md lg:flex-row lg:items-center lg:justify-between z-20 flex flex-col border-b"
	>
		<div class="min-w-0">
			<h1 class="text-primary text-lg font-semibold tracking-tight">{title}</h1>
			{#if description}
				<Text size="sm" tone="muted">{description}</Text>
			{/if}
		</div>
		<div class="min-w-0 gap-2 flex flex-1 flex-wrap items-center justify-end">
			<div class="min-w-48 sm:max-w-sm flex-1">
				<SearchInput
					placeholder={searchPlaceholder}
					size="sm"
					bind:value={query}
					onsubmit={applyQuery}
				/>
			</div>
			<Button variant="secondary" size="sm" onclick={() => (filtersOpen = true)} class="relative">
				<Filter class="h-4 w-4" />
				{filtersTitle}
				{#if activeFilterCount}
					<CountBadge count={activeFilterCount} />
				{/if}
			</Button>
			<div class="border-border bg-surface-elevated rounded-lg p-0.5 flex border">
				<IconButton
					label={listViewLabel}
					size="sm"
					variant={listView === 'list' ? 'secondary' : 'ghost'}
					onclick={() => (listView = 'list')}
				>
					<LayoutList class="h-4 w-4" />
				</IconButton>
				<IconButton
					label={gridViewLabel}
					size="sm"
					variant={listView === 'grid' ? 'secondary' : 'ghost'}
					onclick={() => (listView = 'grid')}
				>
					<LayoutGrid class="h-4 w-4" />
				</IconButton>
			</div>
			<Button variant="secondary" size="sm" loading={locating} onclick={() => void locate()}>
				<LocateFixed class="h-4 w-4" />
				<span class="sm:inline hidden">{locateLabel}</span>
			</Button>
			<div class="border-border bg-surface-elevated rounded-lg p-0.5 lg:hidden flex border">
				<IconButton
					label={listLabel}
					size="sm"
					variant={panel === 'list' ? 'secondary' : 'ghost'}
					onclick={() => (panel = 'list')}
				>
					<List class="h-4 w-4" />
				</IconButton>
				<IconButton
					label={mapLabel}
					size="sm"
					variant={panel === 'map' ? 'secondary' : 'ghost'}
					onclick={() => (panel = 'map')}
				>
					<MapIcon class="h-4 w-4" />
				</IconButton>
			</div>
			<Text size="sm" tone="muted" class="sm:block hidden tabular-nums">{resultsText}</Text>
		</div>
	</div>

	<div class="min-h-0 relative flex flex-1">
		<aside
			class={[
				'border-border bg-surface min-h-0 lg:flex lg:w-[26rem] xl:w-[32rem] w-full shrink-0 flex-col overflow-hidden border-r',
				panel === 'list' ? 'flex' : 'hidden'
			]}
		>
			<div
				bind:this={listEl}
				class={[
					'min-h-0 p-3 flex-1 overflow-y-auto',
					listView === 'grid' ? 'gap-3 sm:grid-cols-2 grid grid-cols-1 content-start' : 'space-y-3'
				]}
			>
				{#if items.length === 0 && !loading}
					<div class="col-span-full">
						<EmptyState title={emptyTitle} description={emptyDescription}>
							{#snippet action()}
								{#if emptyAction}
									{@render emptyAction()}
								{/if}
							{/snippet}
						</EmptyState>
					</div>
				{:else}
					{#each items as item (item.id)}
						<div data-map-item={item.id} class={listView === 'grid' ? 'min-w-0' : undefined}>
							{#if card}
								{@render card(item, {
									select: () => selectItem(item),
									selected: selectedId === item.id,
									layout: listView
								})}
							{:else}
								<Card
									hoverable
									padding="none"
									class={[
										'h-full overflow-hidden',
										selectedId === item.id && 'ring-brand-500 ring-2'
									]}
									onclick={() => selectItem(item)}
								>
									{#if listView === 'grid'}
										{#if item.imageUrl}
											<div class="h-36 w-full overflow-hidden">
												<Image
													src={item.imageUrl}
													alt={item.title}
													class="h-full w-full"
													objectFit="cover"
												/>
											</div>
										{:else}
											<div
												class="bg-brand-500/10 text-brand-700 dark:text-brand-300 h-36 text-2xl font-semibold flex items-center justify-center"
											>
												{item.title.slice(0, 1)}
											</div>
										{/if}
										<div class="space-y-1.5 p-3">
											<div class="gap-1 flex flex-wrap">
												{#if item.badge}
													<Badge size="sm">{item.badge}</Badge>
												{/if}
												{#if item.chip}
													<Badge size="sm" variant="secondary">{item.chip}</Badge>
												{/if}
											</div>
											<p class="text-primary text-sm font-semibold line-clamp-2">{item.title}</p>
											{#if item.subtitle}
												<Text size="xs" tone="muted">{item.subtitle}</Text>
											{/if}
											<div class="gap-2 flex items-center justify-between">
												{#if item.meta}
													<Text size="xs">{item.meta}</Text>
												{/if}
												{#if item.priceLabel}
													<Text size="xs" class="font-medium">{item.priceLabel}</Text>
												{/if}
											</div>
										</div>
									{:else}
										<div class="flex min-h-[7.5rem] flex-1 items-stretch overflow-hidden">
											{#if item.imageUrl}
												<div class="w-28 relative shrink-0 overflow-hidden">
													<Image
														src={item.imageUrl}
														alt={item.title}
														class="inset-0 absolute h-full w-full"
														objectFit="cover"
													/>
												</div>
											{:else}
												<div
													class="bg-brand-500/10 text-brand-700 dark:text-brand-300 w-28 text-xl font-semibold flex shrink-0 items-center justify-center"
												>
													{item.title.slice(0, 1)}
												</div>
											{/if}
											<div class="min-w-0 p-3 flex-1">
												<div class="gap-1 flex flex-wrap">
													{#if item.badge}
														<Badge size="sm">{item.badge}</Badge>
													{/if}
													{#if item.chip}
														<Badge size="sm" variant="secondary">{item.chip}</Badge>
													{/if}
												</div>
												<p class="text-primary mt-1 text-sm font-semibold line-clamp-2">
													{item.title}
												</p>
												{#if item.subtitle}
													<Text size="xs" tone="muted">{item.subtitle}</Text>
												{/if}
												<div class="mt-1 gap-2 flex items-center justify-between">
													{#if item.meta}
														<Text size="xs">{item.meta}</Text>
													{/if}
													{#if item.priceLabel}
														<Text size="xs" class="font-medium">{item.priceLabel}</Text>
													{/if}
												</div>
											</div>
										</div>
									{/if}
								</Card>
							{/if}
						</div>
					{/each}
				{/if}
			</div>
		</aside>

		<div class={['min-h-0 min-w-0 relative flex-1', panel === 'map' ? 'block' : 'lg:block hidden']}>
			<div
				bind:this={mapEl}
				class="r2-map-explorer-map bg-neutral-100 dark:bg-neutral-950 h-full min-h-[22rem] w-full"
			></div>
			{#if searchAreaVisible && showSearchArea}
				<div class="top-4 right-0 left-0 pointer-events-none absolute z-400 flex justify-center">
					<Button size="sm" class="shadow-lg pointer-events-auto" onclick={searchVisibleArea}>
						{searchAreaLabel}
					</Button>
				</div>
			{/if}
			{#if loading}
				<div
					class="bg-surface/40 top-4 right-4 px-3 py-1 text-xs font-medium backdrop-blur-md pointer-events-none absolute z-400 rounded-full"
				>
					…
				</div>
			{/if}
		</div>
	</div>
</div>

<Drawer
	bind:open={filtersOpen}
	title={filtersTitle}
	description={filtersHint}
	side="right"
	size="sm"
>
	<div class="gap-4 flex flex-col">
		<SearchInput
			label={searchPlaceholder}
			placeholder={searchPlaceholder}
			bind:value={query}
			onsubmit={applyQuery}
		/>
		{#each filters as filter (filter.id)}
			{#if filter.type === 'chips'}
				<div class="space-y-2">
					<Text size="sm" class="font-medium">{filter.label}</Text>
					<FilterChips
						items={filter.options.map((o) => ({ id: o.value, label: o.label }))}
						value={filter.value ? [filter.value] : []}
						multiple={false}
						onchange={(value) => onfilterchange?.(filter.id, value[0] ?? '')}
					/>
				</div>
			{:else}
				<Select
					label={filter.label}
					placeholder={filter.placeholder ?? filter.label}
					options={filter.options}
					value={filter.value}
					searchable={filter.searchable ?? true}
					onchange={(value) => onfilterchange?.(filter.id, value)}
				/>
			{/if}
		{/each}
	</div>
	{#snippet footer()}
		<Button
			variant="outline"
			fullWidth
			disabled={activeFilterCount === 0 && !query}
			onclick={() => {
				query = '';
				resetView();
				onclearfilters?.();
			}}
		>
			{clearFiltersLabel}
		</Button>
	{/snippet}
</Drawer>

<Drawer
	bind:open={detailOpen}
	title={selected?.title ?? ''}
	description={selected?.subtitle}
	side="right"
	size="lg"
	modal={false}
	closeOnBackdrop={false}
	blurBackdrop={false}
	onclose={closeDetail}
>
	{#if selected}
		{#if detail}
			{@render detail(selected)}
		{:else}
			<div class="space-y-4">
				{#if selected.imageUrl}
					<Image
						src={selected.imageUrl}
						alt={selected.title}
						aspectRatio="16 / 9"
						objectFit="cover"
						rounded="lg"
					/>
				{/if}
				<div class="gap-1.5 flex flex-wrap">
					{#if selected.badge}
						<Badge>{selected.badge}</Badge>
					{/if}
					{#if selected.chip}
						<Badge variant="secondary">{selected.chip}</Badge>
					{/if}
				</div>
				{#if selected.meta}
					<Text>{selected.meta}</Text>
				{/if}
				{#if selected.priceLabel}
					<p class="text-primary text-2xl font-bold">{selected.priceLabel}</p>
				{/if}
			</div>
		{/if}
	{/if}
	{#snippet footer()}
		{#if selected?.href}
			<Button href={selected.href} fullWidth>{detailCtaLabel}</Button>
		{/if}
	{/snippet}
</Drawer>

<style>
	.r2-map-explorer-map {
		height: 100%;
		min-height: 0;
	}

	:global(.r2-map-explorer-map.leaflet-container) {
		height: 100%;
		font-family: inherit;
		background: transparent;
	}

	:global(.r2-map-explorer[data-tile-invert='true'] .leaflet-container) {
		background: #0a0a0a;
	}

	:global(.r2-map-explorer[data-tile-invert='true'] .leaflet-tile-pane) {
		filter: invert(1) hue-rotate(180deg) brightness(0.92) contrast(0.95);
	}

	:global(.r2-map-explorer[data-dark='true'] .leaflet-control-zoom a) {
		background: var(--color-surface-elevated, #18181b);
		color: var(--color-primary, #e5e5e5);
		border-color: var(--color-border, #27272a);
	}

	:global(.r2-map-explorer[data-dark='true'] .leaflet-control-attribution) {
		background: rgb(24 24 27 / 0.8);
		color: #a3a3a3;
	}

	:global(.r2-map-pin-wrap) {
		background: transparent;
		border: none;
	}

	:global(.r2-map-pin) {
		display: flex;
		flex-direction: column;
		align-items: center;
		transform: translate(-50%, -100%);
		cursor: pointer;
	}

	:global(.r2-map-pin-label) {
		border-radius: 0.65rem;
		background: var(--color-brand-600, #2563eb);
		color: #fff;
		font-size: 0.75rem;
		font-weight: 700;
		line-height: 1;
		padding: 0.4rem 0.6rem;
		box-shadow: 0 8px 18px rgb(0 0 0 / 0.18);
		white-space: nowrap;
		border: 1px solid rgb(255 255 255 / 0.25);
	}

	:global(.r2-map-pin-tip) {
		width: 0;
		height: 0;
		border-left: 6px solid transparent;
		border-right: 6px solid transparent;
		border-top: 8px solid var(--color-brand-600, #2563eb);
	}

	:global(.r2-map-pin.is-selected .r2-map-pin-label) {
		background: var(--color-neutral-900, #171717);
		transform: scale(1.06);
	}

	:global(.r2-map-explorer[data-dark='true'] .r2-map-pin.is-selected .r2-map-pin-label) {
		background: #fff;
		color: #171717;
	}

	:global(.r2-map-cluster) {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		background: rgb(37 99 235 / 0.92);
		color: #fff;
		font-weight: 700;
		box-shadow: 0 8px 20px rgb(37 99 235 / 0.35);
		border: 3px solid rgb(255 255 255 / 0.85);
		transform: translate(-50%, -50%);
		cursor: pointer;
	}

	:global(.r2-map-cluster-sm) {
		width: 2.4rem;
		height: 2.4rem;
		font-size: 0.75rem;
	}

	:global(.r2-map-cluster-md) {
		width: 2.9rem;
		height: 2.9rem;
		font-size: 0.8rem;
	}

	:global(.r2-map-cluster-lg) {
		width: 3.4rem;
		height: 3.4rem;
		font-size: 0.85rem;
	}

	:global(.r2-map-explorer[data-dark='true'] .marker-cluster-small),
	:global(.r2-map-explorer[data-dark='true'] .marker-cluster-medium),
	:global(.r2-map-explorer[data-dark='true'] .marker-cluster-large) {
		background-color: rgb(59 130 246 / 0.35);
	}

	:global(.r2-map-explorer[data-dark='true'] .marker-cluster-small div),
	:global(.r2-map-explorer[data-dark='true'] .marker-cluster-medium div),
	:global(.r2-map-explorer[data-dark='true'] .marker-cluster-large div) {
		background-color: rgb(37 99 235 / 0.85);
		color: #fff;
	}
</style>
