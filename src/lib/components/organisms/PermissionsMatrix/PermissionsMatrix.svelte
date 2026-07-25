<script lang="ts">
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import Checkbox from '$lib/components/atoms/Checkbox/Checkbox.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	export type PermissionLevel = 'read' | 'write' | 'admin';

	export interface PermissionRole {
		id: string;
		label: string;
	}

	export interface PermissionResource {
		id: string;
		label: string;
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
		class?: string;
		onchange?: (value: PermissionMap) => void;
	}

	let {
		title = 'Permissions',
		description = 'Roles × resources access matrix.',
		roles = [
			{ id: 'owner', label: 'Owner' },
			{ id: 'admin', label: 'Admin' },
			{ id: 'member', label: 'Member' },
			{ id: 'viewer', label: 'Viewer' }
		],
		resources = [
			{ id: 'projects', label: 'Projects' },
			{ id: 'billing', label: 'Billing' },
			{ id: 'members', label: 'Members' },
			{ id: 'api', label: 'API keys' }
		],
		levels = ['read', 'write', 'admin'],
		value = $bindable({} as PermissionMap),
		class: className = '',
		onchange
	}: PermissionsMatrixProps = $props();

	function has(roleId: string, resourceId: string, level: PermissionLevel) {
		return value[roleId]?.[resourceId]?.includes(level) ?? false;
	}

	function toggle(roleId: string, resourceId: string, level: PermissionLevel) {
		const next: PermissionMap = structuredClone(value);
		next[roleId] ??= {};
		const current = new Set(next[roleId][resourceId] ?? []);
		if (current.has(level)) current.delete(level);
		else current.add(level);
		next[roleId][resourceId] = [...current];
		value = next;
		onchange?.(next);
	}
</script>

<div class={['w-full space-y-4', className]}>
	<PageHeader {title} {description} />

	<div class="overflow-x-auto rounded-xl border border-border">
		<table class="w-full min-w-[40rem] border-collapse text-left text-xs">
			<thead>
				<tr class="border-b border-border bg-surface-overlay/60">
					<th class="px-3 py-2.5 font-semibold text-secondary">Resource</th>
					{#each roles as role}
						<th class="px-3 py-2.5 text-center font-semibold text-secondary">{role.label}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each resources as resource}
					<tr class="border-b border-border last:border-b-0">
						<td class="px-3 py-3 font-medium text-primary">{resource.label}</td>
						{#each roles as role}
							<td class="px-2 py-2.5">
								<div class="flex flex-wrap items-center justify-center gap-2">
									{#each levels as level}
										<div class="inline-flex flex-col items-center gap-0.5">
											<Checkbox
												checked={has(role.id, resource.id, level)}
												size="sm"
												label={level}
												onchange={() => toggle(role.id, resource.id, level)}
											/>
										</div>
									{/each}
								</div>
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<Text size="xs" tone="muted">Toggle read / write / admin per role and resource.</Text>
</div>
