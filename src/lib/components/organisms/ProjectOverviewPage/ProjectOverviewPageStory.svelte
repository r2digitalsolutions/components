<script lang="ts">
	import ProjectOverviewPage from './ProjectOverviewPage.svelte';
	import type {
		ProjectGoal,
		ProjectTask,
		ProjectTaskSummary,
		ProjectMilestone,
		ProjectLink,
		ProjectStatus
	} from './ProjectOverviewPage.svelte';
	import type { PresenceUser } from '$lib/components/molecules/PresenceList/PresenceList.svelte';
	import type { ActivityItem } from '$lib/components/organisms/ActivityFeed/ActivityFeed.svelte';
	import type { StatStripItem } from '$lib/components/molecules/StatStrip/StatStrip.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	interface Props {
		example?: 'default' | 'at-risk' | 'empty' | 'compact';
	}

	let { example = 'default' }: Props = $props();

	const summary: ProjectTaskSummary[] = [
		{ title: 'Design', total: 12, done: 9, overdue: 1 },
		{ title: 'Engineering', total: 24, done: 18 },
		{ title: 'QA', total: 8, done: 3, overdue: 2 }
	];

	const goals: ProjectGoal[] = [
		{ id: 'g1', label: 'Sprint velocity', current: 42, target: 50, unit: ' pts', tone: 'brand' },
		{ id: 'g2', label: 'Coverage', current: 78, target: 90, unit: '%', tone: 'warning' },
		{ id: 'g3', label: 'Bug backlog', current: 6, target: 10, unit: '', tone: 'success' },
		{ id: 'g4', label: 'NPS', current: 48, target: 60, unit: '', tone: 'brand' }
	];

	let tasks = $state<ProjectTask[]>([
		{
			id: '1',
			title: 'Finalize onboarding flow mockups',
			completed: false,
			priority: 'high',
			due: 'Today',
			assignee: 'Ada Lovelace'
		},
		{
			id: '2',
			title: 'Wire up notification preferences API',
			completed: false,
			priority: 'med',
			due: 'Wed',
			assignee: 'Grace Hopper'
		},
		{
			id: '3',
			title: 'Review accessibility audit findings',
			completed: true,
			priority: 'low',
			due: 'Mon',
			assignee: 'Alan Turing'
		},
		{
			id: '4',
			title: 'Ship beta release notes',
			completed: false,
			priority: 'med',
			due: 'Fri',
			assignee: 'Ada Lovelace'
		},
		{
			id: '5',
			title: 'Fix flaky e2e on settings',
			completed: false,
			priority: 'high',
			due: 'Tomorrow',
			assignee: 'Grace Hopper'
		},
		{
			id: '6',
			title: 'Document design tokens migration',
			completed: true,
			priority: 'low',
			due: 'Last week',
			assignee: 'Katherine Johnson'
		}
	]);

	const members: PresenceUser[] = [
		{ id: '1', name: 'Ada Lovelace', status: 'online' },
		{ id: '2', name: 'Grace Hopper', status: 'away' },
		{ id: '3', name: 'Alan Turing', status: 'busy' },
		{ id: '4', name: 'Katherine Johnson', status: 'offline' },
		{ id: '5', name: 'Margaret Hamilton', status: 'online' }
	];

	const milestones: ProjectMilestone[] = [
		{
			id: 'm1',
			title: 'Design freeze',
			description: 'Final mockups approved by stakeholders.',
			timestamp: 'Jul 10',
			status: 'success'
		},
		{
			id: 'm2',
			title: 'Beta launch',
			description: 'Invite-only rollout to 50 customers.',
			timestamp: 'Jul 28',
			status: 'info'
		},
		{
			id: 'm3',
			title: 'GA release',
			description: 'Public launch and marketing push.',
			timestamp: 'Aug 15',
			status: 'default'
		}
	];

	const activity: ActivityItem[] = [
		{
			id: 'act1',
			actor: 'Ada Lovelace',
			action: 'completed',
			target: 'Document design tokens migration',
			date: Date.now() - 1000 * 60 * 25,
			type: 'success'
		},
		{
			id: 'act2',
			actor: 'Grace Hopper',
			action: 'commented on',
			target: 'Wire up notification preferences API',
			date: Date.now() - 1000 * 60 * 90,
			type: 'info'
		},
		{
			id: 'act3',
			actor: 'Alan Turing',
			action: 'moved',
			target: 'Review accessibility audit findings',
			date: Date.now() - 1000 * 60 * 60 * 5,
			meta: 'to Done',
			type: 'default'
		},
		{
			id: 'act4',
			actor: 'Margaret Hamilton',
			action: 'flagged',
			target: 'Fix flaky e2e on settings',
			date: Date.now() - 1000 * 60 * 60 * 26,
			type: 'warning'
		}
	];

	const links: ProjectLink[] = [
		{ id: 'l1', label: 'Figma file', description: 'Design source of truth' },
		{ id: 'l2', label: 'Notion brief', description: 'Goals and scope' },
		{ id: 'l3', label: 'GitHub repo', description: 'r2/phoenix' }
	];

	const stats: StatStripItem[] = [
		{ id: 'open', label: 'Open', value: 4 },
		{ id: 'done', label: 'Done', value: 2 },
		{ id: 'overdue', label: 'Overdue', value: 1, hint: 'Needs attention' },
		{ id: 'cycle', label: 'Cycle time', value: '3.2d' }
	];

	let last = $state('');
	let tab = $state<'overview' | 'tasks' | 'activity'>('overview');

	function handleToggle(id: string, completed: boolean) {
		tasks = tasks.map((task) => (task.id === id ? { ...task, completed } : task));
		last = `toggle:${id}:${completed}`;
	}

	const status: ProjectStatus = $derived(
		example === 'at-risk' ? 'at-risk' : example === 'empty' ? 'draft' : 'on-track'
	);
