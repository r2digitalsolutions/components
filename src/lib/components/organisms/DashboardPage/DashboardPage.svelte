<script lang="ts">
	import type { Snippet } from 'svelte';
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import type { BreadcrumbItem } from '$lib/components/molecules/Breadcrumb/Breadcrumb.svelte';
	import MetricGrid from '$lib/components/molecules/MetricGrid/MetricGrid.svelte';
	import type { MetricItem } from '$lib/components/molecules/MetricGrid/MetricGrid.svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';

	interface DashboardPageProps {
		title?: string;
		description?: string;
		breadcrumbs?: BreadcrumbItem[];
		metrics?: MetricItem[];
		empty?: boolean;
		class?: string;
		actions?: Snippet;
		children?: Snippet;
	}

	const {
		title = 'Dashboard',
		description = 'Overview of your workspace activity.',
		breadcrumbs = [],
		metrics = [],
		empty = false,
		class: className = '',
		actions,
		children
	}: DashboardPageProps = $props();
</script>

<div class={['w-full space-y-6', className]}>
	<PageHeader {title} {description} {breadcrumbs}>
		{#snippet actions()}
			{#if actions}
				{@render actions()}
			{/if}
		{/snippet}
	</PageHeader>

	{#if metrics.length}
		<MetricGrid items={metrics} cols={4} />
	{/if}

	{#if empty}
		<EmptyState title="Nothing here yet" description="Connect a data source to populate this dashboard." />
	{:else if children}
		{@render children()}
	{:else}
		<div class="flex flex-col gap-4 lg:flex-row">
			<Card class="flex-1" padding="lg" chrome={false}>
				{#snippet header()}
					<p class="text-sm font-semibold text-primary">Recent activity</p>
				{/snippet}
				<p class="text-sm text-muted">Activity feed content goes here.</p>
			</Card>
			<Card class="w-full lg:w-80" padding="lg" chrome={false}>
				{#snippet header()}
					<p class="text-sm font-semibold text-primary">Quick links</p>
				{/snippet}
				<ul class="space-y-2 text-sm text-secondary">
					<li>Invite teammates</li>
					<li>Create a project</li>
					<li>View billing</li>
				</ul>
			</Card>
		</div>
	{/if}
</div>
