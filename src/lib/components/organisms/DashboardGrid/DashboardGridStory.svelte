<script lang="ts">
	import DashboardGrid from './DashboardGrid.svelte';
	import type { DashboardWidgetMeta } from './DashboardGrid.svelte';
	import type { GridItem } from '$lib/utils/layoutGrid.js';
	import { addItem, layoutBounds } from '$lib/utils/layoutGrid.js';
	import StatCard from '$lib/components/molecules/StatCard/StatCard.svelte';
	import GoalProgress from '$lib/components/molecules/GoalProgress/GoalProgress.svelte';

	interface Props {
		example?:
			| 'default'
			| 'readonly'
			| 'six-cols'
			| 'dense'
			| 'static'
			| 'empty'
			| 'no-compact'
			| 'rich'
			| 'loading';
	}

	let { example = 'default' }: Props = $props();

	const baseLayout: GridItem[] = [
		{ id: 'a', x: 0, y: 0, w: 4, h: 2, minW: 2, minH: 2 },
		{ id: 'b', x: 4, y: 0, w: 8, h: 2, minW: 3, minH: 2 },
		{ id: 'c', x: 0, y: 2, w: 6, h: 3, minW: 3, minH: 2 },
		{ id: 'd', x: 6, y: 2, w: 6, h: 3, minW: 3, minH: 2 }
	];

	const richLayout: GridItem[] = [
		{ id: 'stats', x: 0, y: 0, w: 4, h: 2, minW: 3, minH: 2 },
		{ id: 'chart', x: 4, y: 0, w: 8, h: 3, minW: 4, minH: 2 },
		{ id: 'goals', x: 0, y: 2, w: 4, h: 2, minW: 3, minH: 2 },
		{ id: 'notes', x: 0, y: 4, w: 12, h: 2, minW: 4, minH: 1 }
	];

	const staticLayout: GridItem[] = [
		{ id: 'header', x: 0, y: 0, w: 12, h: 1, static: true, minH: 1 },
		{ id: 'a', x: 0, y: 1, w: 4, h: 2, minW: 2, minH: 2 },
		{ id: 'b', x: 4, y: 1, w: 8, h: 2, minW: 3, minH: 2 },
		{ id: 'c', x: 0, y: 3, w: 12, h: 2, minW: 4, minH: 2 }
	];

	let layout = $state<GridItem[]>(baseLayout.map((it) => ({ ...it })));
	let widgets = $state<DashboardWidgetMeta[]>([
		{ id: 'a', title: 'Stats', type: 'stats' },
		{ id: 'b', title: 'Chart', type: 'chart' },
		{ id: 'c', title: 'Activity', type: 'activity' },
		{ id: 'd', title: 'Notes', type: 'notes' }
	]);
	let cols = $state(12);
	let rowHeight = $state(80);
	let gap = $state(12);
	let editable = $state(true);
	let compact = $state(true);
	let showGrid = $state(true);
	let showToolbar = $state(true);
	let density = $state<'comfortable' | 'default' | 'compact' | 'dense' | 'custom'>('default');
	let last = $state('');
	let uid = $state(1);

	$effect(() => {
		if (example === 'readonly') {
			layout = baseLayout.map((it) => ({ ...it }));
			widgets = [
				{ id: 'a', title: 'Stats' },
				{ id: 'b', title: 'Chart' },
				{ id: 'c', title: 'Activity' },
				{ id: 'd', title: 'Notes' }
			];
			cols = 12;
			rowHeight = 80;
			gap = 12;
			editable = false;
			compact = true;
			showGrid = false;
			showToolbar = true;
			density = 'default';
		} else if (example === 'six-cols') {
			layout = [
				{ id: 'a', x: 0, y: 0, w: 2, h: 2 },
				{ id: 'b', x: 2, y: 0, w: 4, h: 2 },
				{ id: 'c', x: 0, y: 2, w: 3, h: 2 },
				{ id: 'd', x: 3, y: 2, w: 3, h: 2 }
			];
			widgets = [
				{ id: 'a', title: 'KPI A' },
				{ id: 'b', title: 'KPI B' },
				{ id: 'c', title: 'Panel' },
				{ id: 'd', title: 'Feed' }
			];
			cols = 6;
			rowHeight = 88;
			gap = 12;
			editable = true;
			compact = true;
			showGrid = true;
			showToolbar = true;
			density = 'custom';
		} else if (example === 'dense') {
			layout = baseLayout.map((it) => ({ ...it }));
			widgets = [
				{ id: 'a', title: 'Stats' },
				{ id: 'b', title: 'Chart' },
				{ id: 'c', title: 'Activity' },
				{ id: 'd', title: 'Notes' }
			];
			cols = 12;
			rowHeight = 52;
			gap = 6;
			editable = true;
			compact = true;
			showGrid = true;
			showToolbar = true;
			density = 'dense';
		} else if (example === 'static') {
			layout = staticLayout.map((it) => ({ ...it }));
			widgets = [
				{ id: 'header', title: 'Pinned header', description: 'Static — cannot move' },
				{ id: 'a', title: 'Movable A' },
				{ id: 'b', title: 'Movable B' },
				{ id: 'c', title: 'Footer band' }
			];
			cols = 12;
			rowHeight = 72;
			gap = 10;
			editable = true;
			compact = true;
			showGrid = true;
			showToolbar = true;
			density = 'custom';
		} else if (example === 'empty') {
			layout = [];
			widgets = [];
			cols = 12;
			rowHeight = 80;
			gap = 12;
			editable = false;
			compact = true;
			showGrid = true;
			showToolbar = true;
			density = 'default';
		} else if (example === 'no-compact') {
			layout = [
				{ id: 'a', x: 0, y: 0, w: 4, h: 2 },
				{ id: 'b', x: 4, y: 3, w: 4, h: 2 },
				{ id: 'c', x: 8, y: 1, w: 4, h: 2 }
			];
			widgets = [
				{ id: 'a', title: 'Top left' },
				{ id: 'b', title: 'Floating mid' },
				{ id: 'c', title: 'Right gap' }
			];
			cols = 12;
			rowHeight = 72;
			gap = 12;
			editable = true;
			compact = false;
			showGrid = true;
			showToolbar = true;
			density = 'custom';
		} else if (example === 'rich') {
			layout = richLayout.map((it) => ({ ...it }));
			widgets = [
				{ id: 'stats', title: 'Key metrics', type: 'stats' },
				{ id: 'chart', title: 'Revenue', type: 'chart' },
				{ id: 'goals', title: 'Goals', type: 'goals' },
				{ id: 'notes', title: 'Notes', type: 'notes' }
			];
			cols = 12;
			rowHeight = 80;
			gap = 12;
			editable = true;
			compact = true;
			showGrid = true;
			showToolbar = true;
			density = 'default';
		} else if (example === 'loading') {
			layout = baseLayout.slice(0, 2).map((it) => ({ ...it }));
			widgets = [
				{ id: 'a', title: 'Stats', loading: true },
				{ id: 'b', title: 'Chart', loading: true }
			];
			cols = 12;
			rowHeight = 80;
			gap = 12;
			editable = false;
			compact = true;
			showGrid = false;
			showToolbar = false;
			density = 'default';
		} else {
			layout = baseLayout.map((it) => ({ ...it }));
			widgets = [
				{ id: 'a', title: 'Stats', type: 'stats' },
				{ id: 'b', title: 'Chart', type: 'chart' },
				{ id: 'c', title: 'Activity', type: 'activity' },
				{ id: 'd', title: 'Notes', type: 'notes' }
			];
			cols = 12;
			rowHeight = 80;
			gap = 12;
			editable = true;
			compact = true;
			showGrid = true;
			showToolbar = true;
			density = 'default';
		}
	});

	function reset() {
		if (example === 'rich') {
			layout = richLayout.map((it) => ({ ...it }));
		} else if (example === 'static') {
			layout = staticLayout.map((it) => ({ ...it }));
		} else if (example === 'six-cols') {
			layout = [
				{ id: 'a', x: 0, y: 0, w: 2, h: 2 },
				{ id: 'b', x: 2, y: 0, w: 4, h: 2 },
				{ id: 'c', x: 0, y: 2, w: 3, h: 2 },
				{ id: 'd', x: 3, y: 2, w: 3, h: 2 }
			];
		} else {
			layout = baseLayout.map((it) => ({ ...it }));
		}
		last = 'Reset layout';
	}

	function addWidget() {
		const id = `w-${uid++}`;
		const bounds = layoutBounds(layout);
		layout = addItem(
			layout,
			{ id, x: 0, y: bounds.rows, w: Math.min(4, cols), h: 2, minW: 2, minH: 2 },
			{ cols, compact }
		);
		widgets = [...widgets, { id, title: `Widget ${id}`, type: 'notes' }];
		editable = true;
		last = `Added ${id}`;
	}
