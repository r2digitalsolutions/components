<script lang="ts">
	import PermissionsMatrix from './PermissionsMatrix.svelte';
	import type { PermissionMap } from './PermissionsMatrix.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	let value = $state<PermissionMap>({
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
	});

	const snapshot = $state.snapshot(value);
	let last = $state('');
</script>

<div class="p-4">
	<PermissionsMatrix
		bind:value
		onreset={() => {
			value = $state.snapshot(snapshot);
			last = 'reset';
		}}
	>
		{#snippet actions()}
			<Button size="sm" onclick={() => (last = 'save')}>Save changes</Button>
		{/snippet}
	</PermissionsMatrix>
</div>
{#if last}
	<p class="text-center text-xs text-muted">Action: {last}</p>
{/if}
