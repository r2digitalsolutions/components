<script lang="ts">
	import WidgetPicker from './WidgetPicker.svelte';
	import type { WidgetCatalogItem } from './WidgetPicker.svelte';

	interface Props {
		example?: 'list' | 'grid' | 'filtered';
	}

	let { example = 'list' }: Props = $props();

	const widgets: WidgetCatalogItem[] = [
		{
			id: 'stats',
			label: 'Stats',
			description: 'Key metrics at a glance',
			icon: '▣',
			category: 'Metrics',
			tone: 'brand',
			defaultW: 4,
			defaultH: 2
		},
		{
			id: 'chart',
			label: 'Chart',
			description: 'Trends over time',
			icon: '▤',
			category: 'Metrics',
			tone: 'sky',
			defaultW: 8,
			defaultH: 3
		},
		{
			id: 'activity',
			label: 'Activity',
			description: 'Recent events feed',
			icon: '⚡',
			category: 'People',
			tone: 'amber',
			defaultW: 6,
			defaultH: 3
		},
		{
			id: 'goals',
			label: 'Goals',
			description: 'Track progress toward targets',
			icon: '◎',
			category: 'Metrics',
			tone: 'emerald',
			defaultW: 4,
			defaultH: 2
		},
		{
			id: 'list',
			label: 'List',
			description: 'Tasks or items to review',
			icon: '✓',
			category: 'Content',
			tone: 'emerald',
			defaultW: 4,
			defaultH: 3
		},
		{
			id: 'notes',
			label: 'Notes',
			description: 'Free-form text block',
			icon: '¶',
			category: 'Content',
			tone: 'sky',
			defaultW: 4,
			defaultH: 2
		}
	];

	let selected = $state('');
	let query = $state('');
	let category = $state('all');

	$effect(() => {
		if (example === 'filtered') {
			query = 'chart';
			category = 'Metrics';
		} else {
			query = '';
			category = 'all';
		}
	});
</script>

<div class="max-w-md space-y-3 p-2">
	<WidgetPicker
		{widgets}
		layout={example === 'grid' ? 'grid' : 'list'}
		columns={2}
		bind:query
		bind:category
		onselect={(id) => (selected = id)}
	/>
	{#if selected}
		<p class="text-[11px] text-muted">Selected widget: {selected}</p>
	{/if}
</div>