</script>

<div class="mx-auto w-full max-w-6xl space-y-3 p-2 sm:p-4">
	{#if last}
		<p class="text-xs text-muted">Last action: {last}</p>
	{/if}

	<DashboardGrid
		bind:layout
		bind:cols
		bind:rowHeight
		bind:gap
		bind:editable
		bind:compact
		bind:showGrid
		bind:density
		{widgets}
		{showToolbar}
		onreset={reset}
		onadd={addWidget}
		onremove={(id) => {
			layout = layout.filter((it) => it.id !== id);
			widgets = widgets.filter((w) => w.id !== id);
			last = `Removed ${id}`;
		}}
		onchange={() => (last = 'Layout updated')}
		onsettingschange={(s) => (last = `Settings · ${s.cols} cols · ${s.rowHeight}px`)}
	>
		{#snippet render(meta)}
			{#if example === 'rich'}
				<div class="h-full overflow-auto p-3">
					{#if meta.type === 'stats'}
						<div class="grid grid-cols-2 gap-2">
							<StatCard label="Revenue" value="€48.2k" delta="+12%" trend="up" variant="ghost" />
							<StatCard label="Users" value="1,284" delta="+4%" trend="up" variant="ghost" />
						</div>
					{:else if meta.type === 'chart'}
						<div
							class="flex h-full min-h-[6rem] flex-col justify-end gap-1 rounded-lg bg-gradient-to-t from-brand-500/15 to-transparent p-2"
							aria-hidden="true"
						>
							<div class="flex h-24 items-end gap-1">
								{#each [40, 55, 35, 70, 60, 85, 50, 75, 90, 65] as h, i (i)}
									{@const barStyle = `height:${h}%`}
									<div class="flex-1 rounded-t bg-brand-500/70" style={barStyle}></div>
								{/each}
							</div>
							<p class="text-[11px] text-muted">Demo chart · last 10 days</p>
						</div>
					{:else if meta.type === 'goals'}
						<div class="space-y-3">
							<GoalProgress label="MRR target" current={72} target={100} unit="%" />
							<GoalProgress label="Onboarding" current={18} target={25} tone="success" />
						</div>
					{:else}
						<p class="text-sm leading-relaxed text-secondary">
							Capture ideas and follow-ups. Change columns or density in the toolbar — widgets
							rescale.
						</p>
					{/if}
				</div>
			{:else}
				<div class="flex h-full flex-col justify-center gap-1 p-3">
					<p class="text-sm font-medium text-primary">{meta.title}</p>
					<p class="text-xs text-muted">{meta.description ?? meta.type ?? 'Drag · resize · remove'}</p>
				</div>
			{/if}
		{/snippet}
	</DashboardGrid>
</div>
