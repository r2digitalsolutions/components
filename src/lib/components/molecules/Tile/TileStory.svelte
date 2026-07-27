<script lang="ts">
	import Tile from './Tile.svelte';
	import type { TileAccent, TileVariant } from './Tile.svelte';
	import Avatar from '$lib/components/atoms/Avatar/Avatar.svelte';
	import IconBox from '$lib/components/atoms/IconBox/IconBox.svelte';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Toggle from '$lib/components/atoms/Toggle/Toggle.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Users from '@lucide/svelte/icons/users';
	import FileText from '@lucide/svelte/icons/file-text';
	import Bell from '@lucide/svelte/icons/bell';
	import MoreVertical from '@lucide/svelte/icons/ellipsis-vertical';

	interface Props {
		example?: 'list' | 'settings' | 'custom' | 'accents' | 'flush';
	}

	let { example = 'list' }: Props = $props();
	let last = $state('');
	let notif = $state(true);
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
		<p class="text-[11px] font-medium uppercase tracking-wide text-muted">Flush / plain variants</p>
		<div class="overflow-hidden rounded-xl border border-border bg-surface-elevated">
			{#each [
				{ t: 'Inbox', d: '12 unread', v: 'flush' as TileVariant },
				{ t: 'Drafts', d: '3 items', v: 'flush' as TileVariant },
				{ t: 'Archive', d: 'Older mail', v: 'flush' as TileVariant }
			] as row, i (row.t)}
				<Tile
					title={row.t}
					subtitle={row.d}
					variant="flush"
					accent={i === 0 ? 'brand' : 'none'}
					selected={i === 0}
					onclick={() => (last = row.t)}
					class={i > 0 ? 'border-t border-border' : ''}
				/>
			{/each}
		</div>
	{/if}

	{#if last}
		<p class="text-xs text-muted">Clicked: <span class="font-medium text-primary">{last}</span></p>
	{/if}
</div>
