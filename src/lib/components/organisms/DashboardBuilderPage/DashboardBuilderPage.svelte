<script lang="ts">
	import type { Snippet } from 'svelte';
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import WidgetPicker from '$lib/components/molecules/WidgetPicker/WidgetPicker.svelte';
	import type { WidgetCatalogItem } from '$lib/components/molecules/WidgetPicker/WidgetPicker.svelte';
	import DashboardGrid from '$lib/components/organisms/DashboardGrid/DashboardGrid.svelte';
	import type { DashboardWidgetMeta } from '$lib/components/organisms/DashboardGrid/DashboardGrid.svelte';
	import type { GridDensity } from '$lib/utils/layoutGrid.js';
	import StatCard from '$lib/components/molecules/StatCard/StatCard.svelte';
	import GoalProgress from '$lib/components/molecules/GoalProgress/GoalProgress.svelte';
	import AuditEventRow from '$lib/components/molecules/AuditEventRow/AuditEventRow.svelte';
	import List from '$lib/components/molecules/List/List.svelte';
	import UsageBreakdown from '$lib/components/molecules/UsageBreakdown/UsageBreakdown.svelte';
	import AvatarGroup from '$lib/components/molecules/AvatarGroup/AvatarGroup.svelte';
	import StatStrip from '$lib/components/molecules/StatStrip/StatStrip.svelte';
	import AutosaveIndicator from '$lib/components/molecules/AutosaveIndicator/AutosaveIndicator.svelte';
	import type { AutosaveStatus } from '$lib/components/molecules/AutosaveIndicator/AutosaveIndicator.svelte';
	import SegmentedControl from '$lib/components/molecules/SegmentedControl/SegmentedControl.svelte';
	import {
		type GridItem,
		addItem,
		removeItem,
		layoutBounds,
		compactLayout
	} from '$lib/utils/layoutGrid.js';
	import Save from '@lucide/svelte/icons/save';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import LayoutTemplate from '@lucide/svelte/icons/layout-template';

	export type DashboardBuilderWidgetType =
		| 'stats'
		| 'chart'
		| 'activity'
		| 'goals'
		| 'list'
		| 'notes'
		| 'usage'
		| 'team'
		| 'calendar';

	export interface DashboardBuilderWidget extends DashboardWidgetMeta {
		type: DashboardBuilderWidgetType;
	}

	export type DashboardBuilderSidebarTab = 'catalog' | 'canvas';

	const CATALOG: WidgetCatalogItem[] = [
		{
			id: 'stats',
			label: 'Stats',
			description: 'KPI cards at a glance',
			icon: '▣',
			category: 'Metrics',
			tone: 'brand',
			defaultW: 4,
			defaultH: 2
		},
		{
			id: 'chart',
			label: 'Chart',
			description: 'Trend bars placeholder',
			icon: '▤',
			category: 'Metrics',
			tone: 'sky',
			defaultW: 8,
			defaultH: 3
		},
		{
			id: 'goals',
			label: 'Goals',
			description: 'Progress toward targets',
			icon: '◎',
			category: 'Metrics',
			tone: 'emerald',
			defaultW: 4,
			defaultH: 2
		},
		{
			id: 'usage',
			label: 'Usage',
			description: 'Storage & bandwidth mix',
			icon: '▥',
			category: 'Metrics',
			tone: 'violet',
			defaultW: 6,
			defaultH: 2
		},
		{
			id: 'activity',
			label: 'Activity',
			description: 'Recent audit events',
			icon: '⚡',
			category: 'People',
			tone: 'amber',
			defaultW: 6,
			defaultH: 3
		},
		{
			id: 'team',
			label: 'Team',
			description: 'Avatar stack + count',
			icon: '☺',
			category: 'People',
			tone: 'rose',
			defaultW: 4,
			defaultH: 2
		},
		{
			id: 'list',
			label: 'Checklist',
			description: 'Priorities and todos',
			icon: '✓',
			category: 'Content',
			tone: 'emerald',
			defaultW: 4,
			defaultH: 3
		},
		{
			id: 'notes',
			label: 'Notes',
			description: 'Freeform text block',
			icon: '¶',
			category: 'Content',
			tone: 'sky',
			defaultW: 4,
			defaultH: 2
		},
		{
			id: 'calendar',
			label: 'Calendar',
			description: 'Upcoming dates strip',
			icon: '▦',
			category: 'Content',
			tone: 'brand',
			defaultW: 6,
			defaultH: 2
		}
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
		showToolbar?: boolean;
		showStats?: boolean;
		showSave?: boolean;
		cols?: number;
		rowHeight?: number;
		gap?: number;
		compact?: boolean;
		showGrid?: boolean;
		density?: GridDensity | 'custom';
		sidebarTab?: DashboardBuilderSidebarTab;
		saveStatus?: AutosaveStatus;
		lastSaved?: string;
		class?: string;
		/** Custom body override per widget */
		render?: Snippet<[DashboardBuilderWidget, GridItem]>;
		onchange?: (layout: GridItem[]) => void;
		onwidgetschange?: (widgets: DashboardBuilderWidget[]) => void;
		onsave?: (payload: { layout: GridItem[]; widgets: DashboardBuilderWidget[] }) => void;
		onreset?: () => void;
	}

	let {
		title = 'Dashboard builder',
		description = 'Drag, resize, and add widgets to craft your workspace overview.',
		layout = $bindable([...DEFAULT_LAYOUT] as GridItem[]),
		widgets = $bindable([...DEFAULT_WIDGETS] as DashboardBuilderWidget[]),
		catalog = CATALOG,
		editable = $bindable(true),
		showPicker = true,
		showToolbar = true,
		showStats = true,
		showSave = true,
		cols = $bindable(12),
		rowHeight = $bindable(72),
		gap = $bindable(12),
		compact = $bindable(true),
		showGrid = $bindable(true),
		density = $bindable<GridDensity | 'custom'>('default'),
		sidebarTab = $bindable<DashboardBuilderSidebarTab>('catalog'),
		saveStatus = $bindable<AutosaveStatus>('idle'),
		lastSaved = $bindable<string | undefined>(undefined),
		class: className = '',
		render,
		onchange,
		onwidgetschange,
		onsave,
		onreset
	}: DashboardBuilderPageProps = $props();

	let uid = $state(1);
	let pickerQuery = $state('');
	let pickerCategory = $state('all');

	const stats = $derived([
		{ id: 'widgets', label: 'Widgets', value: widgets.length },
		{ id: 'cols', label: 'Columns', value: cols },
		{
			id: 'rows',
			label: 'Rows used',
			value: layoutBounds(layout).rows || 0
		},
		{
			id: 'mode',
			label: 'Mode',
			value: editable ? 'Editing' : 'Preview',
			hint: density === 'custom' ? 'Custom density' : String(density)
		}
	]);

	function markDirty() {
		if (saveStatus !== 'saving') saveStatus = 'dirty';
	}

	function reset() {
		layout = DEFAULT_LAYOUT.map((it) => ({ ...it }));
		widgets = DEFAULT_WIDGETS.map((w) => ({ ...w }));
		cols = 12;
		rowHeight = 72;
		gap = 12;
		compact = true;
		showGrid = true;
		density = 'default';
		editable = true;
		saveStatus = 'idle';
		onchange?.(layout);
		onwidgetschange?.(widgets);
		onreset?.();
	}

	function addWidget(typeId: string) {
		const def = catalog.find((w) => w.id === typeId);
		if (!def) return;
		const id = `w-${typeId}-${uid++}`;
		const bounds = layoutBounds(layout);
		const w = Math.min(def.defaultW ?? 4, cols);
		const nextItem: GridItem = {
			id,
			x: 0,
			y: bounds.rows,
			w,
			h: def.defaultH ?? 2,
			minW: 2,
			minH: 2
		};
		layout = addItem(layout, nextItem, { cols, compact });
		widgets = [
			...widgets,
			{
				id,
				title: def.label,
				description: def.description,
				type: typeId as DashboardBuilderWidgetType
			}
		];
		editable = true;
		markDirty();
		onchange?.(layout);
		onwidgetschange?.(widgets);
		sidebarTab = 'canvas';
	}

	function removeWidget(id: string) {
		layout = removeItem(layout, id, { cols, compact });
		widgets = widgets.filter((w) => w.id !== id);
		markDirty();
		onchange?.(layout);
		onwidgetschange?.(widgets);
	}

	function clearAll() {
		layout = [];
		widgets = [];
		markDirty();
		onchange?.(layout);
		onwidgetschange?.(widgets);
	}

	function compactNow() {
		layout = compactLayout(layout, cols);
		markDirty();
		onchange?.(layout);
	}

	function save() {
		saveStatus = 'saving';
		onsave?.({ layout, widgets });
		window.setTimeout(() => {
			saveStatus = 'saved';
			lastSaved = 'just now';
		}, 450);
	}

	function typeOf(id: string): DashboardBuilderWidgetType {
		return widgets.find((w) => w.id === id)?.type ?? 'notes';
	}

	function widgetOf(id: string): DashboardBuilderWidget {
		return (
			widgets.find((w) => w.id === id) ?? {
				id,
				title: id,
				type: 'notes'
			}
		);
	}

	const showSidebar = $derived(showPicker && editable);