</script>

<div class="space-y-3 p-4 sm:p-6">
	{#if example === 'empty'}
		<ProjectOverviewPage
			title="New initiative"
			description="Kick off this project by adding goals and a first task."
			status="draft"
			breadcrumbs={[
				{ id: 'projects', label: 'Projects', href: '#' },
				{ id: 'new', label: 'New initiative' }
			]}
			tags={['Planning']}
			members={members.slice(0, 2)}
			links={links.slice(0, 1)}
			onaddTask={() => (last = 'add-task')}
		/>
	{:else if example === 'compact'}
		<ProjectOverviewPage
			title="Phoenix redesign"
			status="on-track"
			{summary}
			{tasks}
			{members}
			showTabs={false}
			ontoggleTask={handleToggle}
			onclickTask={(id) => (last = `open:${id}`)}
		/>
	{:else}
		<ProjectOverviewPage
			title="Phoenix redesign"
			description="Rebuild the customer onboarding experience end to end."
			{status}
			dueDate="Aug 15"
			progress={example === 'at-risk' ? 48 : 67}
			breadcrumbs={[
				{ id: 'projects', label: 'Projects', href: '#' },
				{ id: 'phoenix', label: 'Phoenix redesign' }
			]}
			tags={['Product', 'Q3', 'Beta']}
			{stats}
			{summary}
			{goals}
			{tasks}
			{milestones}
			{activity}
			{members}
			{links}
			bind:tab
			ontoggleTask={handleToggle}
			onclickTask={(id) => (last = `open:${id}`)}
			onclickLink={(id) => (last = `link:${id}`)}
			onviewAllTasks={() => (last = 'view-all-tasks')}
			onaddTask={() => (last = 'add-task')}
			ontabchange={(t) => (last = `tab:${t}`)}
		>
			{#snippet actions()}
				<Button size="sm" variant="ghost" onclick={() => (last = 'share')}>Share</Button>
				<Button size="sm" variant="secondary" onclick={() => (last = 'add-task')}>Add task</Button>
			{/snippet}
		</ProjectOverviewPage>
	{/if}

	{#if last}
		<p class="text-center text-xs text-muted">
			Last action: <span class="font-medium text-primary">{last}</span>
		</p>
	{/if}
</div>
