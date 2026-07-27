<script lang="ts">
	import BlogEditor from './BlogEditor.svelte';
	import BlogRenderer from '../BlogRenderer/BlogRenderer.svelte';
	import DemoBlogWidget from './DemoBlogWidget.svelte';
	import {
		createBlock,
		emptyBlogDocument,
		registerBlogComponent,
		type BlogDocument
	} from '$lib/utils/blogDocument.js';

	registerBlogComponent('demo-badge', {
		label: 'Status badge',
		component: DemoBlogWidget,
		defaultProps: { variant: 'primary', label: 'From registry' },
		description: 'Demo registered component'
	});

	let value = $state<BlogDocument>({
		...emptyBlogDocument('Shipping our component library'),
		blocks: [
			createBlock('heading', { level: 2, text: 'Why blocks?' }),
			createBlock('paragraph', {
				text: 'A JSON document of blocks can be stored, versioned, and rendered anywhere.'
			}),
			createBlock('callout', {
				tone: 'info',
				title: 'Tip',
				text: 'Pass the same JSON to BlogRenderer to hydrate the page.'
			}),
			createBlock('code', {
				language: 'json',
				code: '{\n  "version": 1,\n  "blocks": []\n}'
			}),
			createBlock('component', {
				componentId: 'demo-badge',
				props: { variant: 'primary', label: 'From registry' }
			})
		]
	});
</script>

<div class="grid gap-6 p-4 lg:grid-cols-2">
	<BlogEditor bind:value />
	<div class="rounded-xl border border-border bg-surface p-4">
		<p class="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Preview (from JSON)</p>
		<BlogRenderer {value} />
	</div>
</div>
