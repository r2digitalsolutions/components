<script lang="ts">
	import DashboardBuilderPage from './DashboardBuilderPage.svelte';
	import type { DashboardBuilderWidget } from './DashboardBuilderPage.svelte';
	import type { GridItem } from '$lib/utils/layoutGrid.js';

	interface Props {
		example?:
			| 'default'
			| 'preview'
			| 'empty'
			| 'dense'
			| 'no-picker'
			| 'executive'
			| 'minimal'
			| 'dirty';
	}

	let { example = 'default' }: Props = $props();

	const executiveLayout: GridItem[] = [
		{ id: 'w-stats', x: 0, y: 0, w: 4, h: 2, minW: 3, minH: 2 },
		{ id: 'w-usage', x: 4, y: 0, w: 4, h: 2, minW: 3, minH: 2 },
		{ id: 'w-team', x: 8, y: 0, w: 4, h: 2, minW: 3, minH: 2 },
		{ id: 'w-chart', x: 0, y: 2, w: 8, h: 3, minW: 4, minH: 2 },
		{ id: 'w-calendar', x: 8, y: 2, w: 4, h: 3, minW: 3, minH: 2 },
		{ id: 'w-activity', x: 0, y: 5, w: 6, h: 3, minW: 3, minH: 2 },
		{ id: 'w-goals', x: 6, y: 5, w: 6, h: 3, minW: 3, minH: 2 }
	];

	const executiveWidgets: DashboardBuilderWidget[] = [
		{ id: 'w-stats', title: 'Key metrics', type: 'stats' },
		{ id: 'w-usage', title: 'Platform usage', type: 'usage' },
		{ id: 'w-team', title: 'Team', type: 'team' },
		{ id: 'w-chart', title: 'Revenue trend', type: 'chart' },
		{ id: 'w-calendar', title: 'This week', type: 'calendar' },
		{ id: 'w-activity', title: 'Activity', type: 'activity' },
		{ id: 'w-goals', title: 'Quarter goals', type: 'goals' }
	];

	let layout = $state<GridItem[]>([]);
	let widgets = $state<DashboardBuilderWidget[]>([]);
	let editable = $state(true);
	let showPicker = $state(true);
	let showToolbar = $state(true);
	let showStats = $state(true);
	let cols = $state(12);
	let rowHeight = $state(72);
	let gap = $state(12);
	let density = $state<'comfortable' | 'default' | 'compact' | 'dense' | 'custom'>('default');
	let saveStatus = $state<'idle' | 'dirty' | 'saving' | 'saved' | 'error'>('idle');
	let last = $state('');

	$effect(() => {
		if (example === 'preview') {
			layout = executiveLayout.map((it) => ({ ...it }));
			widgets = executiveWidgets.map((w) => ({ ...w }));
			editable = false;
			showPicker = true;
			showToolbar = true;
			showStats = true;
			cols = 12;
			rowHeight = 80;
			gap = 12;
			density = 'default';
			saveStatus = 'saved';
		} else if (example === 'empty') {
			layout = [];
			widgets = [];
			editable = true;
			showPicker = true;
			showToolbar = true;
			showStats = true;
			cols = 12;
			rowHeight = 72;
			gap = 12;
			density = 'default';
			saveStatus = 'idle';
		} else if (example === 'dense') {
			layout = executiveLayout.map((it) => ({ ...it }));
			widgets = executiveWidgets.map((w) => ({ ...w }));
			editable = true;
			showPicker = true;
			showToolbar = true;
			showStats = true;
			cols = 12;
			rowHeight = 52;
			gap = 6;
			density = 'dense';
			saveStatus = 'idle';
		} else if (example === 'no-picker') {
			layout = executiveLayout.slice(0, 4).map((it) => ({ ...it }));
			widgets = executiveWidgets.slice(0, 4).map((w) => ({ ...w }));
			editable = true;
			showPicker = false;
			showToolbar = true;
			showStats = false;
			cols = 12;
			rowHeight = 72;
			gap = 12;
			density = 'default';
			saveStatus = 'idle';
		} else if (example === 'executive') {
			layout = executiveLayout.map((it) => ({ ...it }));
			widgets = executiveWidgets.map((w) => ({ ...w }));
			editable = true;
			showPicker = true;
			showToolbar = true;
			showStats = true;
			cols = 12;
			rowHeight = 80;
			gap = 12;
			density = 'comfortable';
			saveStatus = 'idle';
		} else if (example === 'minimal') {
			layout = [
				{ id: 'w-stats', x: 0, y: 0, w: 6, h: 2, minW: 3, minH: 2 },
				{ id: 'w-notes', x: 6, y: 0, w: 6, h: 2, minW: 3, minH: 2 }
			];
			widgets = [
				{ id: 'w-stats', title: 'Pulse', type: 'stats' },
				{ id: 'w-notes', title: 'Scratchpad', type: 'notes' }
			];
			editable = true;
			showPicker = true;
			showToolbar = false;
			showStats = false;
			cols = 12;
			rowHeight = 88;
			gap = 16;
			density = 'custom';
			saveStatus = 'idle';
		} else if (example === 'dirty') {
			layout = executiveLayout.slice(0, 3).map((it) => ({ ...it }));
			widgets = executiveWidgets.slice(0, 3).map((w) => ({ ...w }));
			editable = true;
			showPicker = true;
			showToolbar = true;
			showStats = true;
			cols = 12;
			rowHeight = 72;
			gap = 12;
			density = 'default';
			saveStatus = 'dirty';
		} else {
			layout = [];
			widgets = [];
			// Let page defaults populate via not binding empty... 
			// Actually bindable defaults only apply when not passed. We're always passing layout.
			// Use default starter from page by importing same data - set to starter:
			layout = [
				{ id: 'w-stats', x: 0, y: 0, w: 4, h: 2, minW: 3, minH: 2 },
				{ id: 'w-chart', x: 4, y: 0, w: 8, h: 3, minW: 4, minH: 2 },
				{ id: 'w-goals', x: 0, y: 2, w: 4, h: 2, minW: 3, minH: 2 },
				{ id: 'w-activity', x: 0, y: 4, w: 6, h: 3, minW: 3, minH: 2 },
				{ id: 'w-list', x: 6, y: 3, w: 6, h: 4, minW: 3, minH: 2 }
			];
			widgets = [
				{ id: 'w-stats', title: 'Key metrics', type: 'stats' },
				{ id: 'w-chart', title: 'Revenue trend', type: 'chart' },
				{ id: 'w-goals', title: 'Quarter goals', type: 'goals' },
				{ id: 'w-activity', title: 'Activity', type: 'activity' },
				{ id: 'w-list', title: 'Priorities', type: 'list' }
			];
			editable = true;
			showPicker = true;
			showToolbar = true;
			showStats = true;
			cols = 12;
			rowHeight = 72;
			gap = 12;
			density = 'default';
			saveStatus = 'idle';
		}
	});
</script>

<div class="p-3 sm:p-4">
	{#if last}
		<p class="mb-2 text-xs text-muted">{last}</p>
	{/if}
	<DashboardBuilderPage
		bind:layout
		bind:widgets
		bind:editable
		bind:cols
		bind:rowHeight
		bind:gap
		bind:density
		bind:saveStatus
		{showPicker}
		{showToolbar}
		{showStats}
		title={example === 'executive' ? 'Executive overview' : 'Dashboard builder'}
		description={example === 'preview'
			? 'Preview mode — unlock editing from the grid toolbar.'
			: 'Drag, resize, and add widgets. Change columns and density anytime.'}
		onsave={() => (last = 'Saved dashboard')}
		onreset={() => (last = 'Reset to starter')}
	/>
</div>
