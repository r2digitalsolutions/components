<script lang="ts">
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import FilterBar from '$lib/components/molecules/FilterBar/FilterBar.svelte';
	import type { FilterChip } from '$lib/components/molecules/FilterBar/FilterBar.svelte';
	import Timeline from '$lib/components/molecules/Timeline/Timeline.svelte';
	import type { TimelineItem } from '$lib/components/molecules/Timeline/Timeline.svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import AvatarLabel from '$lib/components/molecules/AvatarLabel/AvatarLabel.svelte';
	import Time from '$lib/components/atoms/Time/Time.svelte';

	export interface AuditEvent {
		id: string;
		title: string;
		description?: string;
		actor?: string;
		avatar?: string;
		date: Date | string | number;
		category?: string;
	}

	interface AuditLogPageProps {
		events?: AuditEvent[];
		query?: string;
		filters?: FilterChip[];
		class?: string;
	}

	let {
		events = [],
		query = $bindable(''),
		filters = $bindable<FilterChip[]>([]),
		class: className = ''
	}: AuditLogPageProps = $props();

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		let list = events;
		if (filters.length) {
			const ids = new Set(filters.map((f) => f.id));
			list = list.filter((e) => !e.category || ids.has(e.category));
		}
		if (!q) return list;
		return list.filter(
			(e) =>
				e.title.toLowerCase().includes(q) ||
				(e.description?.toLowerCase().includes(q) ?? false) ||
				(e.actor?.toLowerCase().includes(q) ?? false)
		);
	});

	const timelineItems = $derived(
		filtered.map(
			(e): TimelineItem => ({
				id: e.id,
				title: e.title,
				description: e.description,
				timestamp:
					typeof e.date === 'number'
						? new Date(e.date).toISOString()
						: typeof e.date === 'string'
							? e.date
							: e.date.toISOString()
			})
		)
	);
</script>

<div class={['w-full space-y-5', className]}>
	<PageHeader
		title="Audit log"
		description="Security-relevant actions across the workspace."
	/>

	<FilterBar bind:query bind:filters placeholder="Search actors or actions…" />

	{#if filtered.length === 0}
		<EmptyState title="No events" description="Try clearing filters or broadening your search." />
	{:else}
		<div class="grid gap-4 lg:grid-cols-5">
			<Card class="lg:col-span-3" padding="lg" chrome={false}>
				<Timeline items={timelineItems} />
			</Card>
			<Card class="lg:col-span-2" padding="md" chrome={false}>
				<ul class="space-y-3">
					{#each filtered.slice(0, 6) as event (event.id)}
						<li class="rounded-xl border border-border px-3 py-2">
							<p class="text-sm font-medium text-primary">{event.title}</p>
							{#if event.actor}
								<div class="mt-1.5">
									<AvatarLabel name={event.actor} avatar={event.avatar} size="xs" />
								</div>
							{/if}
							<div class="mt-1">
								<Time date={event.date} format="datetime" class="text-xs text-muted" />
							</div>
						</li>
					{/each}
				</ul>
			</Card>
		</div>
	{/if}
</div>
