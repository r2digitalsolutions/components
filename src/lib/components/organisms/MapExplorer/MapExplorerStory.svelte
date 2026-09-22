<script lang="ts">
	import MapExplorer, {
		type MapExplorerCluster,
		type MapExplorerFilter,
		type MapExplorerItem
	} from './MapExplorer.svelte';

	const items: MapExplorerItem[] = [
		{
			id: '1',
			lat: 40.42,
			lng: -3.7,
			title: 'Noche de indie en Malasaña',
			subtitle: 'Sala El Sol · Madrid',
			meta: 'Vie 21:00',
			priceLabel: 'Desde 18 €',
			badge: 'Madrid',
			chip: 'Conciertos',
			href: '#madrid'
		},
		{
			id: '2',
			lat: 41.387,
			lng: 2.168,
			title: 'Jazz al parque',
			subtitle: 'Parc de la Ciutadella · Barcelona',
			meta: 'Sáb 19:30',
			priceLabel: 'Gratis',
			badge: 'Barcelona',
			chip: 'Festivales',
			href: '#barcelona'
		},
		{
			id: '3',
			lat: 39.47,
			lng: -0.376,
			title: 'Teatro en el centro',
			subtitle: 'Teatre Principal · Valencia',
			meta: 'Dom 18:00',
			priceLabel: 'Desde 22 €',
			badge: 'Valencia',
			chip: 'Teatro',
			href: '#valencia'
		},
		{
			id: '4',
			lat: 37.389,
			lng: -5.984,
			title: 'Final de copa',
			subtitle: 'Estadio Benito Villamarín · Sevilla',
			meta: 'Sáb 21:00',
			priceLabel: 'Desde 35 €',
			badge: 'Sevilla',
			chip: 'Deporte',
			href: '#sevilla'
		}
	];

	const clusters: MapExplorerCluster[] = [
		{ id: 'c-north', lat: 43.26, lng: -2.93, count: 128 },
		{ id: 'c-galicia', lat: 42.88, lng: -8.54, count: 64 }
	];

	let query = $state('');
	let category = $state('');
	let when = $state('');

	const filters = $derived<MapExplorerFilter[]>([
		{
			id: 'category',
			label: 'Category',
			value: category,
			options: [
				{ value: '', label: 'All categories' },
				{ value: 'concerts', label: 'Concerts' },
				{ value: 'festivals', label: 'Festivals' },
				{ value: 'theatre', label: 'Theatre' },
				{ value: 'sports', label: 'Sports' }
			]
		},
		{
			id: 'when',
			label: 'When',
			type: 'chips',
			value: when,
			options: [
				{ value: 'today', label: 'Today' },
				{ value: 'weekend', label: 'Weekend' },
				{ value: 'week', label: 'This week' }
			]
		}
	]);

	const visible = $derived.by(() => {
		const q = query.trim().toLowerCase();
		return items.filter((item) => {
			if (category && !item.chip?.toLowerCase().includes(category.slice(0, 4))) return false;
			if (q && !`${item.title} ${item.subtitle}`.toLowerCase().includes(q)) return false;
			return true;
		});
	});
</script>

<div class="h-[80vh]">
	<MapExplorer
		items={visible}
		{clusters}
		{filters}
		bind:query
		title="Events in Spain"
		description="Airbnb-style explorer: map, clusters, filters and a detail drawer."
		total={visible.length + 192}
		locateOnLoad={false}
		onfilterchange={(id, value) => {
			if (id === 'category') category = value;
			if (id === 'when') when = value;
		}}
		onclearfilters={() => {
			query = '';
			category = '';
			when = '';
		}}
	/>
</div>
