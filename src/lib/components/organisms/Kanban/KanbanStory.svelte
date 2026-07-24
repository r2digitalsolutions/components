<script lang="ts">
	import Kanban, {
		type KanbanColumn,
		type KanbanCard
	} from './Kanban.svelte';

	const columns: KanbanColumn[] = [
		{ id: 'backlog', title: 'Backlog', color: '#94a3b8' },
		{ id: 'todo', title: 'To Do', color: '#60a5fa', limit: 4 },
		{ id: 'inprogress', title: 'In Progress', color: '#f59e0b', limit: 3 },
		{ id: 'review', title: 'In Review', color: '#a78bfa' },
		{ id: 'done', title: 'Done', color: '#34d399' }
	];

	let cards = $state<KanbanCard[]>([
		{
			id: 'c1',
			columnId: 'backlog',
			title: 'Research competitor products',
			description: 'Analyze top 5 competitors and document findings.',
			tags: ['Research'],
			priority: 'low',
			assignee: { name: 'Maya Chen', avatar: 'https://i.pravatar.cc/40?img=5' },
			dueDate: 'Jul 28'
		},
		{
			id: 'c2',
			columnId: 'backlog',
			title: 'Set up CI/CD pipeline',
			description: 'GitHub Actions for test + deploy.',
			tags: ['DevOps', 'Backend'],
			priority: 'medium',
			assignee: { name: 'Jon Ruiz' },
			dueDate: 'Aug 2'
		},
		{
			id: 'c3',
			columnId: 'todo',
			title: 'Design onboarding flow',
			description: 'Wireframes for first-run experience.',
			tags: ['Design', 'UX'],
			priority: 'high',
			assignee: { name: 'Ana García', avatar: 'https://i.pravatar.cc/40?img=47' },
			dueDate: 'Jul 26'
		},
		{
			id: 'c4',
			columnId: 'todo',
			title: 'Implement dark mode',
			tags: ['Frontend'],
			priority: 'medium',
			assignee: { name: 'Leo Park', avatar: 'https://i.pravatar.cc/40?img=12' },
			dueDate: 'Jul 30'
		},
		{
			id: 'c5',
			columnId: 'todo',
			title: 'Auth module unit tests',
			description: 'Reach 80% coverage on authentication.',
			tags: ['Testing', 'Backend'],
			priority: 'high',
			assignee: { name: 'Jon Ruiz' },
			dueDate: 'Jul 27'
		},
		{
			id: 'c6',
			columnId: 'inprogress',
			title: 'Polish Kanban board',
			description: 'Drag indicators, priorities, assignees.',
			tags: ['Frontend', 'Component'],
			priority: 'urgent',
			assignee: { name: 'Maya Chen', avatar: 'https://i.pravatar.cc/40?img=5' },
			dueDate: 'Today'
		},
		{
			id: 'c7',
			columnId: 'inprogress',
			title: 'API rate limiting',
			tags: ['Backend', 'Security'],
			priority: 'high',
			assignee: { name: 'Sam Ortiz', avatar: 'https://i.pravatar.cc/40?img=33' },
			dueDate: 'Jul 25'
		},
		{
			id: 'c8',
			columnId: 'review',
			title: 'Update design tokens',
			description: 'Refresh palette and type scale.',
			tags: ['Design'],
			priority: 'medium',
			assignee: { name: 'Ana García', avatar: 'https://i.pravatar.cc/40?img=47' },
			dueDate: 'Jul 24'
		},
		{
			id: 'c9',
			columnId: 'done',
			title: 'Project setup',
			description: 'Repo, linting and formatting.',
			tags: ['DevOps'],
			priority: 'low',
			assignee: { name: 'Leo Park', avatar: 'https://i.pravatar.cc/40?img=12' },
			dueDate: 'Jul 18'
		},
		{
			id: 'c10',
			columnId: 'done',
			title: 'Component library scaffolding',
			tags: ['Frontend'],
			priority: 'medium',
			assignee: { name: 'Maya Chen', avatar: 'https://i.pravatar.cc/40?img=5' },
			dueDate: 'Jul 20'
		}
	]);

	let selectedId = $state<string | null>(null);
	let lastMove = $state('');

	const selected = $derived(cards.find((c) => c.id === selectedId) ?? null);
	const total = $derived(cards.length);
	const inProgress = $derived(cards.filter((c) => c.columnId === 'inprogress').length);
	const done = $derived(cards.filter((c) => c.columnId === 'done').length);
