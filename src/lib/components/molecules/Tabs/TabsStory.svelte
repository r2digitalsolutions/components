<script lang="ts">
	import Tabs, { type TabItem } from './Tabs.svelte';

	let props = $props<{
		variant?: 'underline' | 'pills';
		fullWidth?: boolean;
	}>();

	const items: TabItem[] = [
		{ id: 'overview', label: 'Overview' },
		{ id: 'analytics', label: 'Analytics' },
		{ id: 'settings', label: 'Settings' },
		{ id: 'billing', label: 'Billing', disabled: true }
	];

	let value = $state('overview');
</script>

<div class="w-96 max-w-full space-y-4">
	<Tabs
		{items}
		bind:value
		variant={props.variant ?? 'underline'}
		fullWidth={props.fullWidth ?? false}
	/>
	<p class="text-sm text-secondary">Active tab: <span class="font-medium text-primary">{value}</span></p>
</div>
