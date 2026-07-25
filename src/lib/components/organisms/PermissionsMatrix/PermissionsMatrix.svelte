<script lang="ts">
	import type { Snippet } from 'svelte';
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import AccessLevelToggle from '$lib/components/molecules/AccessLevelToggle/AccessLevelToggle.svelte';
	import type { AccessLevel } from '$lib/components/molecules/AccessLevelToggle/AccessLevelToggle.svelte';
	import SearchInput from '$lib/components/molecules/SearchInput/SearchInput.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import FolderKanban from '@lucide/svelte/icons/folder-kanban';
	import CreditCard from '@lucide/svelte/icons/credit-card';
	import Users from '@lucide/svelte/icons/users';
	import KeyRound from '@lucide/svelte/icons/key-round';
	import Settings from '@lucide/svelte/icons/settings';
	import Lock from '@lucide/svelte/icons/lock';

	export type PermissionLevel = AccessLevel;

	export interface PermissionRole {
		id: string;
		label: string;
		description?: string;
		/** Cells for this role cannot be edited */
		locked?: boolean;
	}

	export interface PermissionResource {
		id: string;
		label: string;
		description?: string;
		icon?: 'projects' | 'billing' | 'members' | 'api' | 'settings';
	}

	/** roleId → resourceId → levels granted */
	export type PermissionMap = Record<string, Record<string, PermissionLevel[]>>;

	interface PermissionsMatrixProps {
		title?: string;
		description?: string;
		roles?: PermissionRole[];
		resources?: PermissionResource[];
		levels?: PermissionLevel[];
		value?: PermissionMap;
		/** Show search over resources */
		searchable?: boolean;
		query?: string;
		showLegend?: boolean;
		class?: string;
		actions?: Snippet;
		onchange?: (value: PermissionMap) => void;
		onreset?: () => void;
	}

	const ICONS = {
		projects: FolderKanban,
		billing: CreditCard,
		members: Users,
		api: KeyRound,
		settings: Settings
	} as const;

	let {
		title = 'Permissions',
		description = 'Control what each role can do across workspace resources.',
		roles = [
			{ id: 'owner', label: 'Owner', description: 'Full access', locked: true },
			{ id: 'admin', label: 'Admin', description: 'Manage workspace' },
			{ id: 'member', label: 'Member', description: 'Create & edit' },
			{ id: 'viewer', label: 'Viewer', description: 'Read only' }
		],
		resources = [
			{ id: 'projects', label: 'Projects', description: 'Boards and files', icon: 'projects' },
			{ id: 'billing', label: 'Billing', description: 'Plans and invoices', icon: 'billing' },
			{ id: 'members', label: 'Members', description: 'Invites and roles', icon: 'members' },
			{ id: 'api', label: 'API keys', description: 'Secrets and tokens', icon: 'api' },
			{ id: 'settings', label: 'Settings', description: 'Workspace config', icon: 'settings' }
		],
		levels = ['read', 'write', 'admin'] as PermissionLevel[],
		value = $bindable({} as PermissionMap),
		searchable = true,
		query = $bindable(''),
		showLegend = true,
		class: className = '',
		actions,
		onchange,
		onreset
	}: PermissionsMatrixProps = $props();

	const visibleResources = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return resources;
		return resources.filter(
			(r) =>
				r.label.toLowerCase().includes(q) ||
				(r.description?.toLowerCase().includes(q) ?? false)
		);
	});

	function cellLevels(roleId: string, resourceId: string): PermissionLevel[] {
		return value[roleId]?.[resourceId] ?? [];
	}

	function cloneMap(map: PermissionMap): PermissionMap {
		return $state.snapshot(map);
	}

	function setCell(roleId: string, resourceId: string, levelsNext: PermissionLevel[]) {
		const role = roles.find((r) => r.id === roleId);
		if (role?.locked) return;
		const next = cloneMap(value);
		next[roleId] ??= {};
		next[roleId][resourceId] = levelsNext;
		value = next;
		onchange?.(next);
	}

	function grantAll(roleId: string) {
		const role = roles.find((r) => r.id === roleId);
		if (role?.locked) return;
		const next = cloneMap(value);
		next[roleId] ??= {};
		for (const res of resources) {
			next[roleId][res.id] = [...levels];
		}
		value = next;
		onchange?.(next);
	}

	function clearRole(roleId: string) {
		const role = roles.find((r) => r.id === roleId);
		if (role?.locked) return;
		const next = cloneMap(value);
		next[roleId] ??= {};
		for (const res of resources) {
			next[roleId][res.id] = [];
		}
		value = next;
		onchange?.(next);
	}
