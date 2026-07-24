<script lang="ts">
	import Kanban, { type KanbanColumn, type KanbanCard } from './Kanban.svelte';

	const columns: KanbanColumn[] = [
		{ id: 'backlog', title: 'Backlog', color: '#94a3b8' },
		{ id: 'todo', title: 'To Do', color: '#60a5fa' },
		{ id: 'inprogress', title: 'In Progress', color: '#f59e0b' },
		{ id: 'review', title: 'In Review', color: '#a78bfa' },
		{ id: 'done', title: 'Done', color: '#34d399' }
	];

	let cards = $state<KanbanCard[]>([
		{ id: 'c1', columnId: 'backlog', title: 'Research competitor products', description: 'Analyze top 5 competitors and document findings.', tags: ['Research'] },
		{ id: 'c2', columnId: 'backlog', title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated testing and deployment.', tags: ['DevOps', 'Backend'] },
		{ id: 'c3', columnId: 'todo', title: 'Design new onboarding flow', description: 'Create wireframes for the new user onboarding experience.', tags: ['Design', 'UX'] },
		{ id: 'c4', columnId: 'todo', title: 'Implement dark mode', tags: ['Frontend'] },
		{ id: 'c5', columnId: 'todo', title: 'Write unit tests for auth module', description: 'Achieve 80% coverage on authentication logic.', tags: ['Testing', 'Backend'] },
		{ id: 'c6', columnId: 'inprogress', title: 'Build Kanban component', description: 'Drag-and-drop Kanban board with multiple columns.', tags: ['Frontend', 'Component'] },
		{ id: 'c7', columnId: 'inprogress', title: 'API rate limiting', tags: ['Backend', 'Security'] },
		{ id: 'c8', columnId: 'review', title: 'Update design tokens', description: 'Refresh color palette and typography scale.', tags: ['Design'] },
		{ id: 'c9', columnId: 'done', title: 'Project setup', description: 'Initialize repo, configure linting and formatting.', tags: ['DevOps'] },
		{ id: 'c10', columnId: 'done', title: 'Component library scaffolding', tags: ['Frontend'] }
	]);

	let lastMove = $state('');
</script>

<div class="space-y-3">
	<Kanban
		{columns}
		bind:cards
		oncardmove={(id, col, idx) => (lastMove = `Card "${id}" → ${col} [${idx}]`)}
	/>
	{#if lastMove}
		<p class="text-xs text-muted">
			Último movimiento: <span class="text-primary font-medium">{lastMove}</span>
		</p>
	{/if}
</div>
