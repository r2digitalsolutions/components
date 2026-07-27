<script lang="ts">
	import WidgetPicker from './WidgetPicker.svelte';
	import type { WidgetCatalogItem } from './WidgetPicker.svelte';

	const widgets: WidgetCatalogItem[] = [
		{
			id: 'stats',
			label: 'Stats',
			description: 'Key metrics at a glance',
			icon: '📊',
			defaultW: 2,
			defaultH: 1
		},
		{
			id: 'chart',
			label: 'Chart',
			description: 'Trends over time',
			icon: '📈',
			defaultW: 2,
			defaultH: 2
		},
		{
			id: 'activity',
			label: 'Activity',
			description: 'Recent events feed',
			icon: '⚡',
			defaultW: 1,
			defaultH: 2
		},
		{
			id: 'goals',
			label: 'Goals',
			description: 'Track progress toward targets',
			icon: '🎯',
			defaultW: 2,
			defaultH: 1
		},
		{
			id: 'list',
			label: 'List',
			description: 'Tasks or items to review',
			icon: '📋',
			defaultW: 1,
			defaultH: 2
		},
		{
			id: 'notes',
			label: 'Notes',
			description: 'Free-form text block',
			icon: '📝',
			defaultW: 1,
			defaultH: 1
		}
	];

	let selected = $state('');
</script>

<div class="max-w-md space-y-3">
	<WidgetPicker {widgets} onselect={(id) => (selected = id)} />
	{#if selected}
		<p class="text-[11px] text-muted">Selected widget: {selected}</p>
	{/if}
</div>
