<script lang="ts">
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Text from '$lib/components/atoms/Text/Text.svelte';

	export type RoadmapStatus = 'planned' | 'in-progress' | 'shipped';

	export interface RoadmapItem {
		id: string;
		title: string;
		description?: string;
		status: RoadmapStatus;
		quarter?: string;
	}

	interface RoadmapProps {
		title?: string;
		description?: string;
		items?: RoadmapItem[];
		class?: string;
	}

	const {
		title = 'Roadmap',
		description = 'What we are building next.',
		items = [],
		class: className = ''
	}: RoadmapProps = $props();

	const columns: { status: RoadmapStatus; label: string }[] = [
		{ status: 'planned', label: 'Planned' },
		{ status: 'in-progress', label: 'In progress' },
		{ status: 'shipped', label: 'Shipped' }
	];

	const badgeVariant: Record<RoadmapStatus, 'default' | 'warning' | 'success'> = {
		planned: 'default',
		'in-progress': 'warning',
		shipped: 'success'
	};

	function itemsFor(status: RoadmapStatus) {
		return items.filter((i) => i.status === status);
	}
</script>

<div class={['w-full space-y-6', className]}>
	<PageHeader {title} {description} />

	<div class="grid gap-4 md:grid-cols-3">
		{#each columns as col}
			<section class="rounded-xl border border-border bg-surface-elevated p-3">
				<div class="mb-3 flex items-center justify-between gap-2">
					<h3 class="text-xs font-semibold uppercase tracking-wide text-secondary">
						{col.label}
					</h3>
					<span class="text-[11px] tabular-nums text-muted">{itemsFor(col.status).length}</span>
				</div>
				<ul class="space-y-2">
					{#each itemsFor(col.status) as item (item.id)}
						<li class="rounded-lg border border-border bg-surface p-3">
							<div class="mb-1 flex flex-wrap items-center gap-1.5">
								<p class="text-sm font-medium text-primary">{item.title}</p>
								{#if item.quarter}
									<Badge size="sm" variant={badgeVariant[item.status]}>{item.quarter}</Badge>
								{/if}
							</div>
							{#if item.description}
								<Text size="xs" tone="muted">{item.description}</Text>
							{/if}
						</li>
					{:else}
						<li class="px-1 py-4 text-center text-xs text-muted">Nothing here yet</li>
					{/each}
				</ul>
			</section>
		{/each}
	</div>
</div>
