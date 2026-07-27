<script lang="ts">
	import BlogRenderer from './BlogRenderer.svelte';
	import { createBlock, emptyBlogDocument } from '$lib/utils/blogDocument.js';

	const value = {
		...emptyBlogDocument('Rendered from JSON'),
		blocks: [
			createBlock('heading', { level: 1, text: 'Hello from JSON' }),
			createBlock('paragraph', { text: 'This document was hydrated by BlogRenderer.' }),
			createBlock('quote', { text: 'Serialize once, render everywhere.', cite: 'Design system' }),
			createBlock('list', { ordered: false, items: ['Heading', 'Paragraph', 'Quote', 'List'] }),
			createBlock('divider'),
			createBlock('markdown', { source: '**Markdown** block with _emphasis_.' })
		]
	};
</script>

<div class="p-6">
	<BlogRenderer {value} />
</div>
