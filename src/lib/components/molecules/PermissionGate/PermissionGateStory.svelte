<script lang="ts">
	import PermissionsProvider from '$lib/components/molecules/PermissionsProvider/PermissionsProvider.svelte';
	import PermissionGate from './PermissionGate.svelte';
	import type { PermissionMap } from '$lib/utils/permissions.js';

	const map: PermissionMap = {
		member: { projects: ['read'] },
		admin: { projects: ['read', 'write', 'admin'] }
	};

	let role = $state('member');
</script>

<div class="max-w-md space-y-3">
	<div class="flex gap-2">
		{#each ['member', 'admin'] as r (r)}
			<button
				type="button"
				class={[
					'rounded-lg border px-2.5 py-1 text-xs',
					role === r ? 'border-brand-500 bg-brand-500 text-white' : 'border-border'
				]}
				onclick={() => (role = r)}
			>
				{r}
			</button>
		{/each}
	</div>

	<PermissionsProvider roles={[role]} map={map}>
		<PermissionGate resource="projects" level="write" actionLabel="Request access">
			<p class="rounded-xl border border-border bg-surface-elevated p-4 text-sm text-primary">
				Secret editor content
			</p>
		</PermissionGate>
	</PermissionsProvider>
</div>
