<script lang="ts">
	import ListingTemplate from './ListingTemplate.svelte';
	import ProductCard from '$lib/components/molecules/ProductCard/ProductCard.svelte';

	let query = $state('');
	let filter = $state('all');
	let page = $state(1);
</script>

<div class="overflow-hidden rounded-2xl border border-border">
	<ListingTemplate
		title="Products"
		description="Find something for your next project."
		bind:query
		bind:filter
		bind:page
		pageCount={3}
		filters={[
			{ id: 'all', label: 'All' },
			{ id: 'new', label: 'New' },
			{ id: 'sale', label: 'On sale' }
		]}
	>
		<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			<ProductCard title="Desk lamp" price={42} rating={4.5} reviews={32} onadd={() => {}} />
			<ProductCard title="Notebook set" price={18} badge="New" rating={5} reviews={12} onadd={() => {}} />
			<ProductCard title="Cable organizer" price={12} compareAt={16} rating={4} reviews={80} onadd={() => {}} />
		</div>
	</ListingTemplate>
</div>
