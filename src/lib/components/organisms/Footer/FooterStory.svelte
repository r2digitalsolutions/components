<script lang="ts">
	import Footer from './Footer.svelte';

	const groups = [
		{
			id: 'product',
			title: 'Product',
			links: [
				{ id: 'features', label: 'Features' },
				{ id: 'pricing', label: 'Pricing' },
				{ id: 'changelog', label: 'Changelog' }
			]
		},
		{
			id: 'company',
			title: 'Company',
			links: [
				{ id: 'about', label: 'About' },
				{ id: 'blog', label: 'Blog' },
				{ id: 'careers', label: 'Careers' }
			]
		},
		{
			id: 'legal',
			title: 'Legal',
			links: [
				{ id: 'privacy', label: 'Privacy' },
				{ id: 'terms', label: 'Terms' }
			]
		}
	];
</script>

<Footer {groups}>
	{#snippet legal()}
		<span class="flex gap-3">
			<button type="button" class="hover:text-primary">Privacy</button>
			<button type="button" class="hover:text-primary">Terms</button>
		</span>
	{/snippet}
</Footer>
