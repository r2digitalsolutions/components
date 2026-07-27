<script lang="ts">
	import ProjectOverviewPage from './ProjectOverviewPage.svelte';
	import type {
		ProjectGoal,
		ProjectTask,
		ProjectTaskSummary
	} from './ProjectOverviewPage.svelte';
	import type { PresenceUser } from '$lib/components/molecules/PresenceList/PresenceList.svelte';

	const summary: ProjectTaskSummary[] = [
		{ title: 'Design', total: 12, done: 9, overdue: 1 },
		{ title: 'Engineering', total: 24, done: 18 },
		{ title: 'QA', total: 8, done: 3, overdue: 2 }
	];

	const goals: ProjectGoal[] = [
		{ label: 'Sprint velocity', current: 42, target: 50, unit: ' pts', tone: 'brand' },
		{ label: 'Bug backlog', current: 6, target: 10, unit: '', tone: 'success' }
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
		}
	]);

	const members: PresenceUser[] = [
		{ id: '1', name: 'Ada Lovelace', status: 'online' },
		{ id: '2', name: 'Grace Hopper', status: 'away' },
		{ id: '3', name: 'Alan Turing', status: 'busy' },
		{ id: '4', name: 'Katherine Johnson', status: 'offline' }
	];

	let last = $state('');

	function handleToggle(id: string, completed: boolean) {
		tasks = tasks.map((task) => (task.id === id ? { ...task, completed } : task));
		last = `toggle:${id}:${completed}`;
	}
</script>

<div class="p-4">
	<ProjectOverviewPage
		title="Phoenix redesign"
		status="On track"
		{summary}
		{goals}
		{tasks}
		{members}
		ontoggleTask={handleToggle}
		onclickTask={(id) => (last = `open:${id}`)}
	/>
</div>

{#if last}
	<p class="pb-4 text-center text-xs text-muted">Action: {last}</p>
{/if}
