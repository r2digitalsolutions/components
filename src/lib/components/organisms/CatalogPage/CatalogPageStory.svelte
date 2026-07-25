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
			badge: 'New',
			image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'
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
			badge: 'Sale',
			image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80'
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
			reviews: 88,
			image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80'
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
			reviews: 512,
			image: 'https://images.unsplash.com/photo-1551107696-a4b0c56f4df2?w=800&q=80'
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
			reviews: 156,
			image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80'
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
			reviews: 273,
			image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80'
		}
	];
</script>

<div class="p-4 sm:p-6">
	<CatalogPage bind:state={filters} title="Running shoes" {products} {filterSchema} />
</div>