</script>

<div class={['mx-auto w-full max-w-6xl space-y-5', className]}>
	<PageHeader {title} {description}>
		{#snippet meta()}
			{#if showLegend}
				<div class="flex flex-wrap items-center gap-3 text-[11px] text-muted">
					<span class="inline-flex items-center gap-1">
						<span
							class="inline-flex h-5 min-w-5 items-center justify-center rounded-md bg-surface-elevated text-[10px] font-semibold shadow-sm"
							>R</span
						>
						Read
					</span>
					<span class="inline-flex items-center gap-1">
						<span
							class="inline-flex h-5 min-w-5 items-center justify-center rounded-md bg-sky-500 text-[10px] font-semibold text-white"
							>W</span
						>
						Write
					</span>
					<span class="inline-flex items-center gap-1">
						<span
							class="inline-flex h-5 min-w-5 items-center justify-center rounded-md bg-brand-500 text-[10px] font-semibold text-white"
							>A</span
						>
						Admin
					</span>
				</div>
			{/if}
		{/snippet}
		{#snippet actions()}
			<div class="flex flex-wrap items-center gap-2">
				{#if onreset}
					<Button size="sm" variant="ghost" onclick={() => onreset?.()}>Reset</Button>
				{/if}
				{#if actions}
					{@render actions()}
				{/if}
			</div>
		{/snippet}
	</PageHeader>

	{#if searchable}
		<div class="max-w-xs">
			<SearchInput bind:value={query} placeholder="Filter resources…" size="sm" />
		</div>
	{/if}

	<div class="overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm">
		<div class="overflow-x-auto">
			<table class="w-full min-w-[44rem] border-collapse text-left text-sm">
				<thead>
					<tr class="border-b border-border bg-surface/50">
						<th
							class="sticky left-0 z-10 bg-surface/95 px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted backdrop-blur-sm"
						>
							Resource
						</th>
						{#each roles as role (role.id)}
							<th class="px-3 py-3 text-center">
								<div class="flex flex-col items-center gap-1">
									<div class="flex items-center gap-1.5">
										<span class="text-xs font-semibold text-primary">{role.label}</span>
										{#if role.locked}
											<Badge size="sm" variant="secondary">
												<span class="inline-flex items-center gap-0.5">
													<Lock class="h-3 w-3" strokeWidth={2} />
													Locked
												</span>
											</Badge>
										{/if}
									</div>
									{#if role.description}
										<span class="text-[10px] font-normal text-muted">{role.description}</span>
									{/if}
									{#if !role.locked}
										<div class="flex gap-1">
											<button
												type="button"
												class="text-[10px] font-medium text-brand-600 hover:underline dark:text-brand-400"
												onclick={() => grantAll(role.id)}
											>
												All
											</button>
											<span class="text-[10px] text-muted">·</span>
											<button
												type="button"
												class="text-[10px] font-medium text-muted hover:text-primary hover:underline"
												onclick={() => clearRole(role.id)}
											>
												None
											</button>
										</div>
									{/if}
								</div>
							</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each visibleResources as resource (resource.id)}
						{@const Icon = resource.icon ? ICONS[resource.icon] : null}
						<tr class="border-b border-border/70 last:border-0 hover:bg-surface-overlay/30">
							<td
								class="sticky left-0 z-10 bg-surface-elevated/95 px-4 py-3 backdrop-blur-sm"
							>
								<div class="flex items-center gap-2.5">
									{#if Icon}
										<span
											class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-overlay text-secondary"
										>
											<Icon class="h-4 w-4" strokeWidth={2} />
										</span>
									{/if}
									<div class="min-w-0">
										<p class="text-sm font-medium text-primary">{resource.label}</p>
										{#if resource.description}
											<p class="text-[11px] text-muted">{resource.description}</p>
										{/if}
									</div>
								</div>
							</td>
							{#each roles as role (role.id)}
								<td class="px-3 py-3 text-center">
									<div class="flex justify-center">
										<AccessLevelToggle
											value={cellLevels(role.id, resource.id)}
											{levels}
											disabled={role.locked}
											onchange={(v) => setCell(role.id, resource.id, v)}
										/>
									</div>
								</td>
							{/each}
						</tr>
					{:else}
						<tr>
							<td colspan={roles.length + 1} class="px-4 py-10 text-center text-sm text-muted">
								No resources match your filter.
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
