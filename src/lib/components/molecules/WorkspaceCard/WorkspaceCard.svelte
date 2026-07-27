<script lang="ts">
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import AvatarGroup from '$lib/components/molecules/AvatarGroup/AvatarGroup.svelte';
	import type { AvatarGroupItem } from '$lib/components/molecules/AvatarGroup/AvatarGroup.svelte';
	import RoleBadge from '$lib/components/molecules/RoleBadge/RoleBadge.svelte';
	import type { WorkspaceRoleId } from '$lib/components/molecules/RoleBadge/RoleBadge.svelte';
	import SeatMeter from '$lib/components/molecules/SeatMeter/SeatMeter.svelte';
	import UsageBreakdown from '$lib/components/molecules/UsageBreakdown/UsageBreakdown.svelte';
	import type { UsageBreakdownItem } from '$lib/components/molecules/UsageBreakdown/UsageBreakdown.svelte';
	import Building2 from '@lucide/svelte/icons/building-2';
	import Star from '@lucide/svelte/icons/star';

	export interface WorkspaceSeats {
		current: number;
		target: number;
	}

	export type WorkspaceCardTone = 'brand' | 'sky' | 'emerald' | 'amber' | 'rose';
	export type WorkspaceCardStatus = 'active' | 'trial' | 'archived';
	export type WorkspaceCardLayout = 'card' | 'row';

	export interface WorkspaceItem {
		id: string;
		name: string;
		plan?: string;
		members?: number;
		memberAvatars?: AvatarGroupItem[];
		usage?: UsageBreakdownItem[];
		seats?: WorkspaceSeats;
		role?: WorkspaceRoleId;
		favorite?: boolean;
		lastActive?: string;
		status?: WorkspaceCardStatus;
		tone?: WorkspaceCardTone;
		initials?: string;
	}

	/** @deprecated Prefer WorkspaceItem */
	export type WorkspaceCard = WorkspaceItem;

	interface WorkspaceCardProps {
		workspace: WorkspaceItem;
		layout?: WorkspaceCardLayout;
		/** Hide usage chart */
		hideUsage?: boolean;
		class?: string;
		onopen?: (id: string) => void;
		onfavorite?: (id: string, favorite: boolean) => void;
		onupgrade?: (id: string) => void;
	}

	const TONE: Record<WorkspaceCardTone, string> = {
		brand: 'bg-brand-500/15 text-brand-700 dark:text-brand-300',
		sky: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
		emerald: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
		amber: 'bg-amber-500/15 text-amber-800 dark:text-amber-300',
		rose: 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
	};

	let {
		workspace,
		layout = 'card',
		hideUsage = false,
		class: className = '',
		onopen,
		onfavorite,
		onupgrade
	}: WorkspaceCardProps = $props();

	const initials = $derived(
		workspace.initials ??
			workspace.name
				.split(/\s+/)
				.slice(0, 2)
				.map((w) => w[0]?.toUpperCase() ?? '')
				.join('')
	);

	const toneClass = $derived(TONE[workspace.tone ?? 'brand']);
	const status = $derived(workspace.status ?? 'active');
	const isArchived = $derived(status === 'archived');

	function toggleFavorite(e: MouseEvent) {
		e.stopPropagation();
		onfavorite?.(workspace.id, !workspace.favorite);
	}
</script>

