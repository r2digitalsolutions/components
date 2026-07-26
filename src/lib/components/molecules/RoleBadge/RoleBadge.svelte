<script lang="ts">
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';

	export type WorkspaceRoleId = 'owner' | 'admin' | 'member' | 'viewer' | (string & {});

	interface RoleBadgeProps {
		role: WorkspaceRoleId;
		label?: string;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	}

	const ROLE_META: Record<
		string,
		{ label: string; variant: 'primary' | 'secondary' | 'info' | 'default' | 'warning' }
	> = {
		owner: { label: 'Owner', variant: 'primary' },
		admin: { label: 'Admin', variant: 'info' },
		member: { label: 'Member', variant: 'secondary' },
		viewer: { label: 'Viewer', variant: 'default' }
	};

	let {
		role,
		label,
		size = 'sm',
		class: className = ''
	}: RoleBadgeProps = $props();

	const meta = $derived(ROLE_META[role] ?? { label: role, variant: 'default' as const });
	const text = $derived(label ?? meta.label);
</script>

<Badge variant={meta.variant} {size} class={className}>{text}</Badge>
