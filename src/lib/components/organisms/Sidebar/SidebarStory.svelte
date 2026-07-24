<script lang="ts">
	import Sidebar, { type SidebarGroup } from './Sidebar.svelte';
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';

	let props = $props<{
		collapsed?: boolean;
	}>();

	const groups: SidebarGroup[] = [
		{
			id: 'main',
			label: 'Workspace',
			items: [
				{ id: 'home', label: 'Home' },
				{ id: 'projects', label: 'Projects' },
				{ id: 'billing', label: 'Billing' }
			]
		},
		{
			id: 'settings',
			label: 'Settings',
			items: [
				{ id: 'team', label: 'Team' },
				{ id: 'api', label: 'API keys', disabled: true }
			]
		}
	];

	let value = $state('projects');
	let collapsed = $state(props.collapsed ?? false);
</script>

<div class="h-[28rem] w-full max-w-3xl overflow-hidden rounded-xl border border-border bg-surface">
	<div class="flex h-full">
		<Sidebar {groups} bind:value bind:collapsed brand="R2 Digi">
			{#snippet footer()}
				{#if !collapsed}
					<div class="flex items-center gap-2">
						<Avatar name="Rafa G" size="sm" />
						<div class="min-w-0">
							<p class="truncate text-xs font-medium text-primary">Rafa G</p>
							<p class="truncate text-[11px] text-muted">Admin</p>
						</div>
					</div>
				{:else}
					<Avatar name="Rafa G" size="sm" />
				{/if}
			{/snippet}
		</Sidebar>
		<div class="flex flex-1 items-center justify-center p-6 text-sm text-secondary">
			Selected: <span class="ml-1 font-medium text-primary">{value}</span>
		</div>
	</div>
</div>
