<script lang="ts">
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import TaskSummaryCard from '$lib/components/molecules/TaskSummaryCard/TaskSummaryCard.svelte';
	import GoalProgress from '$lib/components/molecules/GoalProgress/GoalProgress.svelte';
	import type { GoalProgressTone } from '$lib/components/molecules/GoalProgress/GoalProgress.svelte';
	import TaskRow from '$lib/components/molecules/TaskRow/TaskRow.svelte';
	import type { TaskPriority } from '$lib/components/molecules/TaskRow/TaskRow.svelte';
	import PresenceList from '$lib/components/molecules/PresenceList/PresenceList.svelte';
	import type { PresenceUser } from '$lib/components/molecules/PresenceList/PresenceList.svelte';
	import FormSection from '$lib/components/molecules/FormSection/FormSection.svelte';
	import Grid from '$lib/components/atoms/Grid/Grid.svelte';
	import Stack from '$lib/components/atoms/Stack/Stack.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';

	export interface ProjectTaskSummary {
		title: string;
		total: number;
		done: number;
		overdue?: number;
	}

	export interface ProjectGoal {
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

	interface ProjectOverviewPageProps {
		title: string;
		status?: string;
		summary?: ProjectTaskSummary[];
		goals?: ProjectGoal[];
		tasks?: ProjectTask[];
		members?: PresenceUser[];
		class?: string;
		ontoggleTask?: (id: string, completed: boolean) => void;
		onclickTask?: (id: string) => void;
	}

	let {
		title,
		status = 'On track',
		summary = [],
		goals = [],
		tasks = [],
		members = [],
		class: className = '',
		ontoggleTask,
		onclickTask
	}: ProjectOverviewPageProps = $props();
</script>

<div class={['mx-auto w-full max-w-4xl space-y-6', className]}>
	<PageHeader {title} description="Overview of progress, goals, and team activity.">
		{#snippet meta()}
			<Badge size="sm" variant="success" dot>{status}</Badge>
		{/snippet}
	</PageHeader>

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

	<Stack gap="lg">
		{#if goals.length}
			<FormSection
				title="Goals"
				description="Key milestones for this project."
				layout="split"
				variant="plain"
			>
				<Grid cols={1} gap="md" class="lg:grid-cols-2">
					{#each goals as goal (goal.label)}
						<GoalProgress
							label={goal.label}
							current={goal.current}
							target={goal.target}
							unit={goal.unit}
							tone={goal.tone}
						/>
					{/each}
				</Grid>
			</FormSection>
		{/if}

		<div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_16rem]">
			{#if tasks.length}
				<FormSection
					title="Recent tasks"
					description="Latest work items across the project."
					layout="stack"
					variant="plain"
				>
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
				</FormSection>
			{/if}

			{#if members.length}
				<FormSection
					title="Team"
					description="Who is working on this project."
					layout="stack"
					variant="plain"
				>
					<PresenceList users={members} max={8} />
				</FormSection>
			{/if}
		</div>
	</Stack>
</div>
