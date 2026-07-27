<script lang="ts">
	import type { Snippet } from 'svelte';
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import type { BreadcrumbItem } from '$lib/components/molecules/Breadcrumb/Breadcrumb.svelte';
	import FilterBar from '$lib/components/molecules/FilterBar/FilterBar.svelte';
	import type { FilterChip } from '$lib/components/molecules/FilterBar/FilterBar.svelte';
	import FilterSummary from '$lib/components/molecules/FilterSummary/FilterSummary.svelte';
	import type { FilterSummaryItem } from '$lib/components/molecules/FilterSummary/FilterSummary.svelte';
	import TaskRow from '$lib/components/molecules/TaskRow/TaskRow.svelte';
	import type { TaskPriority } from '$lib/components/molecules/TaskRow/TaskRow.svelte';
	import SelectionBox from '$lib/components/atoms/SelectionBox/SelectionBox.svelte';
	import BulkActionBar from '$lib/components/molecules/BulkActionBar/BulkActionBar.svelte';
	import type { BulkAction } from '$lib/components/molecules/BulkActionBar/BulkActionBar.svelte';
	import TaskSummaryCard from '$lib/components/molecules/TaskSummaryCard/TaskSummaryCard.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import LoadingOverlay from '$lib/components/molecules/LoadingOverlay/LoadingOverlay.svelte';
	import SegmentedControl from '$lib/components/molecules/SegmentedControl/SegmentedControl.svelte';
	import Select from '$lib/components/molecules/Select/Select.svelte';
	import type { SelectOption } from '$lib/components/molecules/Select/Select.svelte';
	import StatStrip from '$lib/components/molecules/StatStrip/StatStrip.svelte';
	import type { StatStripItem } from '$lib/components/molecules/StatStrip/StatStrip.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Chip from '$lib/components/atoms/Chip/Chip.svelte';

	export type BacklogView = 'all' | 'open' | 'done' | 'overdue';
	export type BacklogSort = 'priority' | 'due' | 'title' | 'assignee';

	export interface BacklogTask {
		id: string;
		title: string;
		completed?: boolean;
		priority?: TaskPriority;
		/** Display label, e.g. "Jul 28" */
		due?: string;
		/** ISO date (YYYY-MM-DD) for overdue + sort */
		dueDate?: string;
		assignee?: string;
		epic?: string;
		estimate?: string;
		tags?: string[];
	}

	interface BacklogPageProps {
		title?: string;
		description?: string;
		breadcrumbs?: BreadcrumbItem[];
		tasks?: BacklogTask[];
		/** Active filter chips (FilterBar) */
		filters?: FilterChip[];
		/** Legacy summary chips under the bar */
		filterSummary?: FilterSummaryItem[];
		query?: string;
		view?: BacklogView;
		sort?: BacklogSort;
		selected?: string[];
		stats?: StatStripItem[];
		loading?: boolean;
		selectable?: boolean;
		readonly?: boolean;
		showSidebar?: boolean;
		showSearch?: boolean;
		showViewFilter?: boolean;
		showSort?: boolean;
		showBulkActions?: boolean;
		summaryTitle?: string;
		addLabel?: string;
		searchPlaceholder?: string;
		emptyTitle?: string;
		emptyDescription?: string;
		bulkActions?: BulkAction[];
		class?: string;
		actions?: Snippet;
		toolbar?: Snippet;
		sidebar?: Snippet;
		emptyAction?: Snippet;
		onadd?: () => void;
		ontoggle?: (id: string, completed: boolean) => void;
		onclicktask?: (id: string) => void;
		onfilterclear?: (id: string) => void;
		onfilterclearall?: () => void;
		onbulk?: (action: string, ids: string[]) => void;
		onquerychange?: (query: string) => void;
		onviewchange?: (view: BacklogView) => void;
		onsortchange?: (sort: BacklogSort) => void;
	}

	const PRIORITY_RANK: Record<TaskPriority, number> = { high: 0, med: 1, low: 2 };

	let {
		title = 'Backlog',
		description = 'Prioritize and batch-update open work items.',
		breadcrumbs = [],
		tasks = [],
		filters = $bindable<FilterChip[]>([]),
		filterSummary = [],
		query = $bindable(''),
		view = $bindable<BacklogView>('all'),
		sort = $bindable<BacklogSort>('priority'),
		selected = $bindable<string[]>([]),
		stats = [],
		loading = false,
		selectable = true,
		readonly = false,
		showSidebar = true,
		showSearch = true,
		showViewFilter = true,
		showSort = true,
		showBulkActions = true,
		summaryTitle = 'Sprint backlog',
		addLabel = 'Add task',
		searchPlaceholder = 'Search tasks, assignees, tags…',
		emptyTitle = 'Backlog is empty',
		emptyDescription = 'Add tasks to plan upcoming work.',
		bulkActions = [
			{ id: 'complete', label: 'Mark done', variant: 'secondary' },
			{ id: 'assign', label: 'Assign', variant: 'secondary' },
			{ id: 'priority', label: 'Set priority', variant: 'secondary', overflow: true },
			{ id: 'delete', label: 'Delete', variant: 'destructive', confirm: true }
		],
		class: className = '',
		actions,
		toolbar,
		sidebar,
		emptyAction,
		onadd,
		ontoggle,
		onclicktask,
		onfilterclear,
		onfilterclearall,
		onbulk,
		onquerychange,
		onviewchange,
		onsortchange
	}: BacklogPageProps = $props();

	function isOverdue(task: BacklogTask): boolean {
		if (task.completed) return false;
		if (task.dueDate) {
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const due = new Date(task.dueDate + 'T00:00:00');
			return due < today;
		}
		return false;
	}

	const openCount = $derived(tasks.filter((t) => !t.completed).length);
	const doneCount = $derived(tasks.filter((t) => t.completed).length);
	const overdueCount = $derived(tasks.filter(isOverdue).length);

	const viewItems = $derived([
		{ id: 'all', label: `All (${tasks.length})` },
		{ id: 'open', label: `Open (${openCount})` },
		{ id: 'done', label: `Done (${doneCount})` },
		{ id: 'overdue', label: `Overdue (${overdueCount})` }
	]);

	const visibleTasks = $derived.by(() => {
		const q = query.trim().toLowerCase();
		let list = tasks.filter((task) => {
			if (view === 'open' && task.completed) return false;
			if (view === 'done' && !task.completed) return false;
			if (view === 'overdue' && !isOverdue(task)) return false;
			if (!q) return true;
			const hay = [
				task.title,
				task.assignee,
				task.epic,
				task.estimate,
				...(task.tags ?? [])
			]
				.filter(Boolean)
				.join(' ')
				.toLowerCase();
			return hay.includes(q);
		});

		list = [...list].sort((a, b) => {
			if (sort === 'title') return a.title.localeCompare(b.title);
			if (sort === 'assignee') return (a.assignee ?? '').localeCompare(b.assignee ?? '');
			if (sort === 'due') {
				const ad = a.dueDate ?? a.due ?? '';
				const bd = b.dueDate ?? b.due ?? '';
				return ad.localeCompare(bd);
			}
			const ap = a.priority ? PRIORITY_RANK[a.priority] : 9;
			const bp = b.priority ? PRIORITY_RANK[b.priority] : 9;
			return ap - bp;
		});

		return list;
	});

	const selectedCount = $derived(selected.length);
	const allSelected = $derived(
		visibleTasks.length > 0 && visibleTasks.every((t) => selected.includes(t.id))
	);
	const someSelected = $derived(
		selectedCount > 0 && !allSelected && visibleTasks.some((t) => selected.includes(t.id))
	);

	function isSelected(id: string) {
		return selected.includes(id);
	}

	function toggleSelect(id: string, checked: boolean) {
		selected = checked ? [...new Set([...selected, id])] : selected.filter((x) => x !== id);
	}

	function toggleSelectAll(checked: boolean) {
		const ids = visibleTasks.map((t) => t.id);
		selected = checked
			? [...new Set([...selected, ...ids])]
			: selected.filter((id) => !ids.includes(id));
	}

	function clearSelection() {
		selected = [];
	}

	function handleBulk(action: string) {
		onbulk?.(action, [...selected]);
	}

	function handleView(id: string) {
		view = id as BacklogView;
		onviewchange?.(view);
	}

	const priorityOrder: TaskPriority[] = ['high', 'med', 'low'];

	const sortOptions: SelectOption[] = [
		{ value: 'priority', label: 'Priority' },
		{ value: 'due', label: 'Due date' },
		{ value: 'title', label: 'Title' },
		{ value: 'assignee', label: 'Assignee' }
	];

	function handleSort(value: string) {
		sort = value as BacklogSort;
		onsortchange?.(sort);
	}
