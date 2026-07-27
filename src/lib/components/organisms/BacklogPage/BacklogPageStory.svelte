<script lang="ts">
	import BacklogPage from './BacklogPage.svelte';
	import type { BacklogTask } from './BacklogPage.svelte';

	let selected = $state<string[]>(['t2']);

	const tasks: BacklogTask[] = [
		{
			id: 't1',
			title: 'Wireframe onboarding flow',
			priority: 'high',
			due: 'Jul 28',
			assignee: 'Ada Lovelace',
			completed: false
		},
		{
			id: 't2',
			title: 'Review API contract with platform team',
			priority: 'med',
			due: 'Jul 29',
			assignee: 'Alan Turing',
			completed: false
		},
		{
			id: 't3',
			title: 'Ship dark mode tokens',
			priority: 'low',
			due: 'Aug 2',
			assignee: 'Grace Hopper',
			completed: true
		},
		{
			id: 't4',
			title: 'Draft release notes for v2.4',
			priority: 'med',
			due: 'Jul 27',
			assignee: 'Ada Lovelace',
			completed: false
		},
		{
			id: 't5',
			title: 'Audit accessibility on settings pages',
			priority: 'high',
			due: 'Aug 5',
			assignee: 'Grace Hopper',
			completed: false
		}
	];

	const filters = [
		{ id: 'priority', label: 'Priority: High' },
		{ id: 'assignee', label: 'Assignee: Ada' }
	];
</script>

<div class="p-4 sm:p-6">
	<BacklogPage bind:selected {tasks} {filters} />
</div>
