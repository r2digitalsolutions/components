<script lang="ts">
	import TreeSelect from './TreeSelect.svelte';
	import type { TreeNode } from '../TreeView/TreeView.svelte';

	let {
		label = 'Category',
		placeholder = 'Select category...',
		disabled = false
	}: {
		label?: string;
		placeholder?: string;
		disabled?: boolean;
	} = $props();

	const items: TreeNode[] = [
		{
			id: 'electronics',
			label: 'Electronics',
			children: [
				{ id: 'phones', label: 'Phones', children: [
					{ id: 'iphone', label: 'iPhone' },
					{ id: 'android', label: 'Android' }
				]},
				{ id: 'laptops', label: 'Laptops' },
				{ id: 'tablets', label: 'Tablets', disabled: true }
			]
		},
		{
			id: 'clothing',
			label: 'Clothing',
			children: [
				{ id: 'mens', label: "Men's" },
				{ id: 'womens', label: "Women's" },
				{ id: 'kids', label: "Kids'" }
			]
		},
		{ id: 'books', label: 'Books' },
		{ id: 'sports', label: 'Sports & Outdoors' }
	];

	let value = $state('');
</script>

<div class="w-72 space-y-2">
	<TreeSelect {items} {label} {placeholder} {disabled} bind:value />
	<p class="text-xs text-muted">
		Valor: <span class="text-primary font-medium">{value || '—'}</span>
	</p>
</div>
