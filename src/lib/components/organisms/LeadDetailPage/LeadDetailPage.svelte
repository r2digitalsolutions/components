<script lang="ts">
	import PageHeader from '$lib/components/molecules/PageHeader/PageHeader.svelte';
	import AuditEventRow from '$lib/components/molecules/AuditEventRow/AuditEventRow.svelte';
	import type { AuditEventSeverity } from '$lib/components/molecules/AuditEventRow/AuditEventRow.svelte';
	import ThreadReply from '$lib/components/molecules/ThreadReply/ThreadReply.svelte';
	import QuickActionGrid from '$lib/components/molecules/QuickActionGrid/QuickActionGrid.svelte';
	import type { QuickAction } from '$lib/components/molecules/QuickActionGrid/QuickActionGrid.svelte';
	import EntityPreview from '$lib/components/molecules/EntityPreview/EntityPreview.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Card from '$lib/components/molecules/Card/Card.svelte';
	import Textarea from '$lib/components/atoms/Textarea/Textarea.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	export interface LeadProfile {
		name: string;
		company?: string;
		email?: string;
		phone?: string;
		status?: string;
		score?: number;
	}

	export interface LeadEvent {
		id: string;
		action: string;
		actor?: string;
		target?: string;
		time?: Date | string | number;
		severity?: AuditEventSeverity;
		ip?: string;
	}

	export interface LeadReply {
		id: string;
		author: string;
		body: string;
		avatar?: string;
		time?: string;
		depth?: number;
	}

	export interface RelatedLead {
		id: string;
		title: string;
		subtitle?: string;
		meta?: string;
		image?: string;
		kind?: string;
	}

	interface LeadDetailPageProps {
		lead: LeadProfile;
		events?: LeadEvent[];
		replies?: LeadReply[];
		related?: RelatedLead[];
		actions?: QuickAction[];
		class?: string;
		onaction?: (id: string) => void;
		onreply?: (body: string) => void;
	}

	let {
		lead,
		events = [],
		replies = [],
		related = [],
		actions = [
			{ id: 'email', label: 'Send email', description: 'Compose outreach', icon: 'share' },
			{ id: 'call', label: 'Log call', description: 'Record conversation', icon: 'plus' },
			{ id: 'meeting', label: 'Schedule', description: 'Book a meeting', icon: 'search' },
			{ id: 'note', label: 'Add note', description: 'Internal note', icon: 'upload' }
		],
		class: className = '',
		onaction,
		onreply
	}: LeadDetailPageProps = $props();

	let draft = $state('');

	const statusVariant = $derived(
		lead.status === 'Qualified'
			? 'success'
			: lead.status === 'Contacted'
				? 'info'
				: lead.status === 'Lost'
					? 'error'
					: 'secondary'
	);

	function submitReply() {
		const body = draft.trim();
		if (!body) return;
		onreply?.(body);
		draft = '';
	}
</script>

<div class={['mx-auto w-full max-w-6xl space-y-6', className]}>
	<PageHeader title={lead.name} description={lead.company}>
		{#snippet meta()}
			<div class="flex flex-wrap items-center gap-2 pt-1">
				{#if lead.status}
					<Badge variant={statusVariant} size="sm">{lead.status}</Badge>
				{/if}
				{#if lead.score != null}
					<Badge variant="primary" size="sm">Score {lead.score}</Badge>
				{/if}
				{#if lead.email}
					<span class="text-xs text-muted">{lead.email}</span>
				{/if}
				{#if lead.phone}
					<span class="text-xs text-muted">· {lead.phone}</span>
				{/if}
			</div>
		{/snippet}
	</PageHeader>

	<QuickActionGrid {actions} columns={4} onaction={(id) => onaction?.(id)} />

	<div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
		<div class="min-w-0 space-y-6">
			<section class="space-y-3">
				<h2 class="text-sm font-semibold text-primary">Activity</h2>
				<ul class="space-y-2" role="list">
					{#each events as event (event.id)}
						<li>
							<AuditEventRow
								action={event.action}
								actor={event.actor}
								target={event.target}
								time={event.time}
								severity={event.severity}
								ip={event.ip}
							/>
						</li>
					{/each}
				</ul>
			</section>

			<section class="space-y-4">
				<h2 class="text-sm font-semibold text-primary">Comments</h2>
				<div class="space-y-4">
					{#each replies as reply (reply.id)}
						<ThreadReply
							author={reply.author}
							body={reply.body}
							avatar={reply.avatar}
							time={reply.time}
							depth={reply.depth}
							onreply={() => onreply?.('')}
						/>
					{/each}
				</div>

				<Card padding="md" chrome={false}>
					<div class="space-y-3">
						<Textarea
							bind:value={draft}
							placeholder="Add an internal comment…"
							rows={3}
						/>
						<div class="flex justify-end">
							<Button size="sm" disabled={!draft.trim()} onclick={submitReply}>
								Post comment
							</Button>
						</div>
					</div>
				</Card>
			</section>
		</div>

		<aside class="min-w-0 space-y-4">
			<section class="space-y-2">
				<h2 class="text-sm font-semibold text-primary">Related</h2>
				<ul class="space-y-2" role="list">
					{#each related as item (item.id)}
						<li>
							<EntityPreview
								title={item.title}
								subtitle={item.subtitle}
								meta={item.meta}
								image={item.image}
								kind={item.kind}
								onclick={() => onaction?.(item.id)}
							/>
						</li>
					{/each}
				</ul>
			</section>
		</aside>
	</div>
</div>