</script>

<div class={['mx-auto w-full max-w-7xl space-y-5', className]}>
	<PageHeader {title} {description}>
		{#snippet meta()}
			<div class="flex flex-wrap items-center gap-3">
				{#if showSave}
					<AutosaveIndicator status={saveStatus} {lastSaved} />
				{/if}
				<Badge size="sm" variant="secondary" class="tabular-nums">
					{widgets.length} widgets · {cols} cols
				</Badge>
			</div>
		{/snippet}
		{#snippet actions()}
			<div class="flex flex-wrap items-center gap-2">
				{#if showSave}
					<Button
						size="sm"
						variant={saveStatus === 'dirty' ? 'primary' : 'secondary'}
						disabled={saveStatus !== 'dirty' && saveStatus !== 'error'}
						onclick={save}
					>
						<Save class="h-3.5 w-3.5" strokeWidth={2} />
						Save
					</Button>
				{/if}
				<Button size="sm" variant="secondary" onclick={reset}>
					<LayoutTemplate class="h-3.5 w-3.5" strokeWidth={2} />
					Reset layout
				</Button>
			</div>
		{/snippet}
	</PageHeader>

	{#if showStats}
		<StatStrip items={stats} />
	{/if}

	<div class={['grid gap-5', showSidebar ? 'lg:grid-cols-[17.5rem_minmax(0,1fr)]' : '']}>
		{#if showSidebar}
			<aside class="min-w-0 space-y-3">
				<SegmentedControl
					size="sm"
					fullWidth
					bind:value={sidebarTab}
					items={[
						{ id: 'catalog', label: 'Catalog' },
						{ id: 'canvas', label: `On canvas (${widgets.length})` }
					]}
				/>

				{#if sidebarTab === 'catalog'}
					<WidgetPicker
						widgets={catalog}
						layout="list"
						columns={1}
						bind:query={pickerQuery}
						bind:category={pickerCategory}
						onselect={addWidget}
					/>
				{:else}
					<section class="rounded-xl border border-border bg-surface-elevated p-3 sm:p-4">
						<div class="mb-3 flex items-center justify-between gap-2">
							<h3 class="text-sm font-semibold text-primary">On canvas</h3>
							{#if widgets.length}
								<Button size="xs" variant="ghost" onclick={clearAll}>
									<Trash2 class="h-3.5 w-3.5" strokeWidth={2} />
									Clear
								</Button>
							{/if}
						</div>
						{#if !widgets.length}
							<p class="text-xs text-muted">No widgets yet. Add some from Catalog.</p>
						{:else}
							<ul class="max-h-[28rem] space-y-1.5 overflow-y-auto">
								{#each widgets as w (w.id)}
									{@const item = layout.find((it) => it.id === w.id)}
									<li
										class="flex items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-2"
									>
										<div class="min-w-0 flex-1">
											<p class="truncate text-sm font-medium text-primary">{w.title}</p>
											<p class="text-[11px] tabular-nums text-muted">
												{w.type}
												{#if item}
													· {item.w}×{item.h} @ {item.x},{item.y}
												{/if}
											</p>
										</div>
										<Button size="xs" variant="ghost" onclick={() => removeWidget(w.id)}>
											Remove
										</Button>
									</li>
								{/each}
							</ul>
							<div class="mt-3">
								<Button size="sm" variant="secondary" class="w-full" onclick={compactNow}>
									Compact layout
								</Button>
							</div>
						{/if}
					</section>
				{/if}
			</aside>
		{/if}

		<section class="min-w-0">
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
				emptyTitle="Empty dashboard"
				emptyDescription="Add widgets from the catalog or reset to the starter layout."
				onadd={editable ? () => (sidebarTab = 'catalog') : undefined}
				onreset={reset}
				onchange={(next) => {
					markDirty();
					onchange?.(next);
				}}
				onsettingschange={() => markDirty()}
				onremove={removeWidget}
			>
				{#snippet render(meta, item)}
					{@const full = widgetOf(meta.id)}
					{@const kind = typeOf(meta.id)}
					{#if render}
						{@render render(full, item)}
					{:else}
						<div class="h-full overflow-auto p-3">
							{#if kind === 'stats'}
								<div class="grid grid-cols-2 gap-2">
									<StatCard
										label="Revenue"
										value="€48.2k"
										delta="+12%"
										trend="up"
										variant="ghost"
									/>
									<StatCard
										label="Users"
										value="1,284"
										delta="+4%"
										trend="up"
										variant="ghost"
									/>
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
							{:else if kind === 'usage'}
								<UsageBreakdown
									class="!border-0 !bg-transparent !p-0 !shadow-none"
									unit=" GB"
									items={[
										{ id: 'storage', label: 'Storage', value: 42, max: 100 },
										{ id: 'bandwidth', label: 'Bandwidth', value: 18, max: 50 },
										{ id: 'api', label: 'API', value: 8, max: 20 }
									]}
								/>
							{:else if kind === 'activity'}
								<div class="space-y-1">
									<AuditEventRow
										action="Deployed v2.4"
										actor="rafa"
										time={Date.now() - 3600000}
									/>
									<AuditEventRow
										action="Invite accepted"
										actor="ana"
										severity="info"
										time={Date.now() - 7200000}
									/>
									<AuditEventRow
										action="Billing updated"
										actor="system"
										severity="warning"
										time={Date.now() - 86400000}
									/>
								</div>
							{:else if kind === 'team'}
								<div class="flex h-full flex-col justify-between gap-3">
									<div>
										<p class="text-sm font-medium text-primary">Product squad</p>
										<p class="text-xs text-muted">12 members · 3 online</p>
									</div>
									<AvatarGroup
										size="sm"
										ring="elevated"
										max={5}
										items={[
											{ id: '1', name: 'Ana' },
											{ id: '2', name: 'Ben' },
											{ id: '3', name: 'Cora' },
											{ id: '4', name: 'Dan' },
											{ id: '5', name: 'Eve' },
											{ id: '6', name: 'Fay' }
										]}
									/>
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
							{:else if kind === 'calendar'}
								<ul class="space-y-2">
									{#each [
										{ d: 'Mon', t: 'Design critique', time: '10:00' },
										{ d: 'Wed', t: 'Release freeze', time: '14:30' },
										{ d: 'Fri', t: 'Demo day', time: '16:00' }
									] as ev, i (i)}
										<li class="flex items-center gap-3 text-sm">
											<span
												class="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-lg bg-surface-overlay text-[10px] font-semibold uppercase leading-tight text-secondary"
											>
												{ev.d}
											</span>
											<span class="min-w-0 flex-1 truncate text-primary">{ev.t}</span>
											<span class="tabular-nums text-xs text-muted">{ev.time}</span>
										</li>
									{/each}
								</ul>
							{:else}
								<p class="text-sm leading-relaxed text-secondary">
									Capture ideas, links, and follow-ups. Use the toolbar to change columns and
									density — widgets rescale.
								</p>
							{/if}
						</div>
					{/if}
				{/snippet}
			</DashboardGrid>
		</section>
	</div>
</div>
