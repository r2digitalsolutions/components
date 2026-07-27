<script lang="ts">
	import type { Snippet } from 'svelte';
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import type { BreadcrumbItem } from '$lib/components/molecules/Breadcrumb/Breadcrumb.svelte';
	import TaskSummaryCard from '$lib/components/molecules/TaskSummaryCard/TaskSummaryCard.svelte';
	import GoalProgress from '$lib/components/molecules/GoalProgress/GoalProgress.svelte';
	import type { GoalProgressTone } from '$lib/components/molecules/GoalProgress/GoalProgress.svelte';
	import TaskRow from '$lib/components/molecules/TaskRow/TaskRow.svelte';
	import type { TaskPriority } from '$lib/components/molecules/TaskRow/TaskRow.svelte';
	import PresenceList from '$lib/components/molecules/PresenceList/PresenceList.svelte';
	import type { PresenceUser } from '$lib/components/molecules/PresenceList/PresenceList.svelte';
	import FormSection from '$lib/components/molecules/FormSection/FormSection.svelte';
	import Timeline from '$lib/components/molecules/Timeline/Timeline.svelte';
	import type { TimelineItem } from '$lib/components/molecules/Timeline/Timeline.svelte';
	import ActivityFeed from '$lib/components/organisms/ActivityFeed/ActivityFeed.svelte';
	import type { ActivityItem } from '$lib/components/organisms/ActivityFeed/ActivityFeed.svelte';
	import StatStrip from '$lib/components/molecules/StatStrip/StatStrip.svelte';
	import type { StatStripItem } from '$lib/components/molecules/StatStrip/StatStrip.svelte';
	import AvatarGroup from '$lib/components/molecules/AvatarGroup/AvatarGroup.svelte';
	import type { AvatarGroupItem } from '$lib/components/molecules/AvatarGroup/AvatarGroup.svelte';
	import Tabs from '$lib/components/molecules/Tabs/Tabs.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import Grid from '$lib/components/atoms/Grid/Grid.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Chip from '$lib/components/atoms/Chip/Chip.svelte';
	import ProgressBar from '$lib/components/atoms/ProgressBar/ProgressBar.svelte';

	export type ProjectStatus = 'on-track' | 'at-risk' | 'blocked' | 'completed' | 'draft';

	export interface ProjectTaskSummary {
		title: string;
		total: number;
		done: number;
		overdue?: number;
	}

	export interface ProjectGoal {
		id?: string;
		label: string;
		current: number;
		target: number;
		unit?: string;
		tone?: GoalProgressTone;
	}

	export interface ProjectTask {
		id: string;
		title: string;
		completed?: boolean;
		priority?: TaskPriority;
		due?: string;
		assignee?: string;
	}

	export interface ProjectLink {
		id: string;
		label: string;
		href?: string;
		description?: string;
	}

	export interface ProjectMilestone extends TimelineItem {}

	interface ProjectOverviewPageProps {
		title: string;
		description?: string;
		status?: ProjectStatus | string;
		statusLabel?: string;
		breadcrumbs?: BreadcrumbItem[];
		tags?: string[];
		/** Overall completion 0–100 */
		progress?: number;
		dueDate?: string;
		stats?: StatStripItem[];
		summary?: ProjectTaskSummary[];
		goals?: ProjectGoal[];
		tasks?: ProjectTask[];
		milestones?: ProjectMilestone[];
		activity?: ActivityItem[];
		members?: PresenceUser[];
		links?: ProjectLink[];
		tab?: 'overview' | 'tasks' | 'activity';
		showTabs?: boolean;
		loading?: boolean;
		emptyTasksTitle?: string;
		emptyTasksDescription?: string;
		class?: string;
		actions?: Snippet;
		sidebar?: Snippet;
		ontoggleTask?: (id: string, completed: boolean) => void;
		onclickTask?: (id: string) => void;
		onclickLink?: (id: string) => void;
		onviewAllTasks?: () => void;
		ontabchange?: (tab: 'overview' | 'tasks' | 'activity') => void;
		onaddTask?: () => void;
	}

	const STATUS_BADGE: Record<
		ProjectStatus,
		{ variant: 'success' | 'warning' | 'error' | 'secondary' | 'info'; label: string }
	> = {
		'on-track': { variant: 'success', label: 'On track' },
		'at-risk': { variant: 'warning', label: 'At risk' },
		blocked: { variant: 'error', label: 'Blocked' },
		completed: { variant: 'info', label: 'Completed' },
		draft: { variant: 'secondary', label: 'Draft' }
	};

	let {
		title,
		description = 'Overview of progress, goals, and team activity.',
		status = 'on-track',
		statusLabel,
		breadcrumbs = [],
		tags = [],
		progress,
		dueDate = '',
		stats = [],
		summary = [],
		goals = [],
		tasks = [],
		milestones = [],
		activity = [],
		members = [],
		links = [],
		tab = $bindable<'overview' | 'tasks' | 'activity'>('overview'),
		showTabs = true,
		loading = false,
		emptyTasksTitle = 'No tasks yet',
		emptyTasksDescription = 'Create work items to track progress on this project.',
		class: className = '',
		actions,
		sidebar,
		ontoggleTask,
		onclickTask,
		onclickLink,
		onviewAllTasks,
		ontabchange,
		onaddTask
	}: ProjectOverviewPageProps = $props();

	const statusMeta = $derived.by(() => {
		const key = status as ProjectStatus;
		if (STATUS_BADGE[key]) {
			return {
				variant: STATUS_BADGE[key].variant,
				label: statusLabel || STATUS_BADGE[key].label
			};
		}
		return {
			variant: 'secondary' as const,
			label: statusLabel || String(status)
		};
	});

	const avatarItems = $derived(
		members.map(
			(m): AvatarGroupItem => ({
				id: m.id,
				name: m.name,
				src: m.avatar
			})
		)
	);

	const openTasks = $derived(tasks.filter((t) => !t.completed).length);
	const doneTasks = $derived(tasks.filter((t) => t.completed).length);
	const computedProgress = $derived(
		progress ?? (tasks.length ? Math.round((doneTasks / tasks.length) * 100) : 0)
	);

	const tabItems = $derived([
		{ id: 'overview', label: 'Overview' },
		{ id: 'tasks', label: `Tasks (${tasks.length})` },
		{ id: 'activity', label: 'Activity' }
	]);

	function handleTab(id: string) {
		tab = id as 'overview' | 'tasks' | 'activity';
		ontabchange?.(tab);
	}
