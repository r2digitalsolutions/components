<script lang="ts">
	import NotificationRow from './NotificationRow.svelte';
	import type { NotificationRowData } from './NotificationRow.svelte';

	let {
		example = 'inbox'
	}: {
		example?: 'inbox' | 'types' | 'withActions';
	} = $props();

	let items = $state<NotificationRowData[]>([
		{
			id: '1',
			title: 'Deploy succeeded',
			description: 'Production release v2.4.1 is live on all regions.',
			time: Date.now() - 1000 * 60 * 4,
			type: 'success',
			read: false
		},
		{
			id: '2',
			title: 'Maya left a comment',
			description: '“Looks good — one small nit on the FormSection padding.”',
			time: Date.now() - 1000 * 60 * 60,
			type: 'info',
			read: false,
			actor: 'Maya Chen',
			avatar: 'https://i.pravatar.cc/80?img=5'
		},
		{
			id: '3',
			title: 'Quota warning',
			description: 'You have used 90% of your API quota this billing period.',
			time: Date.now() - 1000 * 60 * 60 * 5,
			type: 'warning',
			read: true
		},
		{
			id: '4',
			title: 'Payment failed',
			description: 'We could not charge the card ending in 4242.',
			time: Date.now() - 1000 * 60 * 60 * 26,
			type: 'error',
			read: true
		}
	]);

	let last = $state('');

	const typeSamples: NotificationRowData[] = [
		{
			id: 't1',
			title: 'Info',
			description: 'Neutral product update.',
			type: 'info',
			time: Date.now(),
			read: false
		},
		{
			id: 't2',
			title: 'Success',
			description: 'Action completed.',
			type: 'success',
			time: Date.now(),
			read: false
		},
		{
			id: 't3',
			title: 'Warning',
			description: 'Needs attention soon.',
			type: 'warning',
			time: Date.now(),
			read: false
		},
		{
			id: 't4',
			title: 'Error',
			description: 'Something went wrong.',
			type: 'error',
			time: Date.now(),
			read: false
		}
	];

	function markRead(id: string) {
		items = items.map((n) => (n.id === id ? { ...n, read: true } : n));
		last = id;
	}

	function markAllRead() {
		items = items.map((n) => ({ ...n, read: true }));
	}

	const unread = $derived(items.filter((n) => !n.read).length);

	const actionBtn =
		'rounded-md px-2 py-1 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30';
</script>

<div class="w-full max-w-md space-y-3">
	<div class="space-y-1">
		<p class="text-sm font-semibold text-primary">Notification row</p>
		<p class="text-xs text-secondary">
			Fila de inbox: icono por tipo, avatar, unread badge y tiempo relativo.
		</p>
	</div>

	{#if example === 'types'}
		<div class="overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm">
			<div class="border-b border-border px-3.5 py-2.5">
				<p class="text-xs font-semibold text-primary">Type icons</p>
			</div>
			<div class="divide-y divide-border">
				{#each typeSamples as item (item.id)}
					<NotificationRow {item} density="compact" />
				{/each}
			</div>
		</div>
	{:else if example === 'withActions'}
		<div class="overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm">
			<NotificationRow
				item={{
					id: 'a1',
					title: 'Deploy succeeded',
					description: 'production-release-v2.4.1 is live.',
					time: Date.now() - 1000 * 60 * 4,
					type: 'success',
					read: false
				}}
			>
				{#snippet actions()}
					<button
						type="button"
						class={[actionBtn, 'bg-brand-500 text-white hover:bg-brand-600']}
					>
						View details
					</button>
					<button
						type="button"
						class={[actionBtn, 'border border-border text-secondary hover:bg-surface-overlay']}
					>
						Copy URL
					</button>
				{/snippet}
			</NotificationRow>
		</div>
	{:else}
		<div class="overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm">
			<div class="flex items-center justify-between border-b border-border px-3.5 py-2.5">
				<div class="flex items-center gap-2">
					<p class="text-sm font-semibold text-primary">Notifications</p>
					{#if unread > 0}
						<span
							class="rounded-full bg-brand-100 px-1.5 py-0.5 text-[10px] font-semibold text-brand-700 dark:bg-brand-900 dark:text-brand-300"
						>
							{unread} new
						</span>
					{/if}
				</div>
				{#if unread > 0}
					<button
						type="button"
						class="text-[11px] font-medium text-brand-600 hover:underline dark:text-brand-400"
						onclick={markAllRead}
					>
						Mark all read
					</button>
				{/if}
			</div>
			<div class="divide-y divide-border">
				{#each items as item (item.id)}
					<NotificationRow {item} onclick={(n) => markRead(n.id)} />
				{/each}
			</div>
		</div>
		{#if last}
			<p class="text-[11px] text-muted">Marked read: {last}</p>
		{/if}
	{/if}
</div>
