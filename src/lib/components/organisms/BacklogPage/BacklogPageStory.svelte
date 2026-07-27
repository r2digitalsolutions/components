<script lang="ts">
	import BacklogPage from './BacklogPage.svelte';
	import type { BacklogTask, BacklogView, BacklogSort } from './BacklogPage.svelte';
	import type { FilterChip } from '$lib/components/molecules/FilterBar/FilterBar.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	interface Props {
		example?: 'default' | 'empty' | 'loading' | 'readonly' | 'filtered';
	}

	let { example = 'default' }: Props = $props();

	let selected = $state<string[]>(['t2']);
	let query = $state('');
	let view = $state<BacklogView>('all');
	let sort = $state<BacklogSort>('priority');
	let filters = $state<FilterChip[]>([]);
	let last = $state('');

	let tasks = $state<BacklogTask[]>([
		{
			id: 't1',
			title: 'Wireframe onboarding flow',
			priority: 'high',
			due: 'Jul 28',
			dueDate: '2026-07-28',
			assignee: 'Ada Lovelace',
			epic: 'Onboarding',
			estimate: '5 pts',
			tags: ['design', 'ux'],
			completed: false
		},
		{
			id: 't2',
			title: 'Review API contract with platform team',
			priority: 'med',
			due: 'Jul 29',
			dueDate: '2026-07-29',
			assignee: 'Alan Turing',
			epic: 'Platform',
			estimate: '3 pts',
			tags: ['api'],
			completed: false
		},
		{
			id: 't3',
			title: 'Ship dark mode tokens',
			priority: 'low',
			due: 'Aug 2',
			dueDate: '2026-08-02',
			assignee: 'Grace Hopper',
			epic: 'Design system',
			estimate: '2 pts',
			tags: ['tokens'],
			completed: true
		},
		{
			id: 't4',
			title: 'Draft release notes for v2.4',
			priority: 'med',
			due: 'Jul 20',
			dueDate: '2026-07-20',
			assignee: 'Ada Lovelace',
			epic: 'Release',
			estimate: '1 pt',
			tags: ['docs'],
			completed: false
		},
		{
			id: 't5',
			title: 'Audit accessibility on settings pages',
			priority: 'high',
			due: 'Aug 5',
			dueDate: '2026-08-05',
			assignee: 'Grace Hopper',
			epic: 'A11y',
			estimate: '8 pts',
			tags: ['a11y', 'qa'],
			completed: false
		},
		{
			id: 't6',
			title: 'Fix flaky backlog e2e spec',
			priority: 'high',
			due: 'Jul 22',
			dueDate: '2026-07-22',
			assignee: 'Alan Turing',
			epic: 'QA',
			estimate: '2 pts',
			tags: ['tests'],
			completed: false
		},
		{
			id: 't7',
			title: 'Prototype sprint burndown widget',
			priority: 'low',
			due: 'Aug 8',
			dueDate: '2026-08-08',
			assignee: 'Ada Lovelace',
			epic: 'Dashboards',
			estimate: '3 pts',
			tags: ['charts'],
			completed: false
		}
	]);

	const stats = [
		{ id: 'open', label: 'Open', value: 6 },
		{ id: 'done', label: 'Done', value: 1 },
		{ id: 'overdue', label: 'Overdue', value: 2 },
		{ id: 'points', label: 'Points left', value: 24 }
	];

	function handleToggle(id: string, completed: boolean) {
		tasks = tasks.map((t) => (t.id === id ? { ...t, completed } : t));
		last = `${completed ? 'done' : 'reopen'}:${id}`;
	}

	function handleBulk(action: string, ids: string[]) {
		last = `bulk:${action} → ${ids.join(', ')}`;
		if (action === 'complete') {
			tasks = tasks.map((t) => (ids.includes(t.id) ? { ...t, completed: true } : t));
			selected = [];
		} else if (action === 'delete') {
			tasks = tasks.filter((t) => !ids.includes(t.id));
			selected = [];
		}
	}

	function handleAdd() {
		const n = tasks.length + 1;
		tasks = [
			{
				id: `t${n}-${Date.now()}`,
				title: `New backlog item #${n}`,
				priority: 'med',
				due: 'Aug 10',
				dueDate: '2026-08-10',
				assignee: 'Unassigned',
				epic: 'Inbox',
				estimate: '1 pt',
				tags: ['new'],
				completed: false
			},
			...tasks
		];
		last = 'add';
	}

	$effect(() => {
		if (example === 'filtered') {
			filters = [
				{ id: 'priority', label: 'Priority: High' },
				{ id: 'epic', label: 'Epic: Onboarding' }
			];
			view = 'open';
			query = '';
		} else {
			filters = [];
		}
	});
</script>

<div class="space-y-3 p-4 sm:p-6">
	{#if example === 'empty'}
		<BacklogPage
			tasks={[]}
			showSidebar={false}
			onadd={() => (last = 'add-empty')}
			emptyTitle="Nothing in this sprint"
			emptyDescription="Pull work from the icebox or create a new task."
		/>
	{:else if example === 'loading'}
		<BacklogPage {tasks} loading selected={[]} />
	{:else if example === 'readonly'}
		<BacklogPage
			title="Shared backlog"
			description="Read-only view for stakeholders."
			{tasks}
			readonly
			selectable={false}
			showBulkActions={false}
			showSearch={false}
			showSort={false}
			stats={stats.slice(0, 3)}
			onclicktask={(id) => (last = `open:${id}`)}
		/>
	{:else}
		<BacklogPage
			bind:selected
			bind:query
			bind:view
			bind:sort
			bind:filters
			{tasks}
			stats={example === 'default' ? stats : []}
			breadcrumbs={[
				{ id: 'projects', label: 'Projects', href: '#' },
				{ id: 'atlas', label: 'Atlas', href: '#' },
				{ id: 'backlog', label: 'Backlog' }
			]}
			summaryTitle="Sprint 24"
			ontoggle={handleToggle}
			onbulk={handleBulk}
			onadd={handleAdd}
			onclicktask={(id) => (last = `open:${id}`)}
			onfilterclear={(id) => {
				filters = filters.filter((f) => f.id !== id);
				last = `clear:${id}`;
			}}
			onfilterclearall={() => {
				filters = [];
				last = 'clear-all';
			}}
		>
			{#snippet actions()}
				<Button size="sm" variant="ghost" onclick={() => (last = 'import')}>Import</Button>
				<Button size="sm" variant="secondary" onclick={handleAdd}>Add task</Button>
			{/snippet}
		</BacklogPage>
	{/if}

	{#if last}
		<p class="text-center text-xs text-muted">
			Last action: <span class="font-medium text-primary">{last}</span>
		</p>
	{/if}
</div>
