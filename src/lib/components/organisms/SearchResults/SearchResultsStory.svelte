<script lang="ts">
	import SearchResults from './SearchResults.svelte';
	import type { SearchResultItem, SearchResultsLayout } from './SearchResults.svelte';
	import BookOpen from '@lucide/svelte/icons/book-open';
	import Boxes from '@lucide/svelte/icons/boxes';
	import LayoutTemplate from '@lucide/svelte/icons/layout-template';
	import User from '@lucide/svelte/icons/user';

	interface Props {
		loading?: boolean;
		empty?: boolean;
		idle?: boolean;
		layout?: SearchResultsLayout;
	}

	let {
		loading = false,
		empty = false,
		idle = false,
		layout = 'list'
	}: Props = $props();

	let query = $state(idle ? '' : 'design');
	let filter = $state('all');
	let sort = $state<'relevance' | 'newest' | 'oldest' | 'az'>('relevance');
	let page = $state(1);
	let view = $state<SearchResultsLayout>(layout);

	$effect(() => {
		view = layout;
	});

	const allResults: SearchResultItem[] = [
		{
			id: '1',
			title: 'Design tokens',
			description: 'Color, spacing, radius, and typography foundations for coherent product UI.',
			meta: 'Docs · 4 min read',
			kind: 'doc',
			badge: 'Guide',
			tags: ['tokens', 'theme', 'foundations'],
			icon: BookOpen,
			author: 'Maya Chen',
			date: Date.now() - 1000 * 60 * 60 * 24 * 2,
			score: 0.98
		},
		{
			id: '2',
			title: 'Button molecule patterns',
			description: 'Variants, sizes, loading states, and when to prefer IconButton.',
			meta: 'Components · Atoms',
			kind: 'component',
			tags: ['button', 'actions'],
			icon: Boxes,
			date: Date.now() - 1000 * 60 * 60 * 24 * 5,
			score: 0.91
		},
		{
			id: '3',
			title: 'Dashboard template',
			description: 'App shell with metrics, filters, and content regions ready for product pages.',
			meta: 'Templates',
			kind: 'page',
			badge: 'New',
			badgeVariant: 'success',
			image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
			icon: LayoutTemplate,
			date: Date.now() - 1000 * 60 * 60 * 24 * 9,
			score: 0.86
		},
		{
			id: '4',
			title: 'Design systems guild',
			description: 'Weekly reviews, contribution checklist, and ownership map.',
			meta: 'People',
			kind: 'person',
			author: 'Alex Rivera',
			avatar: 'https://i.pravatar.cc/80?img=32',
			icon: User,
			date: Date.now() - 1000 * 60 * 60 * 24 * 12,
			score: 0.74
		},
		{
			id: '5',
			title: 'Designing component libraries that scale',
			description: 'Layers, composition rules, and ship checklists for durable UI kits.',
			meta: 'Blog · 9 min',
			kind: 'doc',
			tags: ['architecture', 'dx'],
			image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
			date: Date.now() - 1000 * 60 * 60 * 24 * 1,
			score: 0.93
		}
	];

	const results = $derived(idle ? [] : empty ? [] : allResults);
</script>

<div class="mx-auto max-w-3xl p-4 sm:p-6">
	<SearchResults
		bind:query
		bind:filter
		bind:sort
		bind:layout={view}
		bind:page
		{loading}
		results={results}
		total={empty || idle ? 0 : 28}
		totalPages={empty || idle ? 1 : 3}
		didYouMean={query === 'desing' ? 'design' : undefined}
		filters={[
			{ id: 'all', label: 'All', count: 28 },
			{ id: 'docs', label: 'Docs', count: 12 },
			{ id: 'components', label: 'Components', count: 9 },
			{ id: 'templates', label: 'Templates', count: 4 },
			{ id: 'people', label: 'People', count: 3 }
		]}
		recent={[
			{ id: 'r1', label: 'MobileShell' },
			{ id: 'r2', label: 'design tokens' },
			{ id: 'r3', label: 'AvatarGroup' }
		]}
		suggestions={[
			{ id: 's1', label: 'LandingHero variants' },
			{ id: 's2', label: 'BlogPost layout' },
			{ id: 's3', label: 'Permissions matrix' }
		]}
	/>
</div>
