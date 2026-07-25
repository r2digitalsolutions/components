<script lang="ts">
	import PermissionsMatrix from './PermissionsMatrix.svelte';
	import type { PermissionMap } from './PermissionsMatrix.svelte';

	let value = $state<PermissionMap>({
		owner: {
			projects: ['read', 'write', 'admin'],
			billing: ['read', 'write', 'admin'],
			members: ['read', 'write', 'admin'],
			api: ['read', 'write', 'admin']
		},
		admin: {
			projects: ['read', 'write'],
			billing: ['read'],
			members: ['read', 'write'],
			api: ['read', 'write']
		},
		member: {
			projects: ['read', 'write'],
			billing: [],
			members: ['read'],
			api: ['read']
		},
		viewer: {
			projects: ['read'],
			billing: [],
			members: ['read'],
			api: []
		}
	});
</script>

<PermissionsMatrix bind:value />
