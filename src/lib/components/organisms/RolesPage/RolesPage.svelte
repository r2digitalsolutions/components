<script lang="ts">
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import RoleCard from '$lib/components/molecules/RoleCard/RoleCard.svelte';
	import type { RolePermissionSummary } from '$lib/components/molecules/RoleCard/RoleCard.svelte';
	import PermissionsMatrix from '$lib/components/organisms/PermissionsMatrix/PermissionsMatrix.svelte';
	import type {
		PermissionMap,
		PermissionRole,
		PermissionResource
	} from '$lib/components/organisms/PermissionsMatrix/PermissionsMatrix.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Plus from '@lucide/svelte/icons/plus';

	export interface WorkspaceRole {
		id: string;
		name: string;
		description?: string;
		memberCount?: number;
		system?: boolean;
		locked?: boolean;
	}

	interface RolesPageProps {
		title?: string;
		description?: string;
		roles?: WorkspaceRole[];
		resources?: PermissionResource[];
		permissions?: PermissionMap;
		selectedRoleId?: string;
		class?: string;
		onselect?: (id: string) => void;
		oncreate?: () => void;
		onedit?: (id: string) => void;
		onsave?: (permissions: PermissionMap) => void;
		onchange?: (permissions: PermissionMap) => void;
	}

	let {
		title = 'Roles & permissions',
		description = 'Define roles and fine-tune access per resource.',
		roles = [
			{
				id: 'owner',
				name: 'Owner',
				description: 'Full control including billing and destructive actions.',
				memberCount: 1,
				system: true,
				locked: true
			},
			{
				id: 'admin',
				name: 'Admin',
				description: 'Manage workspace content and members.',
				memberCount: 3
			},
			{
				id: 'member',
				name: 'Member',
				description: 'Create and edit day-to-day work.',
				memberCount: 12
			},
			{
				id: 'viewer',
				name: 'Viewer',
				description: 'Read-only access to shared resources.',
				memberCount: 5
			}
		],
		resources = [
			{ id: 'projects', label: 'Projects', description: 'Boards and files', icon: 'projects' },
			{ id: 'billing', label: 'Billing', description: 'Plans and invoices', icon: 'billing' },
			{ id: 'members', label: 'Members', description: 'Invites and roles', icon: 'members' },
			{ id: 'api', label: 'API keys', description: 'Secrets and tokens', icon: 'api' },
			{ id: 'settings', label: 'Settings', description: 'Workspace config', icon: 'settings' }
		],
		permissions = $bindable<PermissionMap>({
			owner: {
				projects: ['read', 'write', 'admin'],
				billing: ['read', 'write', 'admin'],
				members: ['read', 'write', 'admin'],
				api: ['read', 'write', 'admin'],
				settings: ['read', 'write', 'admin']
			},
			admin: {
				projects: ['read', 'write'],
				billing: ['read'],
				members: ['read', 'write'],
				api: ['read', 'write'],
				settings: ['read', 'write']
			},
			member: {
				projects: ['read', 'write'],
				billing: [],
				members: ['read'],
				api: ['read'],
				settings: ['read']
			},
			viewer: {
				projects: ['read'],
				billing: [],
				members: ['read'],
				api: [],
				settings: []
			}
		}),
		selectedRoleId = $bindable('admin'),
		class: className = '',
		onselect,
		oncreate,
		onedit,
		onsave,
		onchange
	}: RolesPageProps = $props();

	const matrixRoles = $derived(
		roles.map(
			(r): PermissionRole => ({
				id: r.id,
				label: r.name,
				description: r.description,
				locked: r.locked ?? r.system
			})
		)
	);

	function summariesFor(roleId: string): RolePermissionSummary[] {
		const map = permissions[roleId] ?? {};
		return resources.map((res) => ({
			resource: res.label,
			levels: map[res.id] ?? []
		}));
	}

	function select(id: string) {
		selectedRoleId = id;
		onselect?.(id);
	}
</script>

<div class={['mx-auto w-full max-w-6xl space-y-6', className]}>
	<PageHeader {title} {description}>
		{#snippet actions()}
			{#if oncreate}
				<Button size="sm" onclick={() => oncreate?.()}>
					<Plus class="h-3.5 w-3.5" strokeWidth={2} />
					New role
				</Button>
			{/if}
		{/snippet}
	</PageHeader>

	<div class="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[20rem_minmax(0,1fr)]">
		<aside class="min-w-0 space-y-3 lg:sticky lg:top-4 lg:self-start">
			<p class="px-1 text-[11px] font-semibold uppercase tracking-wide text-muted">Roles</p>
			{#each roles as role (role.id)}
				<RoleCard
					id={role.id}
					name={role.name}
					description={role.description}
					memberCount={role.memberCount}
					system={role.system}
					selected={selectedRoleId === role.id}
					permissions={summariesFor(role.id)}
					onclick={() => select(role.id)}
					onedit={onedit ? () => onedit?.(role.id) : undefined}
				/>
			{/each}
		</aside>

		<div class="min-w-0">
			<PermissionsMatrix
				title="Access matrix"
				description="Toggle read, write, and admin for each role and resource."
				roles={matrixRoles}
				{resources}
				bind:value={permissions}
				onchange={(v) => onchange?.(v)}
			>
				{#snippet actions()}
					{#if onsave}
						<Button size="sm" onclick={() => onsave?.(permissions)}>Save changes</Button>
					{/if}
				{/snippet}
			</PermissionsMatrix>
		</div>
	</div>
</div>
