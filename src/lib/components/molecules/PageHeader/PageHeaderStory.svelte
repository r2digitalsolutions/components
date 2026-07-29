<script lang="ts">
	import PageHeader from './PageHeader.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import Plus from '@lucide/svelte/icons/plus';
	import Download from '@lucide/svelte/icons/download';

	let props = $props<{
		title?: string;
		description?: string;
		size?: 'sm' | 'md' | 'lg';
		sticky?: boolean;
		loading?: boolean;
		variant?: 'default' | 'with-back' | 'minimal' | 'detail' | 'loading' | 'tabs' | 'sticky';
	}>();

	const variant = $derived(props.variant ?? 'default');
	let activeTab = $state('General');
</script>

		<div class="w-full max-w-3xl rounded-2xl border border-border bg-surface-elevated p-6">

	<!-- Default: breadcrumbs + meta + actions -->
	{#if variant === 'default'}
		<PageHeader
			title={props.title ?? 'Project settings'}
			description={props.description ?? 'Manage workspace preferences, members, and billing.'}
			size={props.size}
			breadcrumbs={[
				{ id: 'home', label: 'Home', href: '#' },
				{ id: 'projects', label: 'Projects', href: '#' },
				{ id: 'settings', label: 'Settings' }
			]}
		>
			{#snippet status()}
				<Badge variant="success" dot>Active</Badge>
			{/snippet}
			{#snippet meta()}
				<p class="text-xs text-muted">Last saved 2 minutes ago</p>
			{/snippet}
			{#snippet actions()}
				<Button size="sm" variant="secondary">Cancel</Button>
				<Button size="sm">Save changes</Button>
			{/snippet}
		</PageHeader>

	<!-- Back arrow + actions -->
	{:else if variant === 'with-back'}
		<PageHeader
			title={props.title ?? 'Ana López'}
			description={props.description ?? 'Profile, plan and activity for this account.'}
			size={props.size}
		>
			{#snippet leading()}
				<a
					href="#"
					class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-secondary transition-colors hover:bg-surface-overlay"
					aria-label="Go back"
				>
					<ArrowLeft class="h-4 w-4" />
				</a>
			{/snippet}
			{#snippet status()}
				<Badge variant="error">Suspended</Badge>
			{/snippet}
			{#snippet actions()}
				<Button size="sm" variant="secondary">
					<Download class="mr-1.5 h-3.5 w-3.5" />
					Export
				</Button>
				<Button size="sm" variant="destructive">Suspend</Button>
			{/snippet}
		</PageHeader>

	<!-- Minimal: just title -->
	{:else if variant === 'minimal'}
		<PageHeader title={props.title ?? 'Overview'} size={props.size} />

	<!-- Detail: back + breadcrumbs + status + meta + actions -->
	{:else if variant === 'detail'}
		<PageHeader
			title={props.title ?? 'Invoice #1042'}
			description={props.description ?? 'Created 28 Jul 2026 — due in 7 days.'}
			size={props.size ?? 'lg'}
			breadcrumbs={[
				{ id: 'billing', label: 'Billing', href: '#' },
				{ id: 'invoices', label: 'Invoices', href: '#' },
				{ id: 'invoice', label: '#1042' }
			]}
		>
			{#snippet leading()}
				<a
					href="#"
					class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-secondary transition-colors hover:bg-surface-overlay"
					aria-label="Go back"
				>
					<ArrowLeft class="h-4 w-4" />
				</a>
			{/snippet}
			{#snippet status()}
				<Badge variant="warning">Pending</Badge>
			{/snippet}
			{#snippet meta()}
				<div class="flex flex-wrap gap-1.5">
					<Badge variant="default">€ 1,280</Badge>
					<span class="text-xs text-muted">Due 4 Aug 2026</span>
				</div>
			{/snippet}
			{#snippet actions()}
				<Button size="sm" variant="secondary">
					<Download class="mr-1.5 h-3.5 w-3.5" />
					Download PDF
				</Button>
				<Button size="sm">
					<Plus class="mr-1.5 h-3.5 w-3.5" />
					Send reminder
				</Button>
			{/snippet}
		</PageHeader>

	<!-- Loading skeleton -->
	{:else if variant === 'loading'}
		<PageHeader
			title={props.title ?? 'Project settings'}
			description="Loading…"
			loading
			size={props.size}
		>
			{#snippet actions()}
				<Button size="sm">Save</Button>
			{/snippet}
		</PageHeader>

	<!-- With tabs -->
	{:else if variant === 'tabs'}
		<PageHeader
			title={props.title ?? 'Settings'}
			description={props.description ?? 'Workspace configuration.'}
			size={props.size}
		>
			{#snippet status()}
				<Badge variant="primary">Pro</Badge>
			{/snippet}
			{#snippet actions()}
				<Button size="sm">
					<Plus class="mr-1.5 h-3.5 w-3.5" />
					Invite member
				</Button>
			{/snippet}
			{#snippet tabs()}
				<nav class="flex gap-1 border-b border-border">
					{#each ['General', 'Members', 'Billing', 'Security'] as tab}
						<button
							type="button"
							onclick={() => (activeTab = tab)}
							class={[
								'px-3 pb-2.5 pt-1 text-sm font-medium transition-colors',
								activeTab === tab
									? 'border-b-2 border-brand-500 text-brand-600'
									: 'text-muted hover:text-primary'
							]}
						>{tab}</button>
					{/each}
				</nav>
			{/snippet}
		</PageHeader>

	<!-- Sticky (scrollable preview) -->
	{:else if variant === 'sticky'}
		<PageHeader
			title={props.title ?? 'Dashboard'}
			description="This header sticks to the top as you scroll."
			sticky
			size={props.size}
		>
			{#snippet actions()}
				<Button size="sm">Action</Button>
			{/snippet}
		</PageHeader>
		<div class="space-y-3 p-6 pt-4 min-h-screen">
			{#each Array.from({ length: 24 }) as _, i}
				<div class="h-8 rounded-lg bg-surface-overlay text-xs flex items-center px-3 text-muted">
					Content row {i + 1}
				</div>
			{/each}
		</div>
	{/if}
</div>
