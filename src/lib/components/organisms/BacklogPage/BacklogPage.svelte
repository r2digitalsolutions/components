<script lang="ts">
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import FilterSummary from '$lib/components/molecules/FilterSummary/FilterSummary.svelte';
	import type { FilterSummaryItem } from '$lib/components/molecules/FilterSummary/FilterSummary.svelte';
	import TaskRow from '$lib/components/molecules/TaskRow/TaskRow.svelte';
	import type { TaskPriority } from '$lib/components/molecules/TaskRow/TaskRow.svelte';
	import SelectionBox from '$lib/components/atoms/SelectionBox/SelectionBox.svelte';
	import BulkActionBar from '$lib/components/molecules/BulkActionBar/BulkActionBar.svelte';
	import TaskSummaryCard from '$lib/components/molecules/TaskSummaryCard/TaskSummaryCard.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	export interface BacklogTask {
		id: string;
		title: string;
		completed?: boolean;
		priority?: TaskPriority;
		due?: string;
		assignee?: string;
	}

	interface BacklogPageProps {
		title?: string;
		description?: string;
		tasks?: BacklogTask[];
		filters?: FilterSummaryItem[];
		selected?: string[];
		class?: string;
		ontoggle?: (id: string, completed: boolean) => void;
		onfilterclear?: (id: string) => void;
		onbulk?: (action: string, ids: string[]) => void;
	}

	let {
		title = 'Backlog',
		description = 'Prioritize and batch-update open work items.',
		tasks = [],
		filters = [],
		selected = $bindable<string[]>([]),
		class: className = '',
		ontoggle,
		onfilterclear,
		onbulk
	}: BacklogPageProps = $props();

	const doneCount = $derived(tasks.filter((t) => t.completed).length);
	const overdueCount = $derived(
		tasks.filter((t) => !t.completed && t.due).length
	);
	const selectedCount = $derived(selected.length);
	const allSelected = $derived(tasks.length > 0 && selected.length === tasks.length);
	const someSelected = $derived(selected.length > 0 && selected.length < tasks.length);

	function isSelected(id: string) {
		return selected.includes(id);
	}

	function toggleSelect(id: string, checked: boolean) {
		selected = checked ? [...selected, id] : selected.filter((x) => x !== id);
	}

	function toggleSelectAll(checked: boolean) {
		selected = checked ? tasks.map((t) => t.id) : [];
	}

	function clearSelection() {
		selected = [];
	}

	function handleBulk(action: string) {
		onbulk?.(action, [...selected]);
	}
</script>

<div class={['relative mx-auto w-full max-w-6xl space-y-5 pb-16', className]}>
	<PageHeader {title} {description}>
		{#snippet actions()}
			<Button size="sm" variant="secondary">Add task</Button>
		{/snippet}
	</PageHeader>

	{#if filters.length}
		<FilterSummary
			items={filters}
			onclear={(id) => onfilterclear?.(id)}
			onclearAll={() => filters.forEach((f) => onfilterclear?.(f.id))}
		/>
	{/if}

	<div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
		<section class="min-w-0 space-y-3">
			{#if tasks.length}
				<div
					class="flex items-center gap-3 rounded-xl border border-border bg-surface-overlay/50 px-3 py-2"
				>
					<SelectionBox
						checked={allSelected}
						indeterminate={someSelected}
						label="Select all tasks"
						onchange={toggleSelectAll}
					/>
					<span class="text-xs font-medium text-muted">
						{tasks.length} task{tasks.length === 1 ? '' : 's'}
					</span>
				</div>

				<ul class="space-y-2" role="list">
					{#each tasks as task (task.id)}
						<li class="flex items-stretch gap-2">
							<div class="flex shrink-0 items-center px-1">
								<SelectionBox
									checked={isSelected(task.id)}
									label={`Select ${task.title}`}
									onchange={(checked) => toggleSelect(task.id, checked)}
								/>
							</div>
							<div class="min-w-0 flex-1">
								<TaskRow
									title={task.title}
									completed={task.completed ?? false}
									priority={task.priority}
									due={task.due}
									assignee={task.assignee}
									ontoggle={(completed) => ontoggle?.(task.id, completed)}
								/>
							</div>
						</li>
					{/each}
				</ul>
			{:else}
				<EmptyState
					title="Backlog is empty"
					description="Add tasks to plan upcoming work."
				/>
			{/if}
		</section>

		<aside class="min-w-0 space-y-4">
			<TaskSummaryCard
				title="Sprint backlog"
				total={tasks.length}
				done={doneCount}
				overdue={overdueCount}
			/>
		</aside>
	</div>

	<BulkActionBar
		count={selectedCount}
		total={tasks.length}
		itemLabel="task"
		itemLabelPlural="tasks"
		placement="dock"
		actions={[
			{ id: 'complete', label: 'Mark done', variant: 'secondary' },
			{ id: 'assign', label: 'Assign', variant: 'secondary' },
			{ id: 'delete', label: 'Delete', variant: 'destructive', confirm: true }
		]}
		onaction={handleBulk}
		onclear={clearSelection}
		onselectall={() => toggleSelectAll(true)}
	/>
</div>
