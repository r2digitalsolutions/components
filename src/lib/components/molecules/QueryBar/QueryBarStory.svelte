<script lang="ts">
	import QueryBar from './QueryBar.svelte';

	let value = $state('brand:nike AND price>=50');
	let last = $state('');
</script>

<div class="max-w-2xl space-y-3">
	<QueryBar
		bind:value
		history={['brand:adidas', 'status:active AND tags:sale']}
		fields={[
			{
				id: 'brand',
				label: 'Brand',
				type: 'select',
				options: [
					{ value: 'nike', label: 'Nike' },
					{ value: 'adidas', label: 'Adidas' },
					{ value: 'puma', label: 'Puma' }
				]
			},
			{ id: 'price', label: 'Price', type: 'number' },
			{
				id: 'status',
				label: 'Status',
				type: 'select',
				options: [
					{ value: 'active', label: 'Active' },
					{ value: 'draft', label: 'Draft' }
				]
			},
			{
				id: 'tags',
				label: 'Tags',
				type: 'multiselect',
				options: [
					{ value: 'sale', label: 'Sale' },
					{ value: 'new', label: 'New' }
				]
			}
		]}
		onsubmit={(q) => (last = q)}
	/>
	{#if last}
		<p class="text-xs text-muted">Submitted: <code class="text-primary">{last}</code></p>
	{/if}
</div>
