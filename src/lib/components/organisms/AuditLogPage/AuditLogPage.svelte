<script lang="ts">
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import SearchInput from '$lib/components/molecules/SearchInput/SearchInput.svelte';
	import SegmentedControl from '$lib/components/molecules/SegmentedControl/SegmentedControl.svelte';
	import type { SegmentItem } from '$lib/components/molecules/SegmentedControl/SegmentedControl.svelte';
	import EmptyState from '$lib/components/molecules/EmptyState/EmptyState.svelte';
	import AvatarLabel from '$lib/components/molecules/AvatarLabel/AvatarLabel.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Time from '$lib/components/atoms/Time/Time.svelte';
	import ScrollText from '@lucide/svelte/icons/scroll-text';
	import Download from '@lucide/svelte/icons/download';
	import Shield from '@lucide/svelte/icons/shield';
	import CreditCard from '@lucide/svelte/icons/credit-card';
	import Users from '@lucide/svelte/icons/users';
	import Settings from '@lucide/svelte/icons/settings';
	import CircleAlert from '@lucide/svelte/icons/circle-alert';
	import Info from '@lucide/svelte/icons/info';
	import TriangleAlert from '@lucide/svelte/icons/triangle-alert';

	export type AuditSeverity = 'info' | 'warning' | 'critical';

	export interface AuditEvent {
		id: string;
		title: string;
		description?: string;
		actor?: string;
		avatar?: string;
		date: Date | string | number;
		category?: string;
		severity?: AuditSeverity;
		ip?: string;
		target?: string;
	}

	interface AuditLogPageProps {
		title?: string;
		description?: string;
		events?: AuditEvent[];
		query?: string;
		/** Active category filter id (`all` = no filter) */
		category?: string;
		categories?: SegmentItem[];
		updatedLabel?: string;
		class?: string;
		onexport?: () => void;
	}

	let {
		title = 'Audit log',
		description = 'Security-relevant actions across the workspace.',
		events = [],
		query = $bindable(''),
		category = $bindable('all'),
		categories = [
			{ id: 'all', label: 'All' },
			{ id: 'security', label: 'Security' },
			{ id: 'billing', label: 'Billing' },
			{ id: 'members', label: 'Members' },
			{ id: 'settings', label: 'Settings' }
		],
		updatedLabel = 'Streaming live',
		class: className = '',
		onexport
	}: AuditLogPageProps = $props();

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		let list = events;
		if (category && category !== 'all') {
			list = list.filter((e) => e.category === category);
		}
		if (!q) return list;
		return list.filter(
			(e) =>
				e.title.toLowerCase().includes(q) ||
				(e.description?.toLowerCase().includes(q) ?? false) ||
				(e.actor?.toLowerCase().includes(q) ?? false) ||
				(e.target?.toLowerCase().includes(q) ?? false) ||
				(e.ip?.toLowerCase().includes(q) ?? false)
		);
	});

	function dayKey(date: Date | string | number): string {
		const d = typeof date === 'number' || typeof date === 'string' ? new Date(date) : date;
		return d.toLocaleDateString('en', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	const groups = $derived.by(() => {
		const map = new Map<string, AuditEvent[]>();
		for (const e of filtered) {
			const key = dayKey(e.date);
			const bucket = map.get(key) ?? [];
			bucket.push(e);
			map.set(key, bucket);
		}
		return [...map.entries()];
	});

	const categoryIcon: Record<string, typeof Shield> = {
		security: Shield,
		billing: CreditCard,
		members: Users,
		settings: Settings
	};

	const severityMeta: Record<
		AuditSeverity,
		{ label: string; variant: 'info' | 'warning' | 'error'; icon: typeof Info }
	> = {
		info: { label: 'Info', variant: 'info', icon: Info },
		warning: { label: 'Warning', variant: 'warning', icon: TriangleAlert },
		critical: { label: 'Critical', variant: 'error', icon: CircleAlert }
	};
</script>

<div class={['mx-auto w-full max-w-4xl space-y-6', className]}>
	<PageHeader {title} {description}>
		{#snippet meta()}
			<div class="flex flex-wrap items-center gap-2">
				<Badge size="sm" variant="secondary">{filtered.length} events</Badge>
				{#if updatedLabel}
					<span class="text-xs text-muted">{updatedLabel}</span>
				{/if}
			</div>
		{/snippet}
		{#snippet actions()}
			{#if onexport}
				<Button size="sm" variant="secondary" onclick={() => onexport?.()}>
					<Download class="h-3.5 w-3.5" strokeWidth={2} />
					Export
				</Button>
			{/if}
		{/snippet}
	</PageHeader>

	<div
		class="flex flex-col gap-3 rounded-2xl border border-border bg-surface-elevated p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-4"
	>
		<div class="min-w-0 flex-1 sm:max-w-xs">
			<SearchInput bind:value={query} placeholder="Search actors, actions, IP…" size="sm" />
		</div>
		{#if categories.length}
			<div class="overflow-x-auto">
				<SegmentedControl items={categories} bind:value={category} size="sm" />
			</div>
		{/if}
	</div>

	{#if filtered.length === 0}
		<div class="rounded-2xl border border-border bg-surface-elevated py-6 shadow-sm">
			<EmptyState
				title="No events"
				description="Try clearing filters or broadening your search."
				class="border-0 bg-transparent shadow-none"
			>
				{#snippet icon()}
					<ScrollText class="h-7 w-7" strokeWidth={1.75} />
				{/snippet}
			</EmptyState>
		</div>
	{:else}
		<div class="space-y-6">
			{#each groups as [day, dayEvents] (day)}
				<section class="space-y-2">
					<h2 class="px-1 text-[11px] font-semibold uppercase tracking-wide text-muted">{day}</h2>
					<ul
						class="overflow-hidden divide-y divide-border rounded-2xl border border-border bg-surface-elevated shadow-sm"
					>
						{#each dayEvents as event (event.id)}
							{@const CatIcon = categoryIcon[event.category ?? ''] ?? ScrollText}
							{@const severity = event.severity ?? 'info'}
							{@const sev = severityMeta[severity]}
							<li class="flex gap-3 px-4 py-3.5 transition-colors hover:bg-surface-overlay/40">
								<span
									class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-overlay text-secondary"
								>
									<CatIcon class="h-4 w-4" strokeWidth={2} />
								</span>

								<div class="min-w-0 flex-1 space-y-1.5">
									<div class="flex flex-wrap items-start justify-between gap-2">
										<div class="min-w-0">
											<p class="text-sm font-semibold text-primary">{event.title}</p>
											{#if event.description}
												<p class="mt-0.5 text-xs leading-relaxed text-muted">{event.description}</p>
											{/if}
										</div>
										<Time
											date={event.date}
											format="time"
											class="shrink-0 text-[11px] tabular-nums text-muted"
										/>
									</div>

									<div class="flex flex-wrap items-center gap-2">
										{#if event.category}
											<Badge size="sm" variant="secondary">{event.category}</Badge>
										{/if}
										{#if severity !== 'info'}
											<Badge size="sm" variant={sev.variant}>{sev.label}</Badge>
										{/if}
										{#if event.target}
											<span class="font-mono text-[11px] text-muted">{event.target}</span>
										{/if}
										{#if event.ip}
											<span class="font-mono text-[11px] text-muted">{event.ip}</span>
										{/if}
									</div>

									{#if event.actor}
										<div class="pt-0.5">
											<AvatarLabel name={event.actor} avatar={event.avatar} size="xs" />
										</div>
									{/if}
								</div>
							</li>
						{/each}
					</ul>
				</section>
			{/each}
		</div>
	{/if}
</div>
