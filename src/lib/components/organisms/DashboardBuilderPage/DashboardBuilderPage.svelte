<script lang="ts">
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import WidgetPicker from '$lib/components/molecules/WidgetPicker/WidgetPicker.svelte';
	import type { WidgetCatalogItem } from '$lib/components/molecules/WidgetPicker/WidgetPicker.svelte';
	import DashboardGrid from '$lib/components/organisms/DashboardGrid/DashboardGrid.svelte';
	import type { DashboardWidgetMeta } from '$lib/components/organisms/DashboardGrid/DashboardGrid.svelte';
	import StatCard from '$lib/components/molecules/StatCard/StatCard.svelte';
	import GoalProgress from '$lib/components/molecules/GoalProgress/GoalProgress.svelte';
	import AuditEventRow from '$lib/components/molecules/AuditEventRow/AuditEventRow.svelte';
	import List from '$lib/components/molecules/List/List.svelte';
	import {
		type GridItem,
		addItem,
		removeItem,
		layoutBounds
	} from '$lib/utils/layoutGrid.js';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Eye from '@lucide/svelte/icons/eye';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';

	export type DashboardBuilderWidgetType =
		| 'stats'
		| 'chart'
		| 'activity'
		| 'goals'
		| 'list'
		| 'notes';

	export interface DashboardBuilderWidget extends DashboardWidgetMeta {
		type: DashboardBuilderWidgetType;
	}

	const CATALOG: WidgetCatalogItem[] = [
		{ id: 'stats', label: 'Stats', description: 'KPI cards', icon: '📊', defaultW: 4, defaultH: 2 },
		{ id: 'chart', label: 'Chart', description: 'Trend placeholder', icon: '📈', defaultW: 6, defaultH: 3 },
		{ id: 'activity', label: 'Activity', description: 'Recent events', icon: '⚡', defaultW: 4, defaultH: 3 },
		{ id: 'goals', label: 'Goals', description: 'Progress toward targets', icon: '🎯', defaultW: 4, defaultH: 2 },
		{ id: 'list', label: 'List', description: 'Simple checklist', icon: '✅', defaultW: 4, defaultH: 3 },
		{ id: 'notes', label: 'Notes', description: 'Freeform notes', icon: '📝', defaultW: 4, defaultH: 2 }
	];

	const DEFAULT_LAYOUT: GridItem[] = [
		{ id: 'w-stats', x: 0, y: 0, w: 4, h: 2, minW: 3, minH: 2 },
		{ id: 'w-chart', x: 4, y: 0, w: 8, h: 3, minW: 4, minH: 2 },
		{ id: 'w-goals', x: 0, y: 2, w: 4, h: 2, minW: 3, minH: 2 },
		{ id: 'w-activity', x: 0, y: 4, w: 6, h: 3, minW: 3, minH: 2 },
		{ id: 'w-list', x: 6, y: 3, w: 6, h: 4, minW: 3, minH: 2 }
	];

	const DEFAULT_WIDGETS: DashboardBuilderWidget[] = [
		{ id: 'w-stats', title: 'Key metrics', type: 'stats' },
		{ id: 'w-chart', title: 'Revenue trend', type: 'chart' },
		{ id: 'w-goals', title: 'Quarter goals', type: 'goals' },
		{ id: 'w-activity', title: 'Activity', type: 'activity' },
		{ id: 'w-list', title: 'Priorities', type: 'list' }
	];

	interface DashboardBuilderPageProps {
		title?: string;
		description?: string;
		layout?: GridItem[];
		widgets?: DashboardBuilderWidget[];
		catalog?: WidgetCatalogItem[];
		editable?: boolean;
		showPicker?: boolean;
		class?: string;
		onchange?: (layout: GridItem[]) => void;
		onwidgetschange?: (widgets: DashboardBuilderWidget[]) => void;
	}

	let {
		title = 'Dashboard builder',
		description = 'Drag, resize, and add widgets to craft your workspace overview.',
		layout = $bindable([...DEFAULT_LAYOUT] as GridItem[]),
		widgets = $bindable([...DEFAULT_WIDGETS] as DashboardBuilderWidget[]),
		catalog = CATALOG,
		editable = $bindable(true),
		showPicker = true,
		class: className = '',
		onchange,
		onwidgetschange
	}: DashboardBuilderPageProps = $props();

	let uid = $state(1);

	function reset() {
		layout = DEFAULT_LAYOUT.map((it) => ({ ...it }));
		widgets = DEFAULT_WIDGETS.map((w) => ({ ...w }));
		onchange?.(layout);
		onwidgetschange?.(widgets);
	}

	function addWidget(typeId: string) {
		const def = catalog.find((w) => w.id === typeId);
		if (!def) return;
		const id = `w-${typeId}-${uid++}`;
		const bounds = layoutBounds(layout);
		const nextItem: GridItem = {
			id,
			x: 0,
			y: bounds.rows,
			w: def.defaultW ?? 4,
			h: def.defaultH ?? 2,
			minW: 2,
			minH: 2
		};
		layout = addItem(layout, nextItem, { cols: 12 });
		widgets = [
			...widgets,
			{
				id,
				title: def.label,
				description: def.description,
				type: typeId as DashboardBuilderWidgetType
			}
		];
		onchange?.(layout);
		onwidgetschange?.(widgets);
	}

	function removeWidget(id: string) {
		layout = removeItem(layout, id, { cols: 12 });
		widgets = widgets.filter((w) => w.id !== id);
		onchange?.(layout);
		onwidgetschange?.(widgets);
	}

	function typeOf(id: string): DashboardBuilderWidgetType {
		return widgets.find((w) => w.id === id)?.type ?? 'notes';
	}
