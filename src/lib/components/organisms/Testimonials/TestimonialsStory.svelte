<script lang="ts">
	import Testimonials from './Testimonials.svelte';
</script>

<Testimonials
	items={[
		{
			id: '1',
			quote: 'Cut our design-to-dev handoff in half. The Storybook catalog is the source of truth now.',
			author: 'Maya Chen',
			role: 'Design lead, Northwind',
			avatar: 'https://i.pravatar.cc/80?img=5',
			rating: 5
		},
		{
			id: '2',
			quote: 'We shipped an admin console in a week using the organisms as starting points.',
			author: 'Luis Ortega',
			role: 'Staff engineer, Parcel',
			avatar: 'https://i.pravatar.cc/80?img=12',
			rating: 5
		},
		{
			id: '3',
			quote: 'Dense enough for tools, polished enough for marketing pages. Rare combo.',
			author: 'Ana Silva',
			role: 'Product, Orbit',
			avatar: 'https://i.pravatar.cc/80?img=9',
			rating: 4
		}
	]}
/>
