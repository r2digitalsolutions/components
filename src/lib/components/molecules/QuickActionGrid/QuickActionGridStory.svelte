<script lang="ts">
	import QuickActionGrid from './QuickActionGrid.svelte';
	import type { QuickAction, QuickActionLayout, QuickActionSize } from './QuickActionGrid.svelte';

	interface Props {
		example?: 'workspace' | 'create' | 'compact' | 'list' | 'emoji';
		layout?: QuickActionLayout;
		size?: QuickActionSize;
		columns?: 2 | 3 | 4 | 5 | 6;
	}

	let { example = 'workspace', layout, size = 'md', columns }: Props = $props();

	let last = $state('');

	const resolvedLayout = $derived(
		layout ?? (example === 'list' ? 'list' : example === 'compact' ? 'compact' : 'tiles')
	);

	const resolvedColumns = $derived(
		columns ?? (example === 'create' || example === 'emoji' ? 4 : 3)
	);

	const sets: Record<NonNullable<Props['example']>, QuickAction[]> = {
		workspace: [
			{
				id: 'invite',
				label: 'Invite people',
				description: 'Add members to this workspace',
				icon: 'users',
				tone: 'brand',
				badge: 'New'
			},
			{
				id: 'upload',
				label: 'Upload files',
				description: 'Docs, images, and folders',
				icon: 'upload',
				tone: 'info'
			},
			{
				id: 'link',
				label: 'Copy invite link',
				description: 'Anyone with the link can join',
				icon: 'link',
				tone: 'neutral'
			},
			{
				id: 'settings',
				label: 'Workspace settings',
				description: 'Roles, billing, and branding',
				icon: 'settings',
				tone: 'neutral'
			},
			{
				id: 'message',
				label: 'Start a thread',
				description: 'Ask the team a question',
				icon: 'message',
				tone: 'success'
			},
			{
				id: 'calendar',
				label: 'Schedule',
				description: 'Book a kickoff call',
				icon: 'calendar',
				tone: 'warning'
			}
		],
		create: [
			{ id: 'doc', label: 'Document', description: 'Blank page', icon: 'file', tone: 'brand' },
			{ id: 'folder', label: 'Folder', description: 'Organize files', icon: 'folder', tone: 'info' },
			{
				id: 'ai',
				label: 'AI draft',
				description: 'Generate a start',
				icon: 'sparkles',
				tone: 'warning',
				badge: 'Beta'
			},
			{ id: 'import', label: 'Import', description: 'From Notion/CSV', icon: 'download', tone: 'neutral' }
		],
		compact: [
			{ id: 'a', label: 'Create', icon: 'plus', tone: 'brand' },
			{ id: 'b', label: 'Upload', icon: 'upload', tone: 'info' },
			{ id: 'c', label: 'Share', icon: 'share', tone: 'success' },
			{ id: 'd', label: 'Search', icon: 'search', tone: 'neutral' },
			{ id: 'e', label: 'AI', icon: 'sparkles', tone: 'warning', badge: 'New' },
			{ id: 'f', label: 'Link', icon: 'link', tone: 'neutral' },
			{ id: 'g', label: 'Invite', icon: 'users', tone: 'brand' },
			{ id: 'h', label: 'Files', icon: 'folder', tone: 'info' }
		],
		list: [
			{
				id: 'project',
				label: 'New project',
				description: 'Start from a template',
				icon: 'folder',
				tone: 'brand'
			},
			{
				id: 'task',
				label: 'Add task',
				description: 'Assign to a teammate',
				icon: 'plus',
				tone: 'success'
			},
			{
				id: 'invite',
				label: 'Invite',
				description: 'Email or link',
				icon: 'users',
				tone: 'info',
				badge: '3 seats'
			},
			{
				id: 'disabled',
				label: 'Billing',
				description: 'Requires admin role',
				icon: 'settings',
				tone: 'neutral',
				disabled: true
			}
		],
		emoji: [
			{ id: 'idea', label: 'Ideas', description: 'Brainstorm board', icon: '💡', tone: 'warning' },
			{ id: 'design', label: 'Design', description: 'Figma links', icon: '🎨', tone: 'brand' },
			{ id: 'code', label: 'Code', description: 'Repos & PRs', icon: '💻', tone: 'info' },
			{ id: 'ship', label: 'Ship', description: 'Release checklist', icon: '🚀', tone: 'success' }
		]
	};

	const actions = $derived(sets[example]);
</script>

<div class="w-full space-y-4">
	{#if example === 'compact'}
		<p class="text-xs text-muted">
			Compact usa <code class="rounded bg-surface-overlay px-1">auto-fit</code> — cambia el ancho del
			panel o de la ventana para ver cómo reflowea (móvil → tablet → desktop).
		</p>
		<div class="grid gap-4 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)_minmax(0,1.25fr)]">
			<div class="rounded-2xl border border-border bg-surface p-3">
				<p class="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted">~ Mobile</p>
				<QuickActionGrid
					{actions}
					layout="compact"
					{size}
					title="Shortcuts"
					onaction={(id) => (last = id)}
				/>
			</div>
			<div class="rounded-2xl border border-border bg-surface p-4">
				<p class="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted">~ Tablet</p>
				<QuickActionGrid
					{actions}
					layout="compact"
					{size}
					title="Shortcuts"
					onaction={(id) => (last = id)}
				/>
			</div>
			<div class="rounded-2xl border border-border bg-surface p-5">
				<p class="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted">~ Desktop</p>
				<QuickActionGrid
					{actions}
					layout="compact"
					{size}
					title="Shortcuts"
					onaction={(id) => (last = id)}
				/>
			</div>
		</div>
	{:else}
		<div class="mx-auto w-full max-w-2xl rounded-2xl border border-border bg-surface p-4 sm:p-5">
			<QuickActionGrid
				{actions}
				layout={resolvedLayout}
				columns={resolvedColumns}
				{size}
				title={example === 'workspace'
					? 'Quick actions'
					: example === 'create'
						? 'Create new'
						: example === 'list'
							? 'Get started'
							: example === 'emoji'
								? 'Spaces'
								: undefined}
				description={example === 'workspace'
					? 'Common things people do in this workspace'
					: example === 'list'
						? 'Pick a next step'
						: undefined}
				onaction={(id) => (last = id)}
			/>
		</div>
	{/if}

	{#if last}
		<p class="text-xs text-muted">
			Selected: <span class="font-medium text-primary">{last}</span>
		</p>
	{/if}
</div>