</script>

<div class={['mx-auto w-full max-w-7xl space-y-5', className]}>
	<PageHeader {title} {description}>
		{#snippet actions()}
			<div class="flex flex-wrap items-center gap-2">
				<Button
					size="sm"
					variant={editable ? 'primary' : 'secondary'}
					onclick={() => (editable = !editable)}
				>
					{#if editable}
						<Eye class="h-3.5 w-3.5" aria-hidden="true" />
						View
					{:else}
						<Pencil class="h-3.5 w-3.5" aria-hidden="true" />
						Edit
					{/if}
				</Button>
				<Button size="sm" variant="secondary" onclick={reset}>
					<RotateCcw class="h-3.5 w-3.5" aria-hidden="true" />
					Reset
				</Button>
			</div>
		{/snippet}
	</PageHeader>

	<div class={['grid gap-5', showPicker && editable ? 'lg:grid-cols-[16rem_minmax(0,1fr)]' : '']}>
		{#if showPicker && editable}
			<aside class="min-w-0">
				<WidgetPicker widgets={catalog} onselect={addWidget} />
			</aside>
		{/if}

		<section class="min-w-0">
			<DashboardGrid
				bind:layout
				{widgets}
				{editable}
				cols={12}
				rowHeight={72}
				onchange={(next) => onchange?.(next)}
				onremove={removeWidget}
			>
				{#snippet render(meta)}
					{@const kind = typeOf(meta.id)}
					<div class="h-full overflow-auto p-3">
						{#if kind === 'stats'}
							<div class="grid grid-cols-2 gap-2">
								<StatCard label="Revenue" value="€48.2k" delta="+12%" trend="up" variant="ghost" />
								<StatCard label="Users" value="1,284" delta="+4%" trend="up" variant="ghost" />
							</div>
						{:else if kind === 'chart'}
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
						{:else if kind === 'goals'}
							<div class="space-y-3">
								<GoalProgress label="MRR target" current={72} target={100} unit="%" />
								<GoalProgress label="Onboarding" current={18} target={25} tone="success" />
							</div>
						{:else if kind === 'activity'}
							<div class="space-y-1">
								<AuditEventRow action="Deployed v2.4" actor="rafa" time={Date.now() - 3600000} />
								<AuditEventRow action="Invite accepted" actor="ana" severity="info" time={Date.now() - 7200000} />
								<AuditEventRow action="Billing updated" actor="system" severity="warning" time={Date.now() - 86400000} />
							</div>
						{:else if kind === 'list'}
							<List
								items={[
									{ id: '1', label: 'Ship dashboard builder' },
									{ id: '2', label: 'Polish desktop windows' },
									{ id: '3', label: 'Write Storybook demos' }
								]}
								variant="plain"
								size="sm"
							/>
						{:else}
							<p class="text-sm leading-relaxed text-secondary">
								Capture ideas, links, and follow-ups for this workspace. Edit mode lets you move and
								resize every widget.
							</p>
						{/if}
					</div>
				{/snippet}
			</DashboardGrid>
		</section>
	</div>
</div>
