<script lang="ts">
	import FAQ from './FAQ.svelte';
</script>

<FAQ
	items={[
		{
			id: '1',
			question: 'Can I use these components commercially?',
			answer: 'Yes. Check the package license for attribution requirements.',
			category: 'License'
		},
		{
			id: '2',
			question: 'Does it support dark mode?',
			answer: 'Yes via the theme store and CSS tokens.',
			category: 'Theming'
		},
		{
			id: '3',
			question: 'How do I tree-shake unused components?',
			answer: 'Import named exports from the package root; bundlers drop unused modules.',
			category: 'Build'
		}
	]}
/>
