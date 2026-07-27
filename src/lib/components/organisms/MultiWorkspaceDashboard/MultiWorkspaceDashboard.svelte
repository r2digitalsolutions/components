<script lang="ts">
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import UsageBreakdown from '$lib/components/molecules/UsageBreakdown/UsageBreakdown.svelte';
	import type { UsageBreakdownItem } from '$lib/components/molecules/UsageBreakdown/UsageBreakdown.svelte';
	import GoalProgress from '$lib/components/molecules/GoalProgress/GoalProgress.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';

	export interface WorkspaceSeats {
		current: number;
		target: number;
	}

	export interface WorkspaceCard {
		id: string;
		name: string;
		plan?: string;
		members?: number;
		usage?: UsageBreakdownItem[];
		seats?: WorkspaceSeats;
		role?: string;
	}

	interface MultiWorkspaceDashboardProps {
		title?: string;
		description?: string;
		workspaces?: WorkspaceCard[];
		class?: string;
		onopen?: (id: string) => void;
		oncreate?: () => void;
	}

	let {
		title = 'Workspaces',
		description = 'Switch between teams or create a new workspace.',
		workspaces = [],
		class: className = '',
		onopen,
		oncreate
	}: MultiWorkspaceDashboardProps = $props();
</script>

<div class={['mx-auto w-full max-w-6xl space-y-6', className]}>
	<PageHeader {title} {description}>
		{#snippet actions()}
			<Button size="sm" onclick={() => oncreate?.()}>New workspace</Button>
		{/snippet}
	</PageHeader>

	{#if workspaces.length}
		<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
			{#each workspaces as ws (ws.id)}
				<article
					class="flex flex-col gap-4 rounded-xl border border-border bg-surface-elevated p-4 transition-colors hover:border-brand-500/30"
				>
					<div class="flex items-start justify-between gap-3">
						<div class="min-w-0">
							<button
								type="button"
								class="truncate text-left text-base font-semibold text-primary hover:text-brand-600 dark:hover:text-brand-400"
								onclick={() => onopen?.(ws.id)}
							>
								{ws.name}
							</button>
							<div class="mt-1 flex flex-wrap items-center gap-2">
								{#if ws.plan}
									<Badge size="sm" variant="secondary">{ws.plan}</Badge>
								{/if}
								{#if ws.role}
									<span class="text-xs text-muted">{ws.role}</span>
								{/if}
							</div>
						</div>
						{#if ws.members != null}
							<div class="flex shrink-0 items-center gap-1.5 text-xs text-muted">
								<Avatar name={`${ws.members} members`} size="xs" ringed={false} />
								<span class="tabular-nums">{ws.members}</span>
							</div>
						{/if}
					</div>

					{#if ws.seats}
						<GoalProgress
							label="Seats"
							current={ws.seats.current}
							target={ws.seats.target}
							tone={ws.seats.current >= ws.seats.target ? 'warning' : 'brand'}
							class="!p-3 !shadow-none"
						/>
					{/if}

					{#if ws.usage?.length}
						<UsageBreakdown items={ws.usage} unit=" GB" class="!p-3" />
					{/if}

					<div class="mt-auto pt-1">
						<Button size="sm" variant="secondary" class="w-full" onclick={() => onopen?.(ws.id)}>
							Open workspace
						</Button>
					</div>
				</article>
			{/each}

			<button
				type="button"
				class="flex min-h-[12rem] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface-overlay/30 p-4 text-center transition-colors hover:border-brand-500/40 hover:bg-surface-overlay/60"
				onclick={() => oncreate?.()}
			>
				<span
					class="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400"
				>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5">
						<path stroke-linecap="round" d="M12 5v14M5 12h14" />
					</svg>
				</span>
				<span class="text-sm font-medium text-primary">Create workspace</span>
				<span class="text-xs text-muted">Start fresh with a new team</span>
			</button>
		</div>
	{:else}
		<EmptyState
			title="No workspaces yet"
			description="Create your first workspace to collaborate with your team."
		>
			{#snippet action()}
				<Button size="sm" onclick={() => oncreate?.()}>Create workspace</Button>
			{/snippet}
		</EmptyState>
	{/if}
</div>
