<script lang="ts">
	import CatalogPage from './CatalogPage.svelte';
	import { createEmptyFilterState, type CatalogFilterState } from '$lib/utils/filterParams.js';
	import type { FilterFieldSchema } from '$lib/utils/filterSchema.js';

	let filters = $state<CatalogFilterState>(
		createEmptyFilterState({
			q: '',
			sort: 'relevance',
			values: {}
		})
	);

	/** Schema JSON — could come from an API; drives BuilderFilters automatically */
	const filterSchema: FilterFieldSchema[] = [
		{
			id: 'price',
			label: 'Price',
			type: 'range',
			category: 'Commerce',
			min: 0,
			max: 300,
			unit: '€'
		},
		{
			id: 'brand',
			label: 'Brand',
			type: 'checkbox',
			category: 'Commerce',
			options: [
				{ id: 'nike', label: 'Nike', count: 1 },
				{ id: 'adidas', label: 'Adidas', count: 1 },
				{ id: 'puma', label: 'Puma', count: 1 },
				{ id: 'asics', label: 'Asics', count: 1 },
				{ id: 'newbalance', label: 'New Balance', count: 1 },
				{ id: 'hoka', label: 'Hoka', count: 1 }
			]
		},
		{
			id: 'color',
			label: 'Color',
			type: 'checkbox',
			category: 'Commerce',
			options: [
				{ id: 'black', label: 'Black', count: 2 },
				{ id: 'white', label: 'White', count: 2 },
				{ id: 'blue', label: 'Blue', count: 1 },
				{ id: 'red', label: 'Red', count: 1 }
			]
		},
		{
			id: 'tags',
			label: 'Tags',
			type: 'checkbox',
			category: 'Commerce',
			options: [
				{ id: 'sale', label: 'Sale', count: 2 },
				{ id: 'new', label: 'New', count: 3 },
				{ id: 'limited', label: 'Limited', count: 1 }
			]
		},
		{
			id: 'rating',
			label: 'Min. rating',
			type: 'rating',
			category: 'Quality',
			maxRating: 5
		},
		{
			id: 'sale',
			label: 'On sale only',
			type: 'toggle',
			category: 'Quality'
		}
	];

	const products = [
		{
			id: '1',
			title: 'Air Zoom Pegasus',
			subtitle: 'Road running',
			brand: 'nike',
			color: 'black',
			tags: ['new'],
			price: 129,
			compareAt: 149,
			rating: 4.5,
			reviews: 210,
			badge: 'New'
		},
		{
			id: '2',
			title: 'Ultraboost Light',
			subtitle: 'Daily trainer',
			brand: 'adidas',
			color: 'white',
			tags: ['sale'],
			price: 159,
			compareAt: 189,
			rating: 4.7,
			reviews: 340,
			badge: 'Sale'
		},
		{
			id: '3',
			title: 'Velocity Nitro 3',
			subtitle: 'Tempo runs',
			brand: 'puma',
			color: 'red',
			tags: ['new', 'limited'],
			price: 119,
			rating: 4.2,
			reviews: 88
		},
		{
			id: '4',
			title: 'Gel-Nimbus 26',
			subtitle: 'Max cushion',
			brand: 'asics',
			color: 'blue',
			tags: [],
			price: 179,
			rating: 4.8,
			reviews: 512
		},
		{
			id: '5',
			title: 'Fresh Foam X',
			subtitle: 'Neutral ride',
			brand: 'newbalance',
			color: 'black',
			tags: ['sale'],
			price: 139,
			compareAt: 160,
			rating: 4.4,
			reviews: 156
		},
		{
			id: '6',
			title: 'Clifton 9',
			subtitle: 'Everyday cushion',
			brand: 'hoka',
			color: 'white',
			tags: ['new'],
			price: 145,
			rating: 4.6,
			reviews: 273
		}
	];
</script>

<CatalogPage
	bind:state={filters}
	title="Running shoes"
	showUrlSync
	{products}
	{filterSchema}
	fields={[
		{
			id: 'brand',
			label: 'Brand',
			type: 'select',
			options: [
				{ value: 'nike', label: 'Nike' },
				{ value: 'adidas', label: 'Adidas' },
				{ value: 'puma', label: 'Puma' },
				{ value: 'asics', label: 'Asics' },
				{ value: 'newbalance', label: 'New Balance' },
				{ value: 'hoka', label: 'Hoka' }
			]
		},
		{
			id: 'color',
			label: 'Color',
			type: 'select',
			options: [
				{ value: 'black', label: 'Black' },
				{ value: 'white', label: 'White' },
				{ value: 'blue', label: 'Blue' },
				{ value: 'red', label: 'Red' }
			]
		},
		{
			id: 'tags',
			label: 'Tags',
			type: 'multiselect',
			options: [
				{ value: 'sale', label: 'Sale' },
				{ value: 'new', label: 'New' },
				{ value: 'limited', label: 'Limited' }
			]
		},
		{ id: 'price', label: 'Price', type: 'number' },
		{ id: 'name', label: 'Name', type: 'text' },
		{ id: 'released', label: 'Released', type: 'date' },
		{ id: 'featured', label: 'Featured', type: 'boolean' }
	]}
/>
