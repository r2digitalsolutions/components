<script lang="ts">
	import BlogEditor from './BlogEditor.svelte';
	import BlogRenderer from '../BlogRenderer/BlogRenderer.svelte';
	import DemoBlogWidget from './DemoBlogWidget.svelte';
	import DemoBlogCard from './DemoBlogCard.svelte';
	import DemoBlogStats from './DemoBlogStats.svelte';
	import {
		createBlock,
		createComponentBlock,
		emptyBlogDocument,
		registerBlogComponent,
		type BlogDocument
	} from '$lib/utils/blogDocument.js';

	registerBlogComponent('demo-badge', {
		label: 'Status badge',
		component: DemoBlogWidget,
		defaultProps: { variant: 'primary', label: 'From registry', size: 'md' },
		description: 'Inline status badge',
		propFields: [
			{ key: 'label', label: 'Label', type: 'string', placeholder: 'Badge text' },
			{
				key: 'variant',
				label: 'Variant',
				type: 'select',
				options: [
					{ value: 'primary', label: 'Primary' },
					{ value: 'secondary', label: 'Secondary' },
					{ value: 'success', label: 'Success' },
					{ value: 'warning', label: 'Warning' },
					{ value: 'error', label: 'Error' },
					{ value: 'info', label: 'Info' }
				]
			},
			{
				key: 'size',
				label: 'Size',
				type: 'select',
				options: [
					{ value: 'sm', label: 'Small' },
					{ value: 'md', label: 'Medium' }
				]
			}
		]
	});

	registerBlogComponent('demo-card', {
		label: 'Feature card',
		component: DemoBlogCard,
		defaultProps: {
			title: 'Composable blocks',
			description: 'Register any Svelte component and edit its props in the blog editor.',
			ctaLabel: 'Docs',
			href: '#',
			accent: '#0ea5e9'
		},
		description: 'Marketing feature card',
		propFields: [
			{ key: 'title', label: 'Title', type: 'string' },
			{ key: 'description', label: 'Description', type: 'textarea' },
			{ key: 'ctaLabel', label: 'CTA label', type: 'string' },
			{ key: 'href', label: 'Href', type: 'string' },
			{ key: 'accent', label: 'Accent', type: 'color' }
		]
	});

	registerBlogComponent('demo-stats', {
		label: 'Stats strip',
		component: DemoBlogStats,
		defaultProps: {
			title: 'By the numbers',
			stats: [
				{ label: 'Components', value: '120+' },
				{ label: 'Apps', value: '18' },
				{ label: 'Uptime', value: '99.9%' }
			]
		},
		description: 'Three KPI cards',
		propFields: [{ key: 'title', label: 'Title', type: 'string' }]
	});

	let value = $state<BlogDocument>({
		...emptyBlogDocument('Shipping our component library'),
		description: 'A richer block model with media, layout, and registered components.',
		author: 'R2 Digisolutions',
		publishedAt: '2026-07-28',
		tags: ['design-system', 'svelte', 'blog'],
		coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
		blocks: [
			createBlock('heading', { level: 2, text: 'Why blocks?', align: 'left', anchor: 'why' }),
			createBlock('paragraph', {
				text: 'A JSON document of blocks can be stored, versioned, and rendered anywhere.',
				lead: true
			}),
			createBlock('callout', {
				tone: 'info',
				title: 'Tip',
				text: 'Pass the same JSON to BlogRenderer to hydrate the page.'
			}),
			createBlock('gallery', {
				columns: 3,
				images: [
					{ src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80', alt: 'A' },
					{ src: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&q=80', alt: 'B' },
					{ src: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80', alt: 'C' }
				]
			}),
			createBlock('table', {
				caption: 'Block coverage',
				headers: ['Block', 'Props', 'Status'],
				rows: [
					['Image', 'align, width, shadow', 'Ready'],
					['Video', 'controls, poster', 'Ready'],
					['CTA', 'variant, align', 'Ready']
				],
				striped: true
			}),
			createBlock('divider', { label: 'Components', spacing: 'md' }),
			createComponentBlock('demo-stats'),
			createComponentBlock('demo-card'),
			createComponentBlock('demo-badge', { variant: 'success', label: 'Live' }),
			createBlock('cta', {
				label: 'Try BlogEditor',
				subtitle: 'Edit on the left — preview updates live.',
				variant: 'primary',
				align: 'center',
				href: '#'
			}),
			createBlock('code', {
				language: 'json',
				filename: 'post.json',
				code: '{\n  "version": 1,\n  "blocks": []\n}'
			})
		]
	});
</script>

<div class="grid gap-6 p-4 lg:grid-cols-2">
	<BlogEditor bind:value />
	<div class="rounded-xl border border-border bg-surface p-4">
		<p class="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Preview</p>
		<BlogRenderer {value} />
	</div>
</div>
