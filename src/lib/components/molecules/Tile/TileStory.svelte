<script lang="ts">
	import Tile from './Tile.svelte';
	import type { TileAccent } from './Tile.svelte';
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import IconBox from '$lib/components/atoms/IconBox/IconBox.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Toggle from '$lib/components/atoms/Toggle/Toggle.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Users from '@lucide/svelte/icons/users';
	import FileText from '@lucide/svelte/icons/file-text';
	import Bell from '@lucide/svelte/icons/bell';
	import Inbox from '@lucide/svelte/icons/inbox';
	import FilePen from '@lucide/svelte/icons/file-pen';
	import Archive from '@lucide/svelte/icons/archive';
	import MoreVertical from '@lucide/svelte/icons/ellipsis-vertical';
	import type { Component } from 'svelte';

	interface Props {
		example?: 'list' | 'settings' | 'custom' | 'accents' | 'flush';
	}

	let { example = 'list' }: Props = $props();
	let last = $state('');
	let notif = $state(true);
	let selectedFlush = $state('inbox');

	const flushRows: {
		id: string;
		title: string;
		subtitle: string;
		meta: string;
		icon: Component;
		tone: 'brand' | 'neutral' | 'info';
	}[] = [
		{ id: 'inbox', title: 'Inbox', subtitle: '12 unread', meta: '12', icon: Inbox, tone: 'brand' },
		{ id: 'drafts', title: 'Drafts', subtitle: '3 items', meta: '3', icon: FilePen, tone: 'neutral' },
		{ id: 'archive', title: 'Archive', subtitle: 'Older mail', meta: '', icon: Archive, tone: 'info' }
	];
</script>

<div class="mx-auto w-full max-w-lg space-y-3 p-4">
	{#if example === 'list'}
		<p class="text-[11px] font-medium uppercase tracking-wide text-muted">List tiles</p>
		<div class="flex flex-col gap-1.5">
			<Tile
				title="Invoice #1042 paid"
				subtitle="Acme Corp"
				meta="$1,200"
				accent="brand"
				onclick={() => (last = 'invoice')}
			>
				{#snippet leading()}
					<Avatar name="Acme" size="sm" />
				{/snippet}
			</Tile>
			<Tile
				title="New team member"
				description="Grace Hopper joined Engineering"
				meta="2h ago"
				accent="success"
				onclick={() => (last = 'member')}
			>
				{#snippet leading()}
					<Avatar name="Grace Hopper" size="sm" />
				{/snippet}
			</Tile>
			<Tile
				title="API key created"
				subtitle="Production environment"
				meta="5:42 PM"
				accent="info"
				onclick={() => (last = 'api')}
			>
				{#snippet leading()}
					<IconBox tone="info" size="sm" rounded="lg">
						<FileText class="h-4 w-4" aria-hidden="true" />
					</IconBox>
				{/snippet}
			</Tile>
		</div>
	{:else if example === 'settings'}
		<p class="text-[11px] font-medium uppercase tracking-wide text-muted">Settings-style</p>
		<div class="flex flex-col gap-1.5">
			<Tile title="Team" subtitle="Roles and invitations" accent="brand" onclick={() => (last = 'team')}>
				{#snippet leading()}
					<IconBox tone="brand" size="sm">
						<Users class="h-4 w-4" aria-hidden="true" />
					</IconBox>
				{/snippet}
				{#snippet trailing()}
					<Badge size="sm" variant="secondary" rounded>12</Badge>
				{/snippet}
			</Tile>
			<Tile title="Notifications" subtitle="Push and email alerts" accent="warning" chevron={false}>
				{#snippet leading()}
					<IconBox tone="warning" size="sm">
						<Bell class="h-4 w-4" aria-hidden="true" />
					</IconBox>
				{/snippet}
				{#snippet trailing()}
					<Toggle bind:checked={notif} />
				{/snippet}
			</Tile>
			<Tile title="Disabled row" subtitle="Requires admin" disabled accent="neutral" onclick={() => {}}>
				{#snippet leading()}
					<IconBox tone="neutral" size="sm">
						<FileText class="h-4 w-4" aria-hidden="true" />
					</IconBox>
				{/snippet}
			</Tile>
		</div>
	{:else if example === 'custom'}
		<p class="text-[11px] font-medium uppercase tracking-wide text-muted">Custom children</p>
		<Tile accent="brand" chevron={false} onclick={() => (last = 'custom')}>
			{#snippet leading()}
				<Avatar name="Rafael" size="md" />
			{/snippet}
			{#snippet trailing()}
				<IconButton label="More" size="sm" variant="ghost">
					<MoreVertical class="h-4 w-4" aria-hidden="true" />
				</IconButton>
			{/snippet}
			<div class="min-w-0">
				<p class="text-sm font-semibold leading-tight text-primary">Rafael González</p>
				<p class="mt-0.5 text-xs leading-tight text-muted">Owner · rafael@r2digisolutions.com</p>
				<div class="mt-1.5 flex flex-wrap gap-1">
					<Badge size="sm" variant="primary" rounded>Pro</Badge>
					<Badge size="sm" variant="secondary" rounded>EU</Badge>
				</div>
			</div>
		</Tile>
	{:else if example === 'accents'}
		<p class="text-[11px] font-medium uppercase tracking-wide text-muted">Accent colors</p>
		<div class="flex flex-col gap-1.5">
			{#each ['brand', 'success', 'warning', 'danger', 'info', 'neutral', 'none'] as a (a)}
				<Tile
					title={`${a} accent`}
					subtitle="Left edge indicator"
					accent={a as TileAccent}
					chevron={false}
				/>
			{/each}
		</div>
	{:else}
		<p class="text-[11px] font-medium uppercase tracking-wide text-muted">Flush list</p>
		<div
			class="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface-elevated"
		>
			{#each flushRows as row (row.id)}
				{@const Icon = row.icon}
				<Tile
					title={row.title}
					subtitle={row.subtitle}
					variant="flush"
					selected={selectedFlush === row.id}
					onclick={() => {
						selectedFlush = row.id;
						last = row.title;
					}}
				>
					{#snippet leading()}
						<IconBox tone={row.tone} size="sm" rounded="lg">
							<Icon class="h-4 w-4" aria-hidden="true" />
						</IconBox>
					{/snippet}
					{#snippet trailing()}
						{#if row.meta}
							<Badge size="sm" variant="secondary" rounded>{row.meta}</Badge>
						{/if}
					{/snippet}
				</Tile>
			{/each}
		</div>
	{/if}

	{#if last}
		<p class="text-xs text-muted">Clicked: <span class="font-medium text-primary">{last}</span></p>
	{/if}
</div>
