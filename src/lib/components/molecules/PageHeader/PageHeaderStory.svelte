<script lang="ts">
	import PageHeader from './PageHeader.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';

	let props = $props<{
		title?: string;
		description?: string;
	}>();
</script>

<div class="w-full max-w-3xl rounded-2xl border border-border bg-surface-elevated p-6">
	<PageHeader
		title={props.title ?? 'Project settings'}
		description={props.description ?? 'Manage workspace preferences, members, and billing.'}
		breadcrumbs={[
			{ id: 'home', label: 'Home', href: '#' },
			{ id: 'projects', label: 'Projects', href: '#' },
			{ id: 'settings', label: 'Settings' }
		]}
	>
		{#snippet meta()}
			<Badge variant="success" dot>Active</Badge>
		{/snippet}
		{#snippet actions()}
			<Button size="sm" variant="secondary">Cancel</Button>
			<Button size="sm">Save changes</Button>
		{/snippet}
	</PageHeader>
</div>