</script>

<div
	class="flex h-[min(100vh,52rem)] min-h-[32rem] flex-col bg-gradient-to-b from-surface to-surface-overlay/40 p-4 md:p-6"
>
	<div class="mx-auto flex min-h-0 w-full max-w-[90rem] flex-1 flex-col gap-3">
		<header
			class="flex shrink-0 flex-col gap-3 rounded-2xl border border-border bg-surface-elevated/90 px-4 py-3.5 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between"
		>
			<div class="min-w-0">
				<p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
					Sprint 24
				</p>
				<h2 class="truncate text-base font-semibold text-primary md:text-lg">
					Product board
				</h2>
			</div>

			<div class="flex flex-wrap items-center gap-2">
				<span
					class="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-secondary"
				>
					<span class="font-semibold text-primary tabular-nums">{total}</span> cards
				</span>
				<span
					class="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-secondary"
				>
					<span class="font-semibold text-amber-600 tabular-nums dark:text-amber-400"
						>{inProgress}</span
					> active
				</span>
				<span
					class="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-secondary"
				>
					<span class="font-semibold text-emerald-600 tabular-nums dark:text-emerald-400"
						>{done}</span
					> done
				</span>
			</div>
		</header>

		<p class="shrink-0 px-1 text-xs text-muted">
			Arrastra tarjetas entre columnas. Haz clic para ver el detalle.
		</p>

		<div class="min-h-0 flex-1">
			<Kanban
				{columns}
				bind:cards
				class="h-full"
				oncardmove={(id, col, idx) => {
					const title = cards.find((c) => c.id === id)?.title ?? id;
					lastMove = `“${title}” → ${col} · posición ${idx + 1}`;
				}}
				oncardclick={(card) => (selectedId = card.id)}
			/>
		</div>

		{#if lastMove}
			<p class="shrink-0 px-1 text-xs text-muted">
				Último movimiento:
				<span class="font-medium text-primary">{lastMove}</span>
			</p>
		{/if}

		{#if selected}
			<aside
				class="shrink-0 rounded-2xl border border-border bg-surface-elevated p-4 shadow-sm"
				aria-live="polite"
			>
				<div class="flex items-start justify-between gap-3">
					<div class="min-w-0">
						<p class="text-[11px] font-semibold uppercase tracking-wider text-muted">
							Card detail
						</p>
						<h3 class="mt-0.5 text-sm font-semibold text-primary">{selected.title}</h3>
					</div>
					<button
						type="button"
						class="rounded-lg px-2 py-1 text-xs text-muted transition-colors hover:bg-surface-overlay hover:text-primary"
						onclick={() => (selectedId = null)}
					>
						Close
					</button>
				</div>
				{#if selected.description}
					<p class="mt-2 text-sm leading-relaxed text-secondary">{selected.description}</p>
				{/if}
				<dl class="mt-3 grid gap-2 text-xs sm:grid-cols-3">
					<div>
						<dt class="text-muted">Column</dt>
						<dd class="font-medium text-primary">
							{columns.find((c) => c.id === selected.columnId)?.title ?? selected.columnId}
						</dd>
					</div>
					<div>
						<dt class="text-muted">Assignee</dt>
						<dd class="font-medium text-primary">{selected.assignee?.name ?? '—'}</dd>
					</div>
					<div>
						<dt class="text-muted">Due</dt>
						<dd class="font-medium text-primary">{selected.dueDate ?? '—'}</dd>
					</div>
				</dl>
			</aside>
		{/if}
	</div>
</div>
