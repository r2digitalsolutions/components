<script lang="ts">
	import SearchResults from './SearchResults.svelte';

	let query = $state('design');
	let filter = $state('all');
</script>

<div class="max-w-xl">
	<SearchResults
		bind:query
		bind:filter
		filters={[
			{ id: 'all', label: 'All' },
			{ id: 'docs', label: 'Docs' },
			{ id: 'components', label: 'Components' }
		]}
		results={[
			{
				id: '1',
				title: 'Design tokens',
				description: 'Color, spacing, and typography foundations.',
				meta: 'Docs · 4 min'
			},
			{
				id: '2',
				title: 'Button molecule patterns',
				description: 'Variants, sizes, and loading states.',
				meta: 'Components · Atoms'
			},
			{
				id: '3',
				title: 'Dashboard template',
				description: 'App shell with metrics and content regions.',
				meta: 'Templates'
			}
		]}
	/>
</div>