</script>

<div class={['relative mx-auto w-full max-w-6xl space-y-5 pb-16', className]}>
	<PageHeader {title} {description} {breadcrumbs}>
		{#snippet actions()}
			{#if actions}
				{@render actions()}
			{:else}
				<Button size="sm" variant="secondary" onclick={() => onadd?.()}>{addLabel}</Button>
			{/if}
		{/snippet}
	</PageHeader>

	{#if stats.length}
		<StatStrip items={stats} />
	{/if}

	{#if showSearch || filters.length || toolbar}
		<FilterBar
			bind:query
			bind:filters
			searchable={showSearch}
			placeholder={searchPlaceholder}
			onquerychange={onquerychange}
			onremovefilter={(id) => onfilterclear?.(id)}
			onclear={() => onfilterclearall?.()}
		>
			{#snippet actions()}
				{#if toolbar}
					{@render toolbar()}
				{/if}
			{/snippet}
		</FilterBar>
	{/if}

	{#if filterSummary.length}
		<FilterSummary
			items={filterSummary}
			onclear={(id) => onfilterclear?.(id)}
			onclearAll={() => onfilterclearall?.() ?? filterSummary.forEach((f) => onfilterclear?.(f.id))}
		/>
	{/if}

	{#if showViewFilter || showSort}
		<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			{#if showViewFilter}
				<SegmentedControl
					items={viewItems}
					bind:value={view}
					size="sm"
					onchange={handleView}
					class="w-full sm:w-auto"
				/>
			{/if}
			{#if showSort}
				<div class="w-full sm:w-44">
					<Select
						label="Sort"
						options={sortOptions}
						bind:value={sort}
						size="sm"
						onchange={handleSort}
					/>
				</div>
			{/if}
		</div>
	{/if}

	<div
		class={[
			'grid gap-5',
			showSidebar ? 'lg:grid-cols-[minmax(0,1fr)_18rem]' : 'grid-cols-1'
		]}
	>
		<section class="relative min-w-0 space-y-3">
			<LoadingOverlay active={loading} class="min-h-[14rem] rounded-xl">
				{#if visibleTasks.length}
					{#if selectable}
						<div
							class="mb-3 flex items-center gap-3 rounded-xl border border-border bg-surface-overlay/50 px-3 py-2"
						>
							<SelectionBox
								checked={allSelected}
								indeterminate={someSelected}
								label="Select all visible tasks"
								onchange={toggleSelectAll}
							/>
							<span class="text-xs font-medium text-muted">
								{visibleTasks.length} task{visibleTasks.length === 1 ? '' : 's'}
								{#if visibleTasks.length !== tasks.length}
									<span class="text-secondary">of {tasks.length}</span>
								{/if}
							</span>
						</div>
					{:else}
						<p class="mb-3 px-1 text-xs font-medium text-muted">
							{visibleTasks.length} task{visibleTasks.length === 1 ? '' : 's'}
						</p>
					{/if}

					<ul class="space-y-2" role="list">
						{#each visibleTasks as task (task.id)}
							<li class="flex items-stretch gap-2">
								{#if selectable}
									<div class="flex shrink-0 items-center px-1">
										<SelectionBox
											checked={isSelected(task.id)}
											label={`Select ${task.title}`}
											onchange={(checked) => toggleSelect(task.id, checked)}
										/>
									</div>
								{/if}
								<div class="min-w-0 flex-1 space-y-1.5">
									<TaskRow
										title={task.title}
										completed={task.completed ?? false}
										priority={task.priority}
										due={task.due}
										assignee={task.assignee}
										{readonly}
										ontoggle={readonly ? undefined : (completed) => ontoggle?.(task.id, completed)}
										onclick={() => onclicktask?.(task.id)}
									/>
									{#if task.epic || task.estimate || task.tags?.length || isOverdue(task)}
										<div class="flex flex-wrap items-center gap-1.5">
											{#if isOverdue(task)}
												<Badge size="sm" variant="error">Overdue</Badge>
											{/if}
											{#if task.epic}
												<Badge size="sm" variant="secondary">{task.epic}</Badge>
											{/if}
											{#if task.estimate}
												<span class="text-[11px] tabular-nums text-muted">{task.estimate}</span>
											{/if}
											{#each task.tags ?? [] as tag (tag)}
												<Chip size="sm">{tag}</Chip>
											{/each}
										</div>
									{/if}
								</div>
							</li>
						{/each}
					</ul>
				{:else if !loading}
					<EmptyState title={emptyTitle} description={emptyDescription}>
						{#snippet action()}
							{#if emptyAction}
								{@render emptyAction()}
							{:else}
								<Button size="sm" variant="secondary" onclick={() => onadd?.()}>{addLabel}</Button>
							{/if}
						{/snippet}
					</EmptyState>
				{/if}
			</LoadingOverlay>
		</section>

		{#if showSidebar}
			<aside class="min-w-0 space-y-4">
				{#if sidebar}
					{@render sidebar()}
				{:else}
					<TaskSummaryCard
						title={summaryTitle}
						total={tasks.length}
						done={doneCount}
						overdue={overdueCount}
					/>
					<div class="rounded-xl border border-border bg-surface-elevated p-4">
						<p class="text-sm font-semibold text-primary">By priority</p>
						<ul class="mt-3 space-y-2 text-xs text-muted">
							{#each priorityOrder as p (p)}
								{@const count = tasks.filter((t) => !t.completed && t.priority === p).length}
								<li class="flex items-center justify-between gap-2">
									<span class="capitalize">{p === 'med' ? 'Medium' : p}</span>
									<span class="font-medium tabular-nums text-secondary">{count}</span>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</aside>
		{/if}
	</div>

	{#if showBulkActions && selectable}
		<BulkActionBar
			count={selectedCount}
			total={visibleTasks.length}
			itemLabel="task"
			itemLabelPlural="tasks"
			placement="dock"
			actions={bulkActions}
			onaction={handleBulk}
			onclear={clearSelection}
			onselectall={() => toggleSelectAll(true)}
		/>
	{/if}
</div>
