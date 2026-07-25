<script lang="ts">
	import PermissionsProvider from './PermissionsProvider.svelte';
	import Can from '$lib/components/molecules/Can/Can.svelte';
	import ShowIf from '$lib/components/molecules/ShowIf/ShowIf.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import type { PermissionMap } from '$lib/utils/permissions.js';

	const demoMap: PermissionMap = {
		owner: {
			projects: ['read', 'write', 'admin'],
			billing: ['read', 'write', 'admin'],
			settings: ['read', 'write', 'admin']
		},
		admin: {
			projects: ['read', 'write', 'admin'],
			billing: ['read'],
			settings: ['read', 'write']
		},
		member: {
			projects: ['read', 'write'],
			billing: [],
			settings: ['read']
		},
		viewer: {
			projects: ['read'],
			billing: [],
			settings: ['read']
		}
	};

	let role = $state('member');
</script>

<div class="max-w-lg space-y-4 rounded-2xl border border-border bg-surface-elevated p-4">
	<div class="flex flex-wrap items-center gap-2">
		<p class="text-sm font-semibold text-primary">Act as</p>
		{#each ['viewer', 'member', 'admin', 'owner'] as r (r)}
			<button
				type="button"
				class={[
					'rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors',
					role === r
						? 'border-brand-500 bg-brand-500 text-white'
						: 'border-border text-secondary hover:bg-surface-overlay'
				]}
				onclick={() => (role = r)}
			>
				{r}
			</button>
		{/each}
		<Badge size="sm">{role}</Badge>
	</div>

	<PermissionsProvider roles={[role]} map={demoMap}>
		<div class="space-y-3 rounded-xl border border-border bg-surface p-3">
			<p class="text-xs font-medium uppercase tracking-wide text-muted">Can</p>

			<Can resource="projects" level="write">
				<Button size="sm">Edit project</Button>
				{#snippet fallback()}
					<p class="text-sm text-muted">No write access on projects</p>
				{/snippet}
			</Can>

			<Can resource="billing" level="admin">
				<Button size="sm" variant="destructive">Manage billing</Button>
				{#snippet fallback()}
					<p class="text-sm text-muted">Billing admin only</p>
				{/snippet}
			</Can>

			<Can resource="settings" level="write" anyRole={['admin', 'owner']}>
				<Button size="sm" variant="secondary">Workspace settings</Button>
				{#snippet fallback()}
					<p class="text-sm text-muted">Need settings:write and admin|owner</p>
				{/snippet}
			</Can>
		</div>

		<div class="space-y-3 rounded-xl border border-border bg-surface p-3">
			<p class="text-xs font-medium uppercase tracking-wide text-muted">ShowIf</p>

			<ShowIf role="owner">
				<p class="text-sm text-primary">Owner-only banner</p>
				{#snippet fallback()}
					<p class="text-sm text-muted">Hidden unless owner</p>
				{/snippet}
			</ShowIf>

			<ShowIf anyRole={['admin', 'owner']}>
				<p class="text-sm text-primary">Admin tools visible</p>
				{#snippet fallback()}
					<p class="text-sm text-muted">Admin tools hidden</p>
				{/snippet}
			</ShowIf>

			<ShowIf not role="viewer">
				<p class="text-sm text-primary">Not a viewer</p>
			</ShowIf>
		</div>
	</PermissionsProvider>
</div>