{#if layout === 'row'}
	<article
		class={[
			'flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface-elevated p-3 transition-colors',
			!isArchived && 'hover:border-brand-500/30',
			isArchived && 'opacity-70',
			className
		]}
	>
		<span
			class={[
				'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold',
				toneClass
			]}
		>
			{initials}
		</span>

		<div class="min-w-0 flex-1">
			<div class="flex flex-wrap items-center gap-2">
				<button
					type="button"
					class="truncate text-left text-sm font-semibold text-primary hover:text-brand-600 dark:hover:text-brand-400"
					onclick={() => onopen?.(workspace.id)}
					disabled={isArchived}
				>
					{workspace.name}
				</button>
				{#if workspace.plan}
					<Badge size="sm" variant="secondary">{workspace.plan}</Badge>
				{/if}
				{#if workspace.role}
					<RoleBadge role={workspace.role} />
				{/if}
				{#if status === 'trial'}
					<Badge size="sm" variant="warning">Trial</Badge>
				{/if}
				{#if status === 'archived'}
					<Badge size="sm" variant="default">Archived</Badge>
				{/if}
			</div>
			<div class="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted">
				{#if workspace.members != null}
					<span class="tabular-nums">{workspace.members} members</span>
				{/if}
				{#if workspace.lastActive}
					<span>Active {workspace.lastActive}</span>
				{/if}
				{#if workspace.seats}
					<span class="tabular-nums">
						Seats {workspace.seats.current}/{workspace.seats.target}
					</span>
				{/if}
			</div>
		</div>

		{#if workspace.memberAvatars?.length}
			<AvatarGroup items={workspace.memberAvatars} max={3} size="xs" ring="elevated" />
		{/if}

		<div class="flex shrink-0 items-center gap-1">
			{#if onfavorite}
				<button
					type="button"
					class={[
						'rounded-lg p-1.5 transition-colors',
						workspace.favorite
							? 'text-amber-500 hover:bg-amber-500/10'
							: 'text-muted hover:bg-surface-overlay hover:text-secondary'
					]}
					aria-label={workspace.favorite ? 'Unfavorite' : 'Favorite'}
					onclick={toggleFavorite}
				>
					<Star
						class="h-4 w-4"
						strokeWidth={2}
						fill={workspace.favorite ? 'currentColor' : 'none'}
					/>
				</button>
			{/if}
			{#if !isArchived}
				<Button size="sm" variant="secondary" onclick={() => onopen?.(workspace.id)}>
					Open
				</Button>
			{/if}
		</div>
	</article>
{:else}
	<article
		class={[
			'flex flex-col gap-4 rounded-xl border border-border bg-surface-elevated p-4 transition-colors',
			!isArchived && 'hover:border-brand-500/30',
			isArchived && 'opacity-70',
			className
		]}
	>
		<div class="flex items-start justify-between gap-3">
			<div class="flex min-w-0 items-start gap-3">
				<span
					class={[
						'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-semibold',
						toneClass
					]}
				>
					{#if initials}
						{initials}
					{:else}
						<Building2 class="h-5 w-5" strokeWidth={2} />
					{/if}
				</span>
				<div class="min-w-0">
					<button
						type="button"
						class="truncate text-left text-base font-semibold text-primary hover:text-brand-600 dark:hover:text-brand-400"
						onclick={() => onopen?.(workspace.id)}
						disabled={isArchived}
					>
						{workspace.name}
					</button>
					<div class="mt-1 flex flex-wrap items-center gap-2">
						{#if workspace.plan}
							<Badge size="sm" variant="secondary">{workspace.plan}</Badge>
						{/if}
						{#if workspace.role}
							<RoleBadge role={workspace.role} />
						{/if}
						{#if status === 'trial'}
							<Badge size="sm" variant="warning">Trial</Badge>
						{/if}
						{#if status === 'archived'}
							<Badge size="sm" variant="default">Archived</Badge>
						{/if}
					</div>
				</div>
			</div>

			{#if onfavorite}
				<button
					type="button"
					class={[
						'shrink-0 rounded-lg p-1.5 transition-colors',
						workspace.favorite
							? 'text-amber-500 hover:bg-amber-500/10'
							: 'text-muted hover:bg-surface-overlay hover:text-secondary'
					]}
					aria-label={workspace.favorite ? 'Unfavorite' : 'Favorite'}
					onclick={toggleFavorite}
				>
					<Star
						class="h-4 w-4"
						strokeWidth={2}
						fill={workspace.favorite ? 'currentColor' : 'none'}
					/>
				</button>
			{/if}
		</div>

		<div class="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
			{#if workspace.memberAvatars?.length}
				<AvatarGroup items={workspace.memberAvatars} max={4} size="xs" ring="elevated" />
			{:else if workspace.members != null}
				<span class="tabular-nums">{workspace.members} members</span>
			{:else}
				<span></span>
			{/if}
			{#if workspace.lastActive}
				<span>Active {workspace.lastActive}</span>
			{/if}
		</div>

		{#if workspace.seats}
			<SeatMeter
				compact
				used={workspace.seats.current}
				total={workspace.seats.target}
				onupgrade={
					onupgrade && workspace.seats.current >= workspace.seats.target * 0.8
						? () => onupgrade?.(workspace.id)
						: undefined
				}
			/>
		{/if}

		{#if !hideUsage && workspace.usage?.length}
			<UsageBreakdown items={workspace.usage} unit=" GB" class="!p-3" />
		{/if}

		{#if !isArchived}
			<div class="mt-auto pt-1">
				<Button size="sm" variant="secondary" class="w-full" onclick={() => onopen?.(workspace.id)}>
					Open workspace
				</Button>
			</div>
		{/if}
	</article>
{/if}
