<script lang="ts">
	import QueryBar from './QueryBar.svelte';
	import type { FilterFieldDef } from '$lib/utils/advancedFilters.js';
	import type { QueryExample } from '$lib/utils/queryBar.js';

	interface Props {
		variant?: 'default' | 'empty' | 'errors' | 'catalog' | 'minimal';
	}

	let { variant = 'default' }: Props = $props();

	const catalogFields: FilterFieldDef[] = [
		{
			id: 'brand',
			label: 'Brand',
			type: 'select',
			options: [
				{ value: 'nike', label: 'Nike' },
				{ value: 'adidas', label: 'Adidas' },
				{ value: 'puma', label: 'Puma' },
				{ value: 'hoka', label: 'Hoka' }
			]
		},
		{ id: 'price', label: 'Price', type: 'number' },
		{
			id: 'status',
			label: 'Status',
			type: 'select',
			options: [
				{ value: 'active', label: 'Active' },
				{ value: 'draft', label: 'Draft' },
				{ value: 'archived', label: 'Archived' }
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
		{ id: 'name', label: 'Name', type: 'text' },
		{ id: 'color', label: 'Color', type: 'select', options: [
			{ value: 'black', label: 'Black' },
			{ value: 'white', label: 'White' },
			{ value: 'blue', label: 'Blue' }
		]},
		{ id: 'released', label: 'Released', type: 'date' }
	];

	const catalogExamples: QueryExample[] = [
		{
			label: 'Nike under €150',
			query: 'brand:nike AND price<=150',
			description: 'Brand + max price'
		},
		{
			label: 'Nike or Adidas, black',
			query: '(brand:nike OR brand:adidas) AND color:black',
			description: 'Grouped OR'
		},
		{
			label: 'Sale + active',
			query: 'tags:sale AND status:active',
			description: 'Tag and status'
		},
		{
			label: 'Contains boost',
			query: 'name~boost OR name~ultra',
			description: 'Soft contains'
		},
		{
			label: 'Exclude archived',
			query: 'status:active AND NOT tags:limited',
			description: 'Negation'
		},
		{
			label: 'Quoted name',
			query: 'name:"Air Zoom" AND brand:nike',
			description: 'Multi-word value'
		}
	];

	let value = $state(
		variant === 'empty'
			? ''
			: variant === 'errors'
				? 'brand:nike AND'
				: variant === 'catalog'
					? '(brand:nike OR brand:adidas) AND price>=100'
					: 'brand:nike AND price>=50'
	);
	let last = $state('');
</script>

<div class="max-w-2xl space-y-3">
	{#if variant === 'minimal'}
		<QueryBar
			bind:value
			fields={catalogFields}
			showExamples={false}
			showFieldChips={false}
			onsubmit={(q) => (last = q)}
		/>
	{:else if variant === 'empty'}
		<QueryBar
			bind:value
			fields={catalogFields}
			examples={catalogExamples}
			history={['brand:adidas', 'status:active AND tags:sale']}
			onsubmit={(q) => (last = q)}
		/>
	{:else if variant === 'errors'}
		<QueryBar
			bind:value
			fields={catalogFields}
			examples={catalogExamples}
			onsubmit={(q) => (last = q)}
		/>
		<p class="text-xs text-muted">Try fixing the dangling <code class="text-primary">AND</code>.</p>
	{:else}
		<QueryBar
			bind:value
			fields={catalogFields}
			examples={catalogExamples}
			history={['brand:adidas', 'status:active AND tags:sale', 'name~boost']}
			onsubmit={(q) => (last = q)}
		/>
	{/if}

	{#if last}
		<p class="text-xs text-muted">Submitted: <code class="text-primary">{last}</code></p>
	{/if}
</div>