</script>

<div class={['mx-auto w-full max-w-5xl space-y-6', className]}>
	<PageHeader {title} {description} {breadcrumbs}>
		{#snippet meta()}
			<div class="flex flex-wrap items-center gap-2">
				<Badge size="sm" variant={statusMeta.variant} dot>{statusMeta.label}</Badge>
				{#if dueDate}
					<span class="text-xs text-muted">Due {dueDate}</span>
				{/if}
				{#each tags as tag (tag)}
					<Chip size="sm">{tag}</Chip>
				{/each}
			</div>
		{/snippet}
		{#snippet actions()}
			{#if actions}
				{@render actions()}
			{:else}
				{#if members.length}
					<AvatarGroup items={avatarItems} max={4} size="sm" />
				{/if}
				<Button size="sm" variant="secondary" onclick={() => onaddTask?.()}>Add task</Button>
			{/if}
		{/snippet}
	</PageHeader>

	{#if progress != null || tasks.length}
		<div class="rounded-xl border border-border bg-surface-elevated px-4 py-3">
			<div class="mb-2 flex items-center justify-between gap-3">
				<p class="text-xs font-medium text-muted">Overall progress</p>
				<span class="text-xs font-semibold tabular-nums text-primary">{computedProgress}%</span>
			</div>
			<ProgressBar value={computedProgress} size="sm" />
			<p class="mt-2 text-[11px] text-muted">
				<span class="font-medium text-secondary">{doneTasks}</span> done ·
				<span class="font-medium text-secondary">{openTasks}</span> open
				{#if tasks.length}
					· {tasks.length} total
				{/if}
			</p>
		</div>
	{/if}

	{#if stats.length}
		<StatStrip items={stats} />
	{/if}

	{#if summary.length}
		<Grid cols={1} gap="md" class="sm:grid-cols-2 lg:grid-cols-3">
			{#each summary as item (item.title)}
				<TaskSummaryCard
					title={item.title}
					total={item.total}
					done={item.done}
					overdue={item.overdue}
				/>
			{/each}
		</Grid>
	{/if}

	{#if showTabs}
		<Tabs items={tabItems} bind:value={tab} variant="underline" onchange={handleTab} />
	{/if}

	{#if loading}
		<div
			class="flex min-h-[12rem] items-center justify-center rounded-xl border border-dashed border-border"
		>
			<p class="text-sm text-muted">Loading project…</p>
		</div>
	{:else if tab === 'tasks'}
		<section class="space-y-3">
			<div class="flex items-center justify-between gap-2">
				<p class="text-sm font-medium text-primary">All tasks</p>
				{#if onaddTask}
					<Button size="sm" variant="ghost" onclick={() => onaddTask?.()}>Add</Button>
				{/if}
			</div>
			{#if tasks.length}
				<ul class="space-y-2">
					{#each tasks as task (task.id)}
						<li>
							<TaskRow
								title={task.title}
								completed={task.completed ?? false}
								priority={task.priority}
								due={task.due}
								assignee={task.assignee}
								ontoggle={(completed) => ontoggleTask?.(task.id, completed)}
								onclick={() => onclickTask?.(task.id)}
							/>
						</li>
					{/each}
				</ul>
			{:else}
				<EmptyState title={emptyTasksTitle} description={emptyTasksDescription}>
					{#snippet action()}
						{#if onaddTask}
							<Button size="sm" variant="secondary" onclick={() => onaddTask?.()}>Add task</Button>
						{/if}
					{/snippet}
				</EmptyState>
			{/if}
		</section>
	{:else if tab === 'activity'}
		{#if activity.length}
			<ActivityFeed items={activity} size="sm" maxHeight="28rem" />
		{:else}
			<EmptyState
				title="No activity yet"
				description="Updates from the team will appear here."
			/>
		{/if}
	{:else}
		<div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
			<Stack gap="lg">
				{#if goals.length}
					<FormSection
						title="Goals"
						description="Key milestones for this project."
						layout="stack"
						variant="plain"
					>
						<Grid cols={1} gap="md" class="sm:grid-cols-2">
							{#each goals as goal (goal.id ?? goal.label)}
								<div class="rounded-xl border border-border bg-surface-elevated p-4">
									<GoalProgress
										label={goal.label}
										current={goal.current}
										target={goal.target}
										unit={goal.unit}
										tone={goal.tone}
									/>
								</div>
							{/each}
						</Grid>
					</FormSection>
				{/if}

				{#if milestones.length}
					<FormSection
						title="Milestones"
						description="Upcoming and completed checkpoints."
						layout="stack"
						variant="plain"
					>
						<div class="rounded-xl border border-border bg-surface-elevated p-4">
							<Timeline items={milestones} size="sm" />
						</div>
					</FormSection>
				{/if}

				{#if tasks.length}
					<FormSection
						title="Recent tasks"
						description="Latest work items across the project."
						layout="stack"
						variant="plain"
					>
						{#snippet actions()}
							{#if onviewAllTasks}
								<Button
									size="sm"
									variant="ghost"
									onclick={() => {
										tab = 'tasks';
										onviewAllTasks?.();
										ontabchange?.('tasks');
									}}
								>
									View all
								</Button>
							{/if}
						{/snippet}
						<ul class="space-y-2">
							{#each tasks.slice(0, 5) as task (task.id)}
								<li>
									<TaskRow
										title={task.title}
										completed={task.completed ?? false}
										priority={task.priority}
										due={task.due}
										assignee={task.assignee}
										ontoggle={(completed) => ontoggleTask?.(task.id, completed)}
										onclick={() => onclickTask?.(task.id)}
									/>
								</li>
							{/each}
						</ul>
					</FormSection>
				{:else}
					<EmptyState title={emptyTasksTitle} description={emptyTasksDescription}>
						{#snippet action()}
							{#if onaddTask}
								<Button size="sm" variant="secondary" onclick={() => onaddTask?.()}>
									Add task
								</Button>
							{/if}
						{/snippet}
					</EmptyState>
				{/if}

				{#if activity.length}
					<FormSection
						title="Recent activity"
						description="What the team has been up to."
						layout="stack"
						variant="plain"
					>
						{#snippet actions()}
							<Button
								size="sm"
								variant="ghost"
								onclick={() => {
									tab = 'activity';
									ontabchange?.('activity');
								}}
							>
								View all
							</Button>
						{/snippet}
						<ActivityFeed items={activity.slice(0, 4)} size="sm" showConnectors={false} />
					</FormSection>
				{/if}
			</Stack>

			<aside class="min-w-0 space-y-4">
				{#if sidebar}
					{@render sidebar()}
				{:else}
					{#if members.length}
						<div class="rounded-xl border border-border bg-surface-elevated p-4">
							<div class="mb-3 flex items-center justify-between gap-2">
								<p class="text-sm font-semibold text-primary">Team</p>
								<span class="text-[11px] tabular-nums text-muted">{members.length}</span>
							</div>
							<PresenceList users={members} max={6} />
						</div>
					{/if}

					{#if links.length}
						<div class="rounded-xl border border-border bg-surface-elevated p-4">
							<p class="mb-3 text-sm font-semibold text-primary">Resources</p>
							<ul class="space-y-1">
								{#each links as link (link.id)}
									<li>
										<button
											type="button"
											class="flex w-full flex-col rounded-lg px-2 py-2 text-left transition-colors hover:bg-surface-overlay"
											onclick={() => onclickLink?.(link.id)}
										>
											<span class="text-sm font-medium text-brand-600 dark:text-brand-400">
												{link.label}
											</span>
											{#if link.description}
												<span class="text-xs text-muted">{link.description}</span>
											{/if}
										</button>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				{/if}
			</aside>
		</div>
	{/if}
</div>
